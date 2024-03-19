const route = require("express").Router();
const { gosipers, groupGosips } = require("../controller/gossipAction");
const {
  createUser,
  loginUser,
  getUser,
  requestPassword,
  enterPassword,
  resetPassword,
  auth,
  verifyUser,
  addFriend,
  requestFriend,
  removeRequest,
  removePending,
} = require("../controller/userAction");
const {shouts, createShout, getShout, moreShout, likeShout} = require("../controller/shoutAction");

route.get("/", (req, res) => {
  res.end("hello there");
});
route.post("/create-user", createUser);
route.post("/login", loginUser);
route.get("/verify/:username", verifyUser);
route.post("/request-password", requestPassword);
route.get("/reset-password/:id/:token", enterPassword);
route.post("/reset-password/:id/:token", resetPassword);

route.get("/:user/getuser",auth, getUser);
route.get("/:user/gosipers", auth, gosipers);
route.get("/:user/group_gosips", auth, groupGosips);

route.get("/:user/shouts", auth, shouts);

route.post("/:user/addfriend", auth, addFriend);
route.post("/:user/add_request", auth, requestFriend);
route.post("/:user/remove_request", auth, removeRequest);
route.post("/:user/remove_pending", auth, removePending);

route.get("/:user/get_shouts", auth, getShout);
route.post("/:user/more_shouts", auth, moreShout);
route.post("/:user/create_shout", auth, createShout);
route.put("/:user/like_shout", auth, likeShout);

route.use("*", (req, res) => {
  res.status(404).end("Page Not Found");
});
module.exports = route;
