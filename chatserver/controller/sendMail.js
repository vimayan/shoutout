const nodemailer = require("nodemailer");

// Send email function
async function sendEmail(email, subject, link) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.secret,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: "This is a verification mail",
    html: `please click this mail to confirm:<a href = ${link}>${link}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (info) {
      console.log("Email sent:", info.response);
    } else {
      console.error("Error sending email:", error);
      return res.status(500).send("couldn't send the mail");
    }
  });
}

module.exports = sendEmail;
