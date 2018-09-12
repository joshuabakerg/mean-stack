var express = require('express');
var router = express.Router();
let context = require("../context");
let chatService = context.chatService;

/* GET home page. */
router.get('/', function (req, res, next) {
  chatService.getAllMessages().then(value => {
    res.send(value);
  });
});

module.exports = router;
