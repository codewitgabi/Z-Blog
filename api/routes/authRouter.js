const express = require("express");
const router = express.Router();
const { registerUser, authenticateUser } = require("../controllers/authControllers");


/*
 * Url patterns */

router.route("/register")
  .post(registerUser)


router.route("/get-access-token")
  .post(authenticateUser)


module.exports = router;

