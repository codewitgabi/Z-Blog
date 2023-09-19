require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
});


const send_verification_email = async (userEmail, userId) => {
  try {
    await transporter.sendMail({
      from: "ZBlog <codewitgabi222@gmail.com>",
      to: userEmail,
      subject: "Verify Your Email",
      text: `Kindly verify your email http://localhost:3000/auth/account/activate/${userId}`,
      html: `
        <p>
          Click the link below to activate your account
        </p>
        <a href="http://localhost:3000/auth/account/activate/${userId}">Activate Account</a>
      `,
    });
  } catch (error) {
    console.log(error.message)
  }

  console.log("Delivered...")
}


module.exports = { send_verification_email };
