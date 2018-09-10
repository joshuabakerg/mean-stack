let context = require("../context");
let {newMessage} = require("./message.handler");

class Hander {
  constructor(io) {
    this.io = io;
    this.routes = [
      {type : "new-message", call: newMessage}
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
