require("dotenv").config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


function saveToCloud(file) {
  cloudinary.uploader.upload(file,
    { timeout: 60000 }, (err, data) => {
      if (err) {
        console.log(err.message)
      } else {
        console.log(data.secure_url)
      }
    })
}


module.exports = { cloudinary, saveToCloud };
