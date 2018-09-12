var express = require('express');
var router = express.Router();
var chat = require("./chat");
var server = require("./server");
var script = require("./script");
var user = require("./user");

/* GET home page. */
router.use("/chat", chat);
router.use("/server", server);
router.use("/script", script);
router.use("/user", user);

module.exports = router;
