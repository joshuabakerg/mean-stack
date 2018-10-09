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

function getUsers() {
// ref.orderByChild("login/username").equalTo("joshua").once("value")
  db.ref("/user").once("value")
    .then(value => {
      // console.log(value.val());
      let key = getChildren(value)[0];
      let user = JSON.stringify(key);
      console.log(user)
    });
}

function addBasicChat() {
  db.ref("/chat").set({
    convs: {
      "conv1": {
        users: ["joshua", "jess"],
        messages: "mess1"
      },
      "conv2": {
        users: ["joshua", "test"],
        messages: "mess2"
      }
    },
    messages: {
      "mess1": [{from: "joshua", content: "hello", time: new Date().getTime()}],
      "mess2": [{from: "jess", content: "hello", time: new Date().getTime()}]
    },
    details: {
      "joshua": {
        convIds: ["conv1", "conv2"],
        status: "Hello this is my status",
        available: "offline"
      },
      "jess": {
        convIds: ["conv1"],
        status: "Hello this Jess",
        available: "offline"
      },
      "test": {
        convIds: ["conv2"],
        status: "Hello this test",
        available: "offline"
      }
    }
  }).then((res) => {
    console.log(res)
  });
}

// addBasicChat();

// db.ref("/chat/messages/mess1").push({content: "adsasdas", from: "joshua", time: 34534534543})

function getChat() {
  let start = new Date().getTime();
  db.ref('/chat/link/joshua').once("value")
    .then((res) => {
      console.log(new Date().getTime() - start)
      return res.val().conv
    })
    .then((id) => db.ref(`/chat/convs/${id}`).once("value"))
    .then((res) => {
      console.log(res.val());
      console.log(new Date().getTime() - start)
    })
}

// getChat();

function getPicUrl() {
  var bucket = admin.storage().bucket();
  let file = bucket.file("joshua/profilePic");
  file.get().then(value => {
    let apiResponse = value[1];
    return "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + apiResponse.metadata.firebaseStorageDownloadTokens
  }).then(console.log);
}


let sad = {
  asd: "adsad",
  gfdvg: "sdafsdf",
  lkxjvgkjdf: "bccxvg",
  lksjdfkl: "klshdf"
};

sad.map((item)=>{
  console.log(item);
  return item;
});

