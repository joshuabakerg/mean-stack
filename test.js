const {getChildren, getFirstKeyFromSnapshot} = require("./bin/utils/SnapUtils");
var admin = require("firebase-admin");

let authJson = Buffer.from(process.env.APP_AUTH, 'base64').toString('ascii');
let auth = JSON.parse(authJson);

admin.initializeApp({
  credential: admin.credential.cert(auth.serviceAccount),
  databaseURL: "https://mean-angular.firebaseio.com",
  storageBucket: "mean-angular.appspot.com"
});

var db = admin.database();
// ref.orderByChild("login/username").equalTo("joshua").once("value")
db.ref("/user").once("value")
  .then(value => {
    // console.log(value.val());
    let key = getChildren(value)[0];
    let user = JSON.stringify(key);
    console.log(user)
  });

var bucket = admin.storage().bucket();

bucket.upload('./src/assets/images/unknown.png').then(data => {
  console.log('upload success');
  console.log(data);
}).catch(err => {
  console.log('error uploading to storage', err);
});



