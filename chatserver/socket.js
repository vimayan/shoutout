const socketIO = require("socket.io");

let io;
let sockets;

function initialize(server) {
  io = socketIO(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    sockets = socket;
    // console.log("Socket connected:", socket.id);
    socket.join("shouts"); //connecting user to public

    socket.on("connectPeers", (user) => {
      socket.join(user._id);
      const user_data = {
        name: user["firstname"],
        userid: user["_id"],
        socket_id: socket.id,
      };
      const contacts = user.contacts;
      for (let i = 0; i < contacts.length; i++) {
        // console.log("this is peer contact", contacts[i].userid);
        //giving the specific id to all the contact groups
        socket.to(contacts[i].userid).emit("store", user_data);
      }
      // //creating room for the groups
      // const groups = user.groups;
      // for (let i = 0; i < groups.length; i++) {
      //   socket.to.join(groups[i].userid);
      // }
    });

    socket.on("reconnect", (socket_id, user) => {
      io.to(socket_id).emit("restore", user);
    });

    // socket.on("webrtcOffer", (offer, user_id, callback) => {
    //       socket.to(user_id).emit("checking", offer, user_id, socket.id);

    //   socket.broadcast.to(user_id).emit("offer", offer, user_id, socket.id);
    //   callback("offer shared");
    //   console.log("offer shared ", user_id);
    // });
    // socket.on("webrtcAnswer", (answer, socket_id, user_id, callback) => {
    //   socket.to(socket_id).emit("answer", answer, user_id);

    //   callback("answer sended");
    //   console.log("answer sended ", socket_id);
    // });

    socket.on("message", (data, user_id,sender_id) => {
      console.log('message',data);
      socket.to(user_id).emit("gossips", data,sender_id,socket.id);
     
    });
  });
}

// console.log("this is from socket", sockets);

function getIO() {
  return io;
}
function getSocket() {
  return sockets;
}

module.exports = { initialize, getIO, getSocket };
