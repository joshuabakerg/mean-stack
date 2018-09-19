var admin = require("firebase-admin");

let UserService = require("./services/user.service");
let ChatService = require("./services/chat.service");
let EmailService = require("./services/email.service");

function getAuth(){
  let authJson = Buffer.from(process.env.APP_AUTH, 'base64').toString('ascii');
  return JSON.parse(authJson);
}

if(!global.context){
  global.context = {};
  global.context.auth = getAuth();
  console.log(JSON.stringify(global.context.auth, undefined, 2));
  admin.initializeApp({credential: admin.credential.cert(global.context.auth.serviceAccount), databaseURL: "https://mean-angular.firebaseio.com"});
  global.context.emailService = new EmailService('mail.joshuabakerg.co.za', 587, global.context.auth.emailAccount);
  global.context.userService = new UserService(global.context.emailService);
  global.context.chatService = new ChatService();
}

module.exports = global.context;
