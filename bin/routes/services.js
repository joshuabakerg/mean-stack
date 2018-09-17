var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var chat = require("./chat");
var server = require("./server");
var script = require("./script");
var user = require("./user");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({'extended':'false'}));

/* GET home page. */
router.use("/chat", chat);
router.use("/server", server);
router.use("/script", script);
router.use("/user", user);

module.exports = router;
