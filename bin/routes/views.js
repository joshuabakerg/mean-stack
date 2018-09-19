var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");


router.use(express.static(path.join(__dirname, '../../dist')));
router.use((req, res, next)=>{
  fs.readFile(path.join(__dirname, '../../dist/index.html'), (err,data)=>{
    res.type('html');
    res.send(data);
  });
});

module.exports = router;
