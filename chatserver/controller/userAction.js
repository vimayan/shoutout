const { UserSchema, TokenSchema } = require("../model/mongooseModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


const registerSchema = joi.object({
  email: joi.string().min(6).required(),
  firstname: joi.string().min(3).max(16).required(),
  lastname: joi.string().min(3).max(16).required(),
  password: joi
    .string()
    .regex(/^[a-zA-Z0-9]{6,16}$/)
    .min(8)
    .required(),
});

exports.createUser = async (req, res) => {
  const email = req.body.email;
  const firstname = req.body.firstname;

  try {
    const { error } = await registerSchema.validateAsync(req.body);

    // Save Tutorial in the database

    const users = await UserSchema.findOne({ email: email });
    if (users) {
      return res.status(400).end("email already exist");
    }

    const hashpassword = await bcrypt.hash(req.body.password, 10);

    const userAccount = new UserSchema({
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: hashpassword,
      contacts: [],
      groups: [],
      pending_request: [],
      recieved_request: [],
      isverified:true,
    });

    await userAccount.save();


    return res
    .status(200)
    .send("Account created pls Login");
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occured");
  }
};
const loginSchema = joi.object({
  email: joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: joi
    .string()
    .regex(/^[a-zA-Z0-9]{6,16}$/)
    .min(8)
    .required(),
});
exports.verifyUser = async (req, res) => {
  try {
    const token = await TokenSchema.findOne({
      userid: req.query._id,
      token: req.query.token,
    });

    if (!token) return res.status(400).send("invalid link or expired");

    const user = await UserSchema.findById(req.query._id);

    if (!user) return res.status(400).send("Invalid link or expired");

    user.isverified = true;
    await user.save();
    await token.delete();
    res.render("verifyuser");
  } catch (error) {
    res.end("An error occured");
    console.log(error);
  }
};

exports.loginUser = async (req, res) => {
  const email = req.body.email;
  console.log(req.body);
  try {
    const { error } = await loginSchema.validateAsync(req.body);

    if (error) {
      return res.status(400).send(error);
    }

    const user = await UserSchema.findOne({ email: email });

    if (!user) {
      return res.status(400).end("email id not exist please register");
    }

    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validpassword) {
      return res.status(400).send("please enter valid password");
    }
    if (!user.isverified) {
      return res.status(400).send("please verify the email");
    } else {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);


      res.json({
        token: token,
        user: user,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.getUser = async (req, res) => {
  const id = req._id;

  try {
    const user = await UserSchema.findById(id);

    if (!user) {
      return res.status(400).end("email id not exist please register");
    } else {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
      res.json({
        token: token,
        user: user,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.requestPassword = async (req, res) => {
  try {
    const schema = joi.object({ email: joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(new Error(error).message);

    const user = await UserSchema.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await TokenSchema.findOne({ userid: user._id });
    // console.log(token);
    if (!token) {
      token = await new TokenSchema({
        userid: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.URL}/reset-password/${user._id}/${token.token}`;
    const accessToken = await getAccessToken();
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.userMail,
        accessToken: accessToken,
        clientId: process.env.clientId,
        clientSecret: process.env.secret,
        refreshToken: process.env.refreshToken,
      },
    });
    const mailOptions = {
      from: process.env.userMail,
      to: user.email,
      subject: "reset password",
      html: link,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("couldn't send the mail");
      } else {
        res.status(200).send("password reset link sent to your email account");
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    res.status(500).send("An error occured");
    console.log(error);
  }
};

exports.enterPassword = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(400).send("invalid link");

    let token = await TokenSchema.findOne({ token: req.params.token });
    if (!token) {
      return res.status(400).send("token expired");
    }

    res.render("resetpassword", {
      id: req.params.id,
      token: req.params.token,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.resetPassword = async (req, res) => {
  console.log(req.body);
  // return res.send(req.body)
  try {
    const passwordSchema = joi.object({
      password: joi.string().required(),
      confirmpassword: joi.string().required().valid(joi.ref("password")),
    });
    const { error } = passwordSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0]);

    const token = await TokenSchema.findOne({
      userid: req.params.id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("invalid link or expired");

    const user = await UserSchema.findById(req.params.id);

    if (!user) return res.status(400).send("Invalid link or expired");
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashpassword;
    await user.save();
    await token.delete();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send(error);
  }
};

exports.addFriend = async (req, res) => {
  const id = req._id;
  const newContact = { ...req.body };

  try {
    const user = await UserSchema.findByIdAndUpdate(
      { _id: id },
      {
        $addToSet: { contacts: newContact },
        $pull: {
          pending_request: { userid: newContact.userid },
          recieved_request: { userid: newContact.userid },
        },
      },
      { returnDocument: "after" }
    );
    const new_request = {
      name: user["firstname"],
      userid: id,
    };
    await UserSchema.findByIdAndUpdate(
      { _id: newContact.userid },
      {
        $addToSet: { contacts: new_request },
        $pull: {
          pending_request: { userid: id },
          recieved_request: { userid: id },
        },
      }
    );

    if (!user) {
      return res.status(400).end("contact ID does exist");
    } else {
      res.json({
        user: user,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.requestFriend = async (req, res) => {
  const id = req._id;
  console.log("requestFriend", req.body, id);
  const newContact = { name: req.body["name"], userid: req.body["userid"] };
  try {
    const user = await UserSchema.findByIdAndUpdate(
      { _id: id },
      { $push: { pending_request: newContact } },
      { returnDocument: "after" }
    );
    const new_request = {
      name: user["firstname"],
      userid: id,
    };
    await UserSchema.findByIdAndUpdate(
      { _id: newContact.userid },
      { $push: { recieved_request: new_request } }
    );
    if (!user) {
      return res.status(400).end("contact ID does exist");
    } else {
      res.json({
        user: user,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.removeRequest = async (req, res) => {
  const id = req._id;
  const newContact = { ...req.body };
  try {
    await UserSchema.findByIdAndUpdate(
      { _id: newContact.userid },
      { $pull: { pending_request: { userid: id } } }
    );
    const user = await UserSchema.findByIdAndUpdate(
      { _id: id },
      { $pull: { recieved_request: { userid: newContact.userid } } },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(400).end("contact ID does exist");
    } else {
      res.json({
        user: user,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.removePending = async (req, res) => {
  const id = req._id;
  const newContact = { ...req.body };
  try {
    await UserSchema.findByIdAndUpdate(
      { _id: newContact.userid },
      { $pull: { recieved_request: { userid: id } } }
    );
    const user = await UserSchema.findByIdAndUpdate(
      { _id: id },
      { $pull: { pending_request: { userid: newContact.userid } } },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(400).end("contact ID does exist");
    } else {
      res.json({
        user: user,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.auth = function (req, res, next) {
  // get token from header
  const token = req.headers.token;
  console.log(token);
  // check if no token
  if (!token) {
    // 401 not outhorised
    return res.status(401).end("No token, authorization denied");
  }
  // verify token
  try {
    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(401).send({
          message: "Unauthorized!",
        });
      } else {
        console.log(data);
        req._id = data._id;
        next();
        return;
      }
    });
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
