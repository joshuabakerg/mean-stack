var express = require('express');
var router = express.Router();
let Script = require('../../models/Script');


/* GET home page. */
router.get('/', function (req, res, next) {
  /*Script.find((err, scripts)=>{
    console.log(scripts);
    res.send(scripts);
  })*/
  res.send(
    [
      {
        run_intervals: -1,
        _id: "5b3b6c942634151cd87adc68",
        _class: "za.co.discovery.nb.poc.Model.CronScript.CronScript",
        name: "CapitationAutomation.py",
        type: "py",
        directory: "/utils",
        contents: "",
        size: 2013,
        last_run: "2018-08-06T08:49:04.723Z",
        created: "2018-07-03T12:31:16.195Z",
        last_modified: "2018-08-06T08:49:04.742Z"
      }
    ]
  )

});

module.exports = router;
