var admin = require("firebase-admin");

let noLoginRequired = [
  "/services/user/register",
  "/services/user/login"
];

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

let getAuth = async (req) => {
  const sessionId = req.cookies.sessionid;
  let auth = await getSessionIdAuth(sessionId);
  return auth;
};

let getSessionIdAuth = async (sessionId) => {
  if(!sessionId)return;
  let auth = users.find((item) => item.login.sessionid === sessionId);
  if(!auth){
    let dbResults = (await userRef.orderByChild("login/sessionid").equalTo(sessionId).once("value")).val();
    auth = Object.values(dbResults||{})[0];
    if (auth) {
      users.removeIf(user => user.login.username === auth.login.username);
      users.push(auth);
    }
  }
  return auth;
};

function assignUserToRequest(auth, req) {
  let copiedUser = JSON.parse(JSON.stringify(auth));
  copiedUser.login = {username: copiedUser.login.username};
  req.user = copiedUser;
}

module.exports.authentication = async (req, res, next) => {
  try {
    if(noLoginRequired.filter(value => value === req.originalUrl).length > 0 || req.originalUrl.startsWith("/view")) {
      next();
      return;
    }

    let auth = await getAuth(req);
    if (!auth && req.originalUrl !== "/services/user") {
      console.log("requesting authentications");
      res.status(401).send('Authentication required.');
      return;
    }
    if(auth)
      assignUserToRequest(auth, req);
    next();
  } catch (e) {
    console.log(e)
  }
};
