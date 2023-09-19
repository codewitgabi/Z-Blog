const { Schema, model, ObjectId } = require("mongoose");
const User = require("./User");
const TagSchema = require("./Tag");


const PostShema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  thumbnail: {
    type: String,
    maxLength: 2034,
    trim: true,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    id: ObjectId,
    username: String
  },
  tag: {
    type: String,
    required: true,
    trim: true,
    maxLength: 15,
    lowercase: true
  },
  likes: [{}],
}, {
  timestamps: {
    createdAt: "date_created",
    updatedAt: "last_updated"
  }
});


module.exports = model("Post", PostShema);

