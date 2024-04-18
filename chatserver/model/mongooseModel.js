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
      name: { type: String, required: true, default: "" },
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    },
  ],
  pending_request: [
    {
      name: { type: String, required: true, default: "" },
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    },
  ],
  recieved_request: [
    {
      name: { type: String, required: true, default: "" },
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
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
  shouter: {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    username: { type: String, required: true },
  },
  shout: { type: String, required: true },
  chatbox: [
    {
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      text: { type: String, required: true },
      file: { type: String, default: null },
    },
  ],
  like: { type: Number, default: 0 },
  report: [
    {
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      complaint: { type: String },
    },
  ],
  // createdAt: { type: Date, default: Date.now(), expires: 36000 },
  
  createdAt: { type: Date, default: Date.now()},
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

const tokenSchema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },

  token: { type: String, required: true },

  createdAt: { type: Date, default: Date.now(), expires: 36000 },
});
module.exports = {
  UserSchema: mongoose.model("user", userSchema),
  ShoutSchema: mongoose.model("shouts", shoutSchema),
  GroupSchema: mongoose.model("groups", groupSchema),
  TokenSchema: mongoose.model("tokens", tokenSchema),
};
