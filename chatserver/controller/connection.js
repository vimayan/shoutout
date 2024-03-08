const { getSocket } = require("../socket");

const socket = getSocket();
console.log("this is from connection");
function offerRtc() {
  socket.on("Webrtc_offer", (offer, user_id, callback) => {
    socket.to(user_id).emit("offer", offer, socket.id, user_id);

    callback("offer shared");
    console.log("offer shared connection ", user_id);
  });
}
function AnswerRtc() {
  socket.on("Webrtc_answer", (answer, socket_id, callback) => {
    socket.to(socket_id).emit("answer", answer, user_id);

    callback("answer sended");
    console.log("offer shared connection ", socket_id);
  });
}

//   socket.on("Webrtc_groups", (offer, groups, callback) => {

//     socket.to(user_id).emit("offer", offer);

//     callback();
//   });


module.exports = {
  offerRtc,
  AnswerRtc
}


// const { getSocket } = require("../socket");

// console.log("this is from connection");
// function offerRtc() {
//   getSocket().on("Webrtc_offer", (offer, user_id, callback) => {
//     getSocket().to(user_id).emit("offer", offer, socket.id, user_id);

//     callback("offer shared");
//     console.log("offer shared ", user_id);
//   });
// }
// function AnswerRtc() {
//   getSocket().on("Webrtc_answer", (answer, socket_id, callback) => {
//     getSocket().to(socket_id).emit("answer", answer, user_id);

//     callback("answer sended");
//     console.log("offer shared ", socket_id);
//   });
// }