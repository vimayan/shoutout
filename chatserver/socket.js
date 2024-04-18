const socketIO = require("socket.io");

let io;
let sockets;

function initialize(server) {
  io = socketIO(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    sockets = socket;

    socket.join("shouts"); //connecting user to public

    socket.on("connectPeers", (user) => {
      socket.join(user._id);
      const user_data = {
        name: user["firstname"],
        userid: user["_id"],
        socket_id: socket.id,
      };
      const contacts = user.contacts;
      if (user.contacts.length < 20) {
        socket.broadcast.emit("new_connection", user_data);
      }
      for (let i = 0; i < contacts.length; i++) {
        socket.join(`${contacts[i].userid}_connection`);
        io.to(`${contacts[i].userid}_connection`).emit(
          "new_connection",
          user_data
        );
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
    socket.on("give_connection", (socket_id, user) => {
      io.to(socket_id).emit("set_connection", user);
    });
    socket.on("change_user", (socket_id) => {
      console.log("user changing", socket_id);
      io.to(socket_id).emit("getuser");
    });
    socket.on("like_shout", (id) => {
      socket.broadcast.emit("add_like", id);
    });
    // socket.on("webrtcOffer", (offer,peerId, user_id, callback) => {
    //       // socket.to(user_id).emit("checking", offer, user_id, socket.id);

    //   socket.to(peerId).emit("offer", offer, user_id, socket.id);
    //   callback("offer shared");
    //   console.log("offer shared ", user_id);
    // });
    // socket.on("webrtcAnswer", (answer, socket_id, user_id, callback) => {
    //   socket.to(socket_id).emit("answer", answer, user_id);

    //   callback("answer sended");
    //   console.log("answer sended ", socket_id,answer);
    // });

    socket.on("message", (data, user_id, sender_id) => {
      console.log("gossip msg");
      socket.to(user_id).emit("gossips", data, sender_id);
    });
    socket.on("shouts", (data, shout_id, sender_name) => {
      console.log("shout msg");
      socket.to('shouts').emit("shouted", data,shout_id, sender_name);
    });
  });
}

function getIO() {
  return io;
}
function getSocket() {
  return sockets;
}

module.exports = { initialize, getIO, getSocket };
