var admin = require("firebase-admin");

var db = admin.database();
var userRef = db.ref("/user");

class UserService {

  constructor() {
    console.log("creating user service");
    this.users = [];

    userRef.on("child_changed", value => {
      let userChange = value.val();
      this.users.removeIf(user => user.login.username === userChange.login.username);
      this.users.push(userChange);
    });
  }

  async getUserBySessionId(sessionId) {
    console.log(`Getting user with session id ${sessionId}`);
    if (!sessionId) return;
    let auth = this.users.find((item) => item.login.sessionid === sessionId);
    if (!auth) {
      let dbResults = (await userRef.orderByChild("login/sessionid").equalTo(sessionId).once("value")).val();
      auth = Object.values(dbResults || {})[0];
      if (auth) {
        this.users.removeIf(user => user.login.username === auth.login.username);
        this.users.push(auth);
      }
    }
    return auth;
  };

  async register(newUser) {

  }

}

module.exports = UserService;
