let context = require("../context");
let {joinChat, exitChat, newMessage} = require("./message.handler");
let {registerSession} = require("./session.handler");

class Hander {
  constructor(io) {
    this.io = io;
    this.routes = [
      {type : "register-session", call: registerSession},
      {type : "join-chat", call: joinChat},
      {type : "exit-chat", call: exitChat},
      {type : "create-new-message", call: newMessage}
    ];
  }

  async onMessage(socket, event) {
    let userService = context.userService;
    let user = await userService.getUserBySessionId(event.sessionId);
    event.user = user;
    if(user){
      this.routes.forEach(value => {
        if(value.type === event.type){
          value.call(this.io, socket, event);
        }
      })
    }else{
      console.log(`Could not authenticate user with event ${event}`)
    }
  };

  async onDisconnect() {

  }
}
  module.exports = Hander;
