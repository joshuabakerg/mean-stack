const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
let userRef = require("firebase-admin").database().ref("/user");
const {getChildren, getFirstKeyFromSnapshot} = require("../utils/SnapUtils");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(req.user);
});

router.get('/logout', async function (req, res, next) {
  try{
    let dbResult = await userRef.orderByChild("login/sessionid")
      .equalTo(req.cookies.sessionid)
      .once("value");
    let key = getFirstKeyFromSnapshot(dbResult);
    console.log(key);
    userRef.child(`${key}/login/sessionid`).set(null);
    res.send({success:true, message: "Successfully logged out"})
  }catch (e) {
    console.log(e);
    res.send({success:false, message: e});
  }
});

router.post('/login', async function (req, res, next) {
  let login = req.body;
  let dbResult = await userRef.orderByChild("login/username")
    .equalTo(login.username)
    .once("value");
  let dbUser = getChildren(dbResult)[0];
  if (dbUser && dbUser.login.password === login.password) {
    let sessionId = uuidv4();
    let key = getFirstKeyFromSnapshot(dbResult);
    userRef.child(`${key}/login/sessionid`).set(sessionId);
    res.cookie('sessionid', sessionId, {maxAge: 10800});
    res.send({success:true, message: "Successfully logged in", user: dbUser});
  } else {
    res.send({success:false, message: "Incorrect login details"});
  }
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
