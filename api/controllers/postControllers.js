require("express-async-errors");
const Post = require("../../models/Post");


const getAllPosts = async (req, res) => {
  console.log(req.user)
  try {
    const posts = await Post.find({});
    res.status(200).json({ posts });
  } catch (err) {
    throw new Error(err.message);
  }
};


module.exports = { getAllPosts };

