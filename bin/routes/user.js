var express = require('express');
var router = express.Router();
let userRef = require("firebase-admin").database().ref("/user");
const {getChildren} = require("../utils/SnapUtils");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(req.user);
});

router.get('/lol', function (req, res, next) {
  res.send("lol");
});

router.post('/register', async function (req, res, next) {
  let newUser = req.body;
  if (!isUserValid(newUser)) {
    res.send("Required fields missing");
  } else if(await userExists(newUser)){
    res.send("User already exists");
  }else{
    res.send("Created user");
  }
});

let isUserValid = (newUser) => {
  return newUser.name.first &&
    newUser.login.username &&
    newUser.login.password &&
    newUser.email;
};

let userExists = async (newUser) => {
  let users = getChildren(await userRef.once("value"));
  return users.filter(user => {
    return user.login.username === newUser.login.username ||
      user.email === newUser.email
  }).length > 0;
};

module.exports = router;
