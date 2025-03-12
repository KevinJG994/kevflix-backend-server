// config/cloudinary.config.js
 
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
 
const storageImage = new CloudinaryStorage({
    cloudinary,
    params: {
      allowed_formats: ["jpg", "png", "webp"],
      folder: "movie-gallery", // Imagenes
    },
  });
  
  // Configuración para videos
  const storageVideo = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "movie-videos", // Videos
      allowed_formats: ["mp4", "mov", "avi", "webm"],
      resource_type: "video", // Necesario para videos
    },
  });
  
  module.exports = {
    fileUploaderImage: multer({ storage: storageImage }),
    fileUploaderVideo: multer({ storage: storageVideo }),
  };