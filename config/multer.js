//Config from fileUploaderProject
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage:storage})

module.exports = upload;
//Store files in memeory => in a buffer
//upload to cloudinary using a buffer