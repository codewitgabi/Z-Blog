const { Schema, model, ObjectId } = require("mongoose");
const User = require("./User");
const TagSchema = require("./Tag");
require("express-async-errors");


const PostShema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  thumbnail: {
    data: Buffer,
    contentType: String
  },
  content: {
    type: String,
    required: true
  },
  author: {
    id: ObjectId,
    username: String
  },
  tag: TagSchema,
  likes: [{}],
}, {
  timestamps: {
    createdAt: "date_created",
    updatedAt: "last_updated"
  }
});


module.exports = model("Post", PostShema);

