const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  signupView,
  createUser,
  loginView,
  logout,
  activateAccount
} = require("../controllers/userControllers");
const { noauth_required, login_required } = require("../utils/permissions");

/*
 * Url patterns
 **/

router.route("/signup/")
  .get(noauth_required, signupView)
  .post(createUser)


router.route("/account/activate/:userId")
  .get(activateAccount)


router.route("/login/")
  .get(noauth_required, loginView)
  .post(passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true
  }))


router.get("/logout/", login_required, logout)


module.exports = router;
