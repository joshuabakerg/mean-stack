const admin = require("firebase-admin");

class SocketSessionService {

  constructor() {
    this.sessions = {};
  }

  registerUser(username, socket) {
    console.log("registering user", username);
    this.sessions[username] = socket;
  }

  unregisterUser(username) {
    console.log("unregistering user", username);
    delete this.sessions[username];
  }

  getSessionByUser(username) {
    return this.sessions[username];
  }


}

module.exports = SocketSessionService;
