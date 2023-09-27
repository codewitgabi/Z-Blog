const { Schema, model, ObjectId } = require("mongoose");
const { isEmail, isURL } = require("validator");


const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    maxLength: [20, "Username is too long. Use a maximum of 20 characters"]
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    validate: [isEmail, "Please provided a valid email"]
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    trim: true,
    validate: [isURL, "{VALUE} is not a valid url"]
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
  posts: [{
    type: ObjectId,
    ref: "Post"
  }]
})


module.exports = model("User", UserSchema);

