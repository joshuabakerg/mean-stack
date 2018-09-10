let newMessage = (io, socket, event) =>{
  console.log(`new message from ${event.user.name.first}`)
};

module.exports = {newMessage};
