const mongoose = require("mongoose");
require("dotenv").config();


function launchDB() {
  /*
   * Creates connection to mongodb
   **/

  return mongoose.connect(process.env.MONGODB_URI);
}


module.exports = launchDB;

