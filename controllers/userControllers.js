require("express-async-errors");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const { cloudinary, saveToCloud } = require("../utils/storage");
const { send_verification_email } = require("../utils/emailVerification");


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

    send_verification_email(email, user.id);
    res.send("Please confirm your email.")
    //res.redirect("/auth/login");
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
      const user = await User.findOne({ email, is_active: true });
      if (!user) {
        return done(null, false, { message: `User with email: ${email} does not exist. Perhaps email has not beem verified` });
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
      done(null, await User.findOne({ _id: id, is_active: true }));
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
    cloudinary.uploader.upload(req.file.path, { timeout: 100000 }, async (err, result) => {
      if (err) {
        return res.json({ err });
      } else {
        try {
          await User.findOneAndUpdate(
            { _id: req.user._id, is_active: true },
            { is_author: true, image: result.secure_url }
          );

          res.redirect("/");
        } catch (err) {
          throw new Error(err);
        }
      }
    })
  } catch (err) {
    throw new Error(err.message);
  }
};


const activateAccount = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.userId, is_active: false }, { is_active: true });

    if (!user) {
      res.send("Invalid activation. Your account has already been activated");
      res.redirect("/");
    } else {
      req.flash("success", "Account has been successfully activated.")
      res.redirect("/auth/login");
    }
  } catch (err) {
    throw new Error(err);
  }
}


module.exports = {
  signupView,
  createUser,
  passportInit,
  loginView,
  logout,
  registerAuthorView,
  createAuthor,
  activateAccount,
};
