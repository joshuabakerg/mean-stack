let bin = require("./bin/context");

let chatService = bin.chatService;

chatService.getChatsForUser("joshua")
  .then(res => {
    console.log(JSON.stringify(res, undefined, 2))
  });
