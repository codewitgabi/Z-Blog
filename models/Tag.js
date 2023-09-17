const { Schema, model } = require("mongoose");


const TagSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 10,
    lowercase: true
  }
});


module.exports = TagSchema;

