const { getSocket } = require("../socket");

const socket = getSocket();
(function () {
  socket.on("Webrtc_offer", (offer, user_id, callback) => {
    socket.to(user_id).emit("offer", offer, socket.id, user_id);

    callback("offer shared");
  });
})();
(function () {
  socket.on("Webrtc_answer", (answer, socket_id, callback) => {
    socket.to(socket_id).emit("answer", answer, user_id);

    callback("answer sended");
  });
})();

//   socket.on("Webrtc_groups", (offer, groups, callback) => {

//     socket.to(user_id).emit("offer", offer);

//     callback();
//   });
