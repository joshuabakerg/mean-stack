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

let file = bucket.file("joshua/profilePic");
file.get().then(value => {
  let apiResponse = value[1];
  return "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + apiResponse.metadata.firebaseStorageDownloadTokens
}).then(console.log);

// bucket.upload('./src/assets/images/unknown.png', {destination : "joshua23/unknown.png"}).then(data => {
//   console.log('upload success');
//   console.log(data);
// }).catch(err => {
//   console.log('error uploading to storage', err);
// });



