const express = require("express");
const router = express.Router();
const multer  = require('multer');
const { login_required } = require("../utils/permissions");
const { registerAuthorView, createAuthor } = require("../controllers/userControllers");

// multer storage backend

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });


/*
 * Url patterns */

router.route("/register-as-author/")
  .get(registerAuthorView)
  .post(
    login_required,
    upload.single("image"),
    createAuthor
  )


module.exports = router;
