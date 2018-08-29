var express = require('express');
var router = express.Router();
var server = require("./server");
var script = require("./script");


/* GET home page. */
router.use("/server", server);
router.use("/script", script);

module.exports = router;
