const socketIO = require("socket.io");

let io;
let socket;

function initialize(server) {
  io = socketIO(server,{cors:{origin:'*'}});

  io.on("connection", (skt) => {
    console.log("Socket connected:", skt.id);
    socket=skt
  });
}

function getIO() {
  return io;
}
function getSocket() {
    return socket;
  }

module.exports = { initialize, getIO, getSocket };
