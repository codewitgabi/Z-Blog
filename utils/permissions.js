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
    jwt.verify(
      token[1],
      process.env.JWT_SECRET_KEY,
      function (err, decoded) {
        if (err) {
          switch (err) {
            case "TokenExpiredError":
              throw new Error("Provided token has expired and is no longer valid");
            case "JsonWebTokenError":
              throw new Error("Invalid JWT token");
            case "NotBeforeError":
              throw new Error(err.message);
          }
        } else {
          print(decoded)
          req.user = User.findById(decoded.id);
          next();
        }
      }
    );
  }
};


module.exports = {
  login_required,
  noauth_required,
  verifyAuth,
};
