var express = require('express');
var router = express.Router();
let Server = require('../../models/Server');


/* GET home page. */
router.get('/', function (req, res, next) {
  /*Server.find((err, servers)=>{
    res.send(servers);
  })*/
  res.send(
    [
      {
        _id: "5b3b72b0f8c8c74d54994fd5",
        name: "DHPNBJASW01"
      }
    ]
  )

});

module.exports = router;
