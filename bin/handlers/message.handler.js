let context = require("../context");
let chatService = context.chatService;

let joinChat = (io, socket, event) => {
  chatService.joinChat(event.convId, event.user.login.username, socket);
};

let exitChat = (io, socket, event) => {
  chatService.exitChat(event.convId, event.user.login.username);
};

let newMessage = (io, socket, event) => {
  let message = {
    from: event.user.login.username,
    time: new Date().getTime(),
    content: event.message,
  };
  chatService.saveMessage(event.convId, message);
};

module.exports = {joinChat, exitChat, newMessage};
