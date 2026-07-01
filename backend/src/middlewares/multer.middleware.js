import multer from "multer";

// Configure Multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save temporary files to the ./public/temp folder
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Keep the original filename of the uploaded file
    cb(null, file.originalname);
  }
});

// Create the upload middleware instance
export const upload = multer({ 
  storage 
});
