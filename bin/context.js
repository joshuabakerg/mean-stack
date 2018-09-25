var admin = require("firebase-admin");

let UserService = require("./services/user.service");
let ChatService = require("./services/chat.service");
let EmailService = require("./services/email.service");
let UploadService = require("./services/upload.service");

function getAuth() {
  let authJson = Buffer.from(process.env.APP_AUTH, 'base64').toString('ascii');
  return JSON.parse(authJson);
}

if (!global.context) {
  let auth = getAuth();

  //Firebase
  console.log(JSON.stringify(auth, undefined, 2));
  admin.initializeApp({
    credential: admin.credential.cert(auth.serviceAccount),
    databaseURL: "https://mean-angular.firebaseio.com",
    storageBucket: "mean-angular.appspot.com"
  });

  let emailService = new EmailService('mail.joshuabakerg.co.za', 587, auth.emailAccount);
  let userService = new UserService(emailService);
  let chatService = new ChatService();
  let uploadService = new UploadService(userService);

  global.context = {auth, emailService, userService, chatService, uploadService};
}

module.exports = global.context;
