const jwt = require("jsonwebtoken");
const { UserSchema, ShoutSchema } = require("../model/mongooseModel");
const joi = require("joi");
const { getIO, getSocket } = require("../socket");

const tinySchema = joi
  .object({
    longUrl: joi.string().uri().required(),
    tinyUrl: joi.string(),
  })
  .with("longUrl", "tinyUrl");

exports.shouts = async (req, res) => {
  try {
    //checking the availability
    const user = await UserSchema.findOne({ _id: req._id });
    if (!user) return res.status(401).end("user not exists");
    else {
      const urls = await UrlSchema.find({ userid: req._id });
      return res.status(200).send(urls);
    }
  } catch (error) {
    res.status(401).send(new Error(error).message);
  }
};

exports.createShout = async (req, res) => {
  const new_shout = { ...req.body };
  console.log(new_shout);
  try {
    //checking the availability
    const user = await UserSchema.findOne({ _id: req._id });
    if (!user) return res.status(401).end("user not exists");
    else {
      const shout = new ShoutSchema({
        shouter: { userid: req._id, username: req.body.username },
        shout: req.body.text,
        chatbox: [],
      });

      await shout.save();
      return res.status(200).send(shout);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(new Error(error).message);
  }
};

exports.getShout = async (req, res) => {
  try {
    //checking the availability
    const user = await UserSchema.findOne({ _id: req._id });
    if (!user) return res.status(401).end("user not exists");
    else {
      const shout = await ShoutSchema.find().sort({ createdAt: -1 }).limit(20);
      return res.status(200).send(shout);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(new Error(error).message);
  }
};
exports.moreShout = async (req, res) => {
  const offset = req.body["offset_id"];
  try {
    //checking the availability
    const user = await UserSchema.findOne({ _id: req._id });
    if (!user) return res.status(401).end("user not exists");
    else {
      const shout = await ShoutSchema.find({ createdAt: { $lt: offset } })
        .sort({ createdAt: -1 })
        .limit(20);
      return res.status(200).send(shout);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(new Error(error).message);
  }
};
exports.likeShout = async (req, res) => {

  const id = req.body["id"];
  try {
    //checking the availability
    const user = await UserSchema.findOne({ _id: req._id });
    if (!user) return res.status(401).end("user not exists");
    else {
      const shout = await ShoutSchema.findOneAndUpdate(
        {'_id':id},
        { $inc: { like: 1 } },
        { new: true }
      );
      console.log(shout);
      return res.status(200).send(shout);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(new Error(error).message);
  }
};
