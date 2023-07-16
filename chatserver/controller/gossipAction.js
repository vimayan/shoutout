const jwt = require("jsonwebtoken");
const {
  UserSchema,
  GroupSchema
} = require("../model/mongooseModel");
const joi = require("joi");
const { getIO, getSocket } = require("../socket");

const tinySchema = joi
  .object({
    longUrl: joi.string().uri().required(),
    tinyUrl: joi.string(),
  })
  .with("longUrl", "tinyUrl");

exports.gosipers = async (req, res) => {
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

exports.groupGosips = async (req, res) => {
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