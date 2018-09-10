class ChatService {

  constructor(){
    // let mess = {from: "username", time: "time-sent", message: "the actual message"};
    this.messages = [];
  }

  async getAllMessages(){
    return this.messages;
  }

  async saveMessage(message){
    console.log(`Adding message ${JSON.stringify(message)}`);
    this.messages.push(message);
  }

}

module.exports = ChatService;
