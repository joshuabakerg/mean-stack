let socketSessionService = require("../context").socketSessionService;

let registerSession = (io, socket, event) => {
    socketSessionService.registerUser(event.user.login.username, socket);
};

let unregisterSession = (io, socket, event) => {
  socketSessionService.unregisterUser(event.user.login.username);
};

module.exports = {registerSession, unregisterSession};
