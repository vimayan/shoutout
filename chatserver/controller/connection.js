const { getSocket } = require("../socket");

const socket = getSocket();
(function () {
  socket.on("Webrtc_offer", (offer, user_id, callback) => {
    socket.to(user_id).emit("offer", offer, socket.id, user_id);

    callback("offer shared");
    console.log('offer shared ',user_id);
  });
})();
(function () {
  socket.on("Webrtc_answer", (answer, socket_id, callback) => {
    socket.to(socket_id).emit("answer", answer, user_id);

    callback("answer sended");
    console.log('offer shared ',socket_id);
  });
})();

//   socket.on("Webrtc_groups", (offer, groups, callback) => {

//     socket.to(user_id).emit("offer", offer);

//     callback();
//   });
