let users = [
  {login: "joshua", password: "joshua", roles: ["admin"]},
  {login: "test", password: "password1", roles: ["user"]},
  {login: "dummy", password: "password1", roles: ["user"]},
];


module.exports = (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');
  let auth = users.find((item)=>item.login == login);
  if (!login || !password || !auth || login !== auth.login || password !== auth.password) {
    res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
    res.status(401).send('Authentication required.'); // custom message
    return
  }
  res.user = auth;
  next()
};
