require("express-async-errors");
const Post = require("../../models/Post");


const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate(
      { path: "author", select: "_id username image is_active is_author is_superuser" }
    );
    res.status(200).json({ posts });
  } catch (err) {
    throw new Error(err.message);
  }
};


module.exports = { getAllPosts };

