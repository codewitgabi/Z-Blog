require("express-async-errors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { BadRequestError, ForbiddenError } = require("./errorHandlers");


const login_required = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }
  next();
}


const noauth_required = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};


const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ForbiddenError("Authentication credentials were not provided");
  }

  const token = authHeader.split(" ");

  if (token[0] !== "Bearer") {
    throw new BadRequestError("Cannot parse authorization headers");
  } else {
    jwt.verify(token[1], process.env.JWT_SECRET_KEY, async function (err, decoded) {
      if (err) {
        return res.status(400).json({ error: err.message })
      } else {
        req.user = await User.findById(decoded.id);
        next();
      }
    });
  }
};


module.exports = {
  login_required,
  noauth_required,
  verifyAuth,
};
