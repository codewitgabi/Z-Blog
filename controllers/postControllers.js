require("express-async-errors");
const fs = require("fs");
const Post = require("../models/Post");
const User = require("../models/User");
const Tag = require("../models/Tag");
const { saveToCloud, cloudinary } = require("../utils/storage");


const homePage = async (req, res, next) => {
  let context = {
    pageTitle: "Z-Blog | Home",
    layout: "base",
    user: req.isAuthenticated() ? req.user : null,
  };

  try {
    // fetch posts from database.

    const posts = await Post.find({}).populate("author");
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
    cloudinary.uploader.upload(req.file.path, { timeout: 100000 }, async (err, result) => {
      if (err) {
        return res.json({ err })
      } else {
        try {
          const newPost = await Post.create({
            title: postTitle,
            content,
            thumbnail: result.secure_url,
            author: req.user._id,
            tag: "coding"
          })

          // add this new post to users posts.

          const author = await User.findByIdAndUpdate(req.user._id);
          author.posts.push(newPost._id);
          await author.save();

          return res.redirect("/");
        } catch (err) {
          throw new Error(err);
        }
      }
      });
  } catch (err) {
    throw new Error(err.message)
  }
};


module.exports = {
  homePage,
  writePostView,
  createPost,
};
