var express = require('express');
var router = express.Router();
let context = require("../context");
let chatService = context.chatService;

/* GET home page. */
router.get('/ad', function (req, res, next) {
  chatService.getAllMessages().then(value => {
    res.send(value);
  });
});

router.get("/", async function (req, res) {
  try {
    let username = req.user.login.username;
    let chat = await chatService.getChatsForUser(username);
    res.send({success: true, chat});
  } catch (e) {
    console.error(e);
    res.send({success: false, message: e.stack})
  }
});

router.get("/messages/:messageId", async function (req, res) {
  try {
    let messageId = req.params.messageId;
    let messages = await chatService.getMessages(messageId);
    res.send({success: true, messages});
  } catch (e) {
    console.error(e);
    res.send({success: false, message: e.stack})
  }
});

router.post("/conversation", async function (req, res, next) {
  try{
    console.log("got request with ", JSON.stringify(req.body, undefined, 2));
    let users = req.body.users;
    let requestingUser = req.user.login.username;
    if(req.body.includeRequester){
      users.push(requestingUser);
    }
    if(!users.includes(requestingUser)){
      throw new Error("can only create chats that include the requesting user");
    }
    let conversationId = await chatService.addConversation(users);
    res.send({success: true, conversationId});
  }catch (e) {
    console.error(e);
    res.send({success: false, message: e.stack})
  }
});

module.exports = router;
