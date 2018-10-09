var admin = require("firebase-admin");
const uuidv4 = require('uuid/v4');

const {getChildren, getFirstKeyFromSnapshot} = require("../utils/SnapUtils");

class ChatService {

  constructor(userService, socketSessionService) {
    // let mess = {from: "username", time: "time-sent", message: "the actual message"};
    this.userService = userService;
    this.socketSessionService = socketSessionService;
    this.messages = [];

    this.chatSubs = {};

    let db = admin.database();
    this.chatRef = db.ref("/chat");
    this.chatRef.child("details").on("value", value => {
      let data = value.val();
      console.log(data);
      this.chatDetails = data;
    })
  }

  async getChatsForUser(user) {
    if (typeof user === 'string') {
      user = await this.userService.getUserByUsername(user);
    }
    let requesterChatDetails = await this.getChatDetails(user.login.username);
    let conversationsPromises = Object.values(requesterChatDetails.convIds).map((id) => this.getConversation(id));
    let requesterConversations = await Promise.all(conversationsPromises);
    let users = new Set();
    for (const conversation of requesterConversations) {
      conversation.mainUser = conversation.users.find((userName) => userName !== user.login.username);
      conversation.userDetails = {};
      for (const userItem of conversation.users) {
        users.add(userItem);
        conversation.userDetails[userItem] = await this.getChatDetails(userItem);
      }
    }
    return requesterConversations;
  }

  async getConversationById(id) {
    let conversation = await this.getConversation(id);
    let users = new Set();
    conversation.userDetails = {};
    for (const userItem of conversation.users) {
      users.add(userItem);
      conversation.userDetails[userItem] = await this.getChatDetails(userItem);
    }
    return conversation;
  }

  async getAllMessages() {
    return this.messages;
  }

  async saveMessage(convId, message) {
    console.log(`Adding message ${JSON.stringify(message)}`);
    this.messages.push(message);
    let conversation = await this.getConversation(convId);
    let messageId = conversation.messages;
    let messagesSnap = await this.chatRef.child(`messages/${messageId}`).once('value');
    let messages = messagesSnap.val() || [];
    messages.push(message);
    this.chatRef.child(`messages/${messageId}`).set(messages);
    let user = await this.userService.getUserByUsername(message.from);
    message.pic = user.picture.thumbnail;
    let toSend = {type: "new-message", data: message};
    console.log(toSend);
    this.chatSubs[convId].forEach(sub => {
      console.log(sub.username);
      sub.socket.emit("message", toSend);
    })
  }

  async getConversation(conversationId) {
    let conversationSnap = await this.chatRef.child(`convs/${conversationId}`).once("value");
    return Object.assign({id: conversationId}, conversationSnap.val());
  }

  async getChatDetails(username) {
    //todo optimise the thumbnail fetch per user
    let user = await this.userService.getUserByUsername(username);
    let result;
    if (!this.chatDetails) {
      let chatDetailsSnap = await this.chatRef.child(`details/${username}`).once("value");
      result = chatDetailsSnap.val();
    } else {
      result = this.chatDetails[username];
      if (!result && user) {
        result = await this.initUserChatDetails(username);
      } else if (!result) {
        return undefined;
      }
    }
    result = Object.assign(
      {
        image: user.picture.thumbnail,
        name: user.name.first
      },
      result
    );
    return result;
  }

  async getMessages(messageId, limit = -1) {
    let messages;
    if (limit > 0) {
      let messagesSnap = await this.chatRef.child(`messages/${messageId}`).orderByKey().limitToLast(limit).once("value");
      messages = getChildren(messagesSnap) || [];
    } else {
      let messagesSnap = await this.chatRef.child(`messages/${messageId}`).once("value");
      messages = messagesSnap.val() || [];
    }
    console.log(messages);
    let users = new Set(messages.map(mess => mess.from));
    let pics = {};
    for (const userName of users) {
      let user = await this.userService.getUserByUsername(userName);
      pics[userName] = user.picture.thumbnail;
    }
    messages.forEach(message => message.pic = pics[message.from]);
    return messages;
  }

  async addConversation(users) {
    let internalUsers = await Promise.all(
      users.map(user => this.userService.getUserByUsername(user))
    );
    internalUsers.forEach(user => {
      if (!user) {
        throw new Error("Some users do not exist");
      }
    });

    const chatId = uuidv4();
    const messageId = uuidv4();
    await this.chatRef.child(`/convs/${chatId}`).set({
      messages: messageId,
      users
    });
    let conversation = await this.getConversationById(chatId);
    for (const user of users) {
      await this.getChatDetails(user);
      this.chatRef.child(`/details/${user}/convIds`).push(chatId);
      let chatSub = this.socketSessionService.getSessionByUser(user);
      if (chatSub) {
        let mainUser = conversation.users.find(otherUser => otherUser !== user);
        let toSend = {type: "new-chat", data: Object.assign({mainUser},conversation)};
        chatSub.emit("message", toSend);
      }
    }
    return chatId;
  };

  async initUserChatDetails(username) {
    const details = {
      available: "offline",
      convIds: {},
      status: "Hi i'm new to chat"
    };
    return this.chatRef.child(`details/${username}`).set(details).then(() => details);
  }

  async joinChat(convId, username, clientSocket) {
    //todo only allow users to join chat if they have the conversation
    let sub = {username, socket: clientSocket};
    if (!this.chatSubs[convId]) this.chatSubs[convId] = [];
    this.chatSubs[convId].push(sub);
  }

  async exitChat(convId, username) {
    console.log(`exiting chat for ${username} on ${convId}`);
    let subs = this.chatSubs[convId] || [];
    subs.removeIf(sub => sub.username === username);
    console.log(subs);
  }

}

module.exports = ChatService;
