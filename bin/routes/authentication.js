let users = [
  {login: "joshua", password: "joshua", roles: ["admin"]},
  {login: "test", password: "password1", roles: ["user"]},
  {login: "dummy", password: "password1", roles: ["user"]},
];

let requestAuthentication = (res) => {
  res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
  res.status(401).send('Authentication required.');
};

let getAuth = (b64auth) => {
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');
  let auth = users.find((item) => item.login == login);
  return auth && auth.password === password ? auth : undefined;
};

module.exports.authentication = (req, res, next) => {
  try {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    let auth = getAuth(b64auth);

    if (b64auth && req.originalUrl == "/logout") {
      console.log("loggin out");
      requestAuthentication(res);
      return
    }
    if (!auth) {
      console.log("requesting authentications");
      requestAuthentication(res);
      return
    }
    console.log("authenticated user");
    req.user = auth;
    next()
  } catch (e) {
    console.log(e)
  }
};
