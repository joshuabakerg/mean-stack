let socketSessionService = require("../context").socketSessionService;

let registerSession = (io, socket, event) => {
    socketSessionService.registerUser(event.user.login.username, socket);
};

module.exports = {registerSession};
