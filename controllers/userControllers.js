require("express-async-errors");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");


const signupView = (req, res) => {
  res.render("signup", {
    pageTitle: "Z-Blog | Signup",
    layout: "base"
  });
};


const createUser = async (req, res) => {
  /*
   * Creates user with the provided `username`, `email` and `password`*/

  const { username, email, password } = req.body;

  if (password.length < 10) {
    req.flash("error", "Password must be a minimum of 10 characters");
    return res.redirect("/auth/signup");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.redirect("/auth/login");
  } catch (err) {
    req.flash("error", "User with provided email already exists");
    res.redirect("/auth/signup");
  }
};


const loginView = (req, res) => {
  let context = {
    pageTitle: "Z-Blog | Login",
    layout: "base"
  };
  res.render("login", context)
};


const passportInit = (passport) => {
  const verifyUser = async (email, password, done) => {
    /*
     * Checks that a user exists.
     * Checks that password matches saved password.
     * return user.
     **/

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: `User with email: ${email} does not exist.` });
      } else {
        if (!(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: "Password is incorrect" });
       } else {
         await User.findByIdAndUpdate(user._id, { last_login: new Date() })
         return done(null, user);
       }
      }
    } catch(e) {
      done(null, false, { message: `User with email: ${email} does not exist` });
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email"}, verifyUser));

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    try {
      done(null, await User.findById(id));
    } catch (err) {
      done(null, err);
    }
  })
};


const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};


const registerAuthorView = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.is_author) {
      return res.redirect("/");
    }
  }

  let context = {
    pageTitle: "Z-Blog | Register Author",
    layout: "base",
    user: req.user
  };
  res.render("author_registration", context);
};


const createAuthor = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      is_author: true,
      image: {
        contentType: req.file.mimetype,
        data: fs.readFileSync(req.file.path)
      }
    });
    res.redirect("/");
  } catch (err) {
    throw new Error(err.message);
  }
};


module.exports = {
  signupView,
  createUser,
  passportInit,
  loginView,
  logout,
  registerAuthorView,
  createAuthor,
};
