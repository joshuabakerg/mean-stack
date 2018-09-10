let UserService = require("./services/user.service");

if(!global.context){
  global.context = {};
  global.context.userService = new UserService();
}

module.exports = global.context;
