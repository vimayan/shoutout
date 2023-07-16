const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  isverified: {
    type: Boolean,
    required: true,
    default: false,
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
  ],
});

const shoutSchema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },

  chatbox: [
    {
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true,
      },
      text: { type: String, required: true },
      file: { type: URL },
    },
  ],

  createdAt: { type: Date, default: Date.now(), expires: 36000 },
});

const groupSchema = mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  // chatbox: [
  //   {
  //     userid: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "user",
  //       required: true,
  //       unique: true,
  //     },
  //     text: { type: String, required: true },
  //     file: { type: URL },
  //   },
  // ],
});

module.exports = {
  UserSchema: mongoose.model("user", userSchema),
  ShoutSchema: mongoose.model("shouts", shoutSchema),
  GroupSchema: mongoose.model("groups", groupSchema),
};
