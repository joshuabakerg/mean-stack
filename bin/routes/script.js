let {getChildren} = require("../utils/SnapUtils");

var express = require('express');
var router = express.Router();
let scriptsDb = require("firebase-admin").database().ref("/script");


/* GET home page. */
router.get('/', function (req, res, next) {
  let start = new Date().getTime();
  scriptsDb.once("value").then(snap=>{
    let scripts = getChildren(snap);
    console.log(`Took ${new Date().getTime()-start} to get scripts`);
    res.send(scripts);
  });

});

module.exports = router;
