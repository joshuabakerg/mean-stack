var admin = require("firebase-admin");

let noLoginRequired = ["/services/user/register"];

let users = [];

var db = admin.database();
var userRef = db.ref("/user");

userRef.on("child_changed", value => {
  let userChange = value.val();
  users.removeIf(user => user.login.username === userChange.login.username);
  users.push(userChange);
});

let requestAuthentication = (res) => {
  res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
  res.status(401).send('Authentication required.');
};

let getAuth = async (b64auth) => {
  const [username, password] = new Buffer(b64auth, 'base64').toString().split(':');
  let auth = users.find((item) => item.login.username === username);
  if(!auth){
    let dbResults = (await userRef.orderByChild("login/username").equalTo(username).once("value")).val();
    auth = Object.values(dbResults||{})[0];
    if (auth) {
      users.push(auth);
    }
  }
  return auth && auth.login.password === password ? auth : undefined;
};

function assignUserToRequest(auth, req) {
  let copiedUser = JSON.parse(JSON.stringify(auth));
  copiedUser.login = {username: copiedUser.login.username};
  req.user = copiedUser;
}

module.exports.authentication = async (req, res, next) => {
  try {
    if(noLoginRequired.filter(value => value === req.originalUrl).length > 0){
      next();
      return
    }

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
    assignUserToRequest(auth, req);
    next()
  } catch (e) {
    console.log(e)
  }
};
