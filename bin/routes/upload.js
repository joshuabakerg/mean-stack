var express = require('express');
var router = express.Router();
var formidable = require('formidable');
let uploadService = require("../context").uploadService;

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("here");
  res.send("done");
});

router.post('/:type', function (req, res, next) {
  try {
    let type = req.params.type;
    if (type === "profilepic") {
      let form = new formidable.IncomingForm();
      form.parse(req, (err, fileds, files) => {
        uploadService.uploadProfilePicture(req.user.login.username, files.pic.path, {
          type: files.pic.type,
          deleteAfter: true
        })
          .then((url) => {
            res.send({success: true, message: url});
          });
      });
    } else {
      res.send({success: false, message: 'Please specify the type of upload'});
    }
  } catch (e) {
    res.status(500).send({success: false, message: "Failed to upload file " + e.stack});
  }
});

module.exports = router;
