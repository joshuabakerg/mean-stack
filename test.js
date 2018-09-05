var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mean-angular.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("/user");
ref.orderByChild("username").once("value")
  .then(value => {
    value.forEach(a => console.log(a.val()));
  });
