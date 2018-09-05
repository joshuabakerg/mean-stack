var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

/*admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mean-angular.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("/user");
ref.orderByChild("username").once("value")
  .then(value => {
    value.forEach(a => console.log(a.val()));
  });*/
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
var docRef = db.collection('users').doc('alovelace');

docRef.get()
  .then(serviceAccount => {
    console.log(serviceAccount.data());
  });
