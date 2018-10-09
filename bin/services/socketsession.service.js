const admin = require("firebase-admin");

class SocketSessionService {

  constructor() {
    this.sessions = {};
  }

  registerUser(username, socket){
    this.sessions[username] = socket;
  }

  getSessionByUser(username){
    return this.sessions[username];
  }


}

module.exports = SocketSessionService;
