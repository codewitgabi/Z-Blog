const express = require("express");
const router = express.Router();
const { getAllPosts } = require("../controllers/postControllers");
const { verifyAuth } = require("../../utils/permissions");


/*
 * Url patterns */

router.route("/get-posts")
  .get(verifyAuth, getAllPosts)


module.exports = router;

