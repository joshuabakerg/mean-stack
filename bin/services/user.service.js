var admin = require("firebase-admin");

const {getChildren, getFirstKeyFromSnapshot} = require("../utils/SnapUtils");

var defaultUser = require("./defaultUser.json");

class UserService {

  constructor(emailService) {
    this.emailService = emailService;

    let db = admin.database();
    this.userRef = db.ref("/user");

    console.log("creating user service");
    this.users = [];

    this.userRef.on("child_changed", value => {
      let userChange = value.val();
      this.users.removeIf(user => user.login.username === userChange.login.username);
      this.users.push(userChange);
    });
    this.userRef.on("child_removed", value => {
      let userChange = value.val();
      this.users.removeIf(user => user.login.username === userChange.login.username);
    });
  }

  async getAllUsers() {
    let users = getChildren(await this.userRef.once("value"));
    return users.map(user => {
      // user.login = {username: user.login.username};
      return user;
    });
  }

  async getUserByUsername(userName) {
    let user = this.users.find(user => user.login.username === userName);
    if(!user){
      user = getChildren(await this.userRef.orderByChild("login/username")
        .equalTo(userName)
        .once("value")
      )[0];
    }
    //todo password from user object
    return user;
  }

  async getUserBySessionId(sessionId) {
    // console.log(`Getting user with session id ${sessionId}`);
    if (!sessionId) return;
    let auth = this.users.find((item) => item.login.sessionid === sessionId);
    if (!auth) {
      let dbResults = (await this.userRef.orderByChild("login/sessionid").equalTo(sessionId).once("value")).val();
      auth = Object.values(dbResults || {})[0];
      if (auth) {
        this.users.removeIf(user => user.login.username === auth.login.username);
        this.users.push(auth);
      }
    }
    return auth;
  };

  async register(newUser) {
    let response = {created: false, message: ""};
    if (!this.isUserValid(newUser)) {
      response.message = "Required fields missing";
    } else if (await this.userExists(newUser)) {
      response.message = "User already exists";
    } else {
      let createdUser = Object.assign(defaultUser, newUser);
      createdUser.registered = new Date().getTime();
      console.log(JSON.stringify(createdUser, undefined, 2));
      this.userRef.push(createdUser);
      this.emailService.send(newUser.email, `Welcome ${newUser.name.first}`, "You have created a new account");
      response.created = true;
      response.message = "Created user";
    }
    return response;
  }

  async deleteByUsername(username) {
    let dbResult = await this.userRef.orderByChild("login/username").equalTo(username).once("value");
    if(!dbResult.exists()){
      throw new Error(`User with username:${username} does not exist`);
    }
    let key = getFirstKeyFromSnapshot(dbResult);
    this.userRef.child(key).set(null);
    return true;
  }

  async updateUserDisplayPicture(username, picutreLink) {
    let dbResult = await this.userRef.orderByChild("login/username").equalTo(username).once("value");
    if(!dbResult.exists()){
      throw new Error(`User with username:${username} does not exist`);
    }
    let key = getFirstKeyFromSnapshot(dbResult);
    await this.userRef.child(`${key}/picture/thumbnail`).set(picutreLink);
    return true;
  }

  isUserValid(newUser) {
    return newUser &&

      newUser.name &&
      newUser.name.first &&

      newUser.login &&
      newUser.login.username &&
      newUser.login.password &&

      newUser.email;
  }

  async userExists(newUser) {
    let users = getChildren(await this.userRef.once("value"));
    return users.filter(user => user.login.username === newUser.login.username ||
      user.email === newUser.email
    ).length > 0;
  };

}

module.exports = UserService;
