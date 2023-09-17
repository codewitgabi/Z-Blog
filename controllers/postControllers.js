require("express-async-errors");
const fs = require("fs");
const Post = require("../models/Post");
const User = require("../models/User");
const Tag = require("../models/Tag");


const homePage = async (req, res, next) => {
  let context = {
    pageTitle: "Z-Blog | Home",
    layout: "base",
    user: req.isAuthenticated() ? req.user : null,
  };

  try {
    // fetch posts from database.

    const posts = await Post.find({});
    Object.assign(context, { posts })

    return res.render("index", context);
  } catch (err) {
    throw new Error(err.message);
  }
};


const writePostView = async (req, res) => {
  let context = {
    pageTitle: "Z-Blog | Create Post",
    layout: "base",
    user: req.user
  };
  res.render("write_post", context);
};


const createPost = async (req, res) => {
  // get request data

  const {
    post_title: postTitle,
    post_body: content
  } = req.body;

  // create post and save to database.

  try {
    await Post.create({
      title: postTitle,
      content,
      thumbnail: {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype
      },
      author: {
        id: req.user._id,
        username: req.user.username
      },
      tag: { name: "coding" }
    })

    return res.redirect("/");
  } catch (err) {
    throw new Error(err.message)
  }
};


module.exports = {
  homePage,
  writePostView,
  createPost,
};
