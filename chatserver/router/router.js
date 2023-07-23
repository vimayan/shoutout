const route = require("express").Router();
const { gosipers, groupGosips } = require("../controller/gossipAction");
const {
  createUser,
  loginUser,
  requestPassword,
  enterPassword,
  resetPassword,
  auth,
  verifyUser,
} = require("../controller/userAction");
const {shouts} = require("../controller/shoutAction");

route.get("/", (req, res) => {
  res.end("hello there");
});
route.post("/create-user", createUser);
route.post("/login", loginUser);
route.get("/verify/:username", verifyUser);
route.post("/request-password", requestPassword);
route.get("/reset-password/:id/:token", enterPassword);
route.post("/reset-password/:id/:token", resetPassword);

route.get("/:user/gosipers", auth, gosipers);
route.get("/:user/group_gosips", auth, groupGosips);

route.get("/:user/shouts", auth, shouts);

route.use("*", (req, res) => {
  res.status(404).end("Page Not Found");
});
module.exports = route;
