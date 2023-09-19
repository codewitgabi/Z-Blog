const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  homePage,
  writePostView,
  createPost
} = require("../controllers/postControllers");
const { login_required } = require("../utils/permissions");


const storage = multer.diskStorage({
  destination: "./public/postThumbnails",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});


const upload = multer({ storage: storage });


/*
 * Url patterns
 **/

router.route("/")
  .get(homePage)


router.route("/create-post")
  .get(login_required, writePostView)
  .post(upload.single("post-thumbnail"), createPost)


module.exports = router;
