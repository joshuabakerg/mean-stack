var admin = require("firebase-admin");

let users = [];

var db = admin.database();
var userRef = db.ref("/user");


let requestAuthentication = (res) => {
  res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
  res.status(401).send('Authentication required.');
};

let getAuth = async (b64auth) => {
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');
  let auth = users.find((item) => item.login === login);
  if(!auth){
    let dbResults = (await userRef.orderByChild("login").equalTo(login).once("value")).val();
    auth = Object.values(dbResults||{})[0];
    if (auth) {
      users.push(auth);
    }
  }
  return auth && auth.password === password ? auth : undefined;
};

module.exports.authentication = async (req, res, next) => {
  try {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    let auth = await getAuth(b64auth);

    if (b64auth && req.originalUrl == "/logout") {
      console.log("loggin out");
      requestAuthentication(res);
      return;
    }
    if (!auth) {
      console.log("requesting authentications");
      requestAuthentication(res);
      return;
    }
    req.user = auth;
    next()
  } catch (e) {
    console.log(e)
  }
};
