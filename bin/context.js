let UserService = require("./services/user.service");
let ChatService = require("./services/chat.service");

if(!global.context){
  global.context = {};
  global.context.userService = new UserService();
  global.context.chatService = new ChatService();
}

module.exports = global.context;
