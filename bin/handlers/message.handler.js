let context = require("../context");
let chatService = context.chatService;

let newMessage = (io, socket, event) => {
  let message = {
    from: event.user.login.username,
    time: new Date().getTime(),
    message: event.message,
    pic : event.user.picture.thumbnail
  };
  chatService.saveMessage(message);
  let toSend = {type: "new-message", data: message};
  console.log(toSend);
  io.emit("message", toSend);
};

module.exports = {newMessage};
