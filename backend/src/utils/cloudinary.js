import cloudinary from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a local file to Cloudinary and deletes the local copy afterward.
 * @param {string} localFilePath - Path to the local file to be uploaded.
 * @returns {object|null} - Cloudinary response on success, null on failure.
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.v2.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // File has been uploaded successfully, remove the local temporary file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    
    // Attempt to remove the local temporary file to clean up local storage
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError);
    }
    
    return null;
  }
};

export { uploadOnCloudinary };
