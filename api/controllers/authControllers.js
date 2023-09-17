const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("express-async-errors");
require("dotenv").config();
const User = require("../../models/User");
const { BadRequestError, NotFoundError } = require("../../utils/errorHandlers");


const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ "error": "Please provide a username and password"});
  }

  if (password.length < 10) {
    return res.status(400).json({ "error": "Password must have a minimum of 10 characters." });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      email, username, password: hashedPassword
    })
    res.status(201).json(user)
  } catch (err) {
    throw new BadRequestError(err.message);
  }
};


const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })

    if (!user) {
      res.status(400).json({ error: `No user associated with email: ${email}` })
    } else {
      if (!(await bcrypt.compare(password, user.password))) {
        res.status(400).json({ error: "Incorrect password" })
      } else {
        const token = jwt.sign({
          id: user._id,
          username: user.username,
          email
        }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRY })

        res.status(200).json({
          id: user.id,
          username: user.username,
          accessToken: token,
          expires_in: process.env.JWT_TOKEN_EXPIRY
        })
      }
    }
  } catch (err) {
    throw new NotFoundError(`No user found with email ${email}`);
  }
};


module.exports = { registerUser, authenticateUser };

