const path = require('path');
const multer = require('multer'); // For handling file uploads
const {BadRequestError} = require('../errors');
function isImage(file) {
    const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more image MIME types if needed
    return imageMimeTypes.includes(file.mimetype);
  }

// Configure multer to save files to the "public" folder
const storage = multer.diskStorage({
    destination: 'public/profile-pics', // Specify the destination folder
    filename: (_req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      callback(null, `${uniqueSuffix}${fileExtension}`);
    },
  });

const upload = multer({ storage,
    fileFilter: (_req,file,callback) => {
        if (!isImage(file)) {
            return callback(new BadRequestError("Only image files are allowed"))
        }
        callback(null,true)
    }
});

module.exports = upload