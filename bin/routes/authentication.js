var {userService} = require("../context");

let noLoginRequired = [
  "/services/user/register",
  "/services/user/login"
];

let getAuth = async (req) => {
  const sessionId = req.cookies.sessionid;
  let auth = await userService.getUserBySessionId(sessionId);
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
