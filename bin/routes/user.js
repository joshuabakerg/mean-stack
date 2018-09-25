const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

let userService = require("../context").userService;

let userRef = require("firebase-admin").database().ref("/user");
const {getChildren, getFirstKeyFromSnapshot} = require("../utils/SnapUtils");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(req.user);
});

router.get('/all', async (req, res, next) => {
  try{
    let allUsers = await userService.getAllUsers();
    res.send(allUsers);
  }catch (e) {
    res.send({status: "failed", message: e})
  }
});

router.get('/logout', async function (req, res, next) {
  try {
    let dbResult = await userRef.orderByChild("login/sessionid")
      .equalTo(req.cookies.sessionid)
      .once("value");
    let key = getFirstKeyFromSnapshot(dbResult);
    console.log(key);
    userRef.child(`${key}/login/sessionid`).set(null);
    res.send({success: true, message: "Successfully logged out"})
  } catch (e) {
    console.log(e);
    res.send({success: false, message: e});
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
    res.cookie('sessionid', sessionId, {maxAge: 900000000000});
    res.send({success: true, message: "Successfully logged in", user: dbUser});
  } else {
    res.send({success: false, message: "Incorrect login details"});
  }
});

router.post('/register', async function (req, res, next) {
  try{
    let newUser = req.body;
    let response = await userService.register(newUser);
    res.send(response);
  }catch (e) {
    res.status(500).send({created: false, message: e});
  }

});

router.delete('/:username', async function (req, res, next) {
  try {
    if(req.user.roles.includes("admin")){
      let response = await userService.deleteByUsername(req.params.username);
      res.send({success: response});
    }else {
      res.status(403).send({success: false, message: "Admin role required to delete user"})
    }
  } catch (e) {
    console.log(e);
    res.send({success: false, message: e.toString()});
  }
});


module.exports = router;
