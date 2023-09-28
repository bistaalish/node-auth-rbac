const path = require('path');
const multer = require('multer'); // For handling file uploads


// Configure multer to save files to the "public" folder
const storage = multer.diskStorage({
    destination: 'public/profile-pics', // Specify the destination folder
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      callback(null, `${uniqueSuffix}${fileExtension}`);
    },
  });

const upload = multer({ storage });

module.exports = upload