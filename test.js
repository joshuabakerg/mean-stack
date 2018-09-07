const request = require("request");
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
serviceAccount.private_key = process.env.FIRE_BASE_PRIVATE_KEY.replace(/\\n/g, '\n');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mean-angular.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("/user");
ref.orderByChild("login/username").equalTo("joshua").once("value")
  .then(value => {
    console.log(JSON.stringify(value.val(), undefined, 2));
  });



/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
var docRef = db.collection('users').doc('alovelace');

docRef.get()
  .then(serviceAccount => {
    console.log(serviceAccount.data());
  });
*/
