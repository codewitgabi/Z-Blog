const { Schema, model, ObjectId } = require("mongoose");


const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    maxLength: [20, "Username is too long. Use a maximum of 20 characters"]
  },
  email: {
    type: String,
    match: [/^\w+@\w+\.\w+\.?\w*/, "Please enter a valid email address"], 
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  is_active: {
    type: Boolean,
    default: false
  },
  is_superuser: {
    type: Boolean,
    default: false
  },
  is_author: {
    type: Boolean,
    default: false
  },
  last_login: Date,
  posts: [ObjectId]
})

/*
UserSchema.aggregate.lookups({
  from: "Post",
  localField: "posts",
  foreignField: "_id",
  as: "written_posts"
})
*/

module.exports = model("User", UserSchema);

