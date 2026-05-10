import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Ensure local temporary directory and public uploads directory exist
const tempUploadDir = './uploads';
const publicUploadsDir = './public/uploads';

if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

if (!fs.existsSync(publicUploadsDir)) {
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}

// 1. Configure local Disk storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Strict file filter to enforce PDF resume uploads ONLY
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only PDF resumes are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB file size limit
  }
});

// 3. Configure Cloudinary if credentials exist
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('☁️ \x1b[32mCloudinary configured successfully. Resumes will be uploaded to the cloud.\x1b[0m');
} else {
  console.log('📂 \x1b[33mCloudinary keys missing. Uploads will use fallback local server storage under /public/uploads.\x1b[0m');
}

/**
 * Handles the upload process, returning a hosted URL (Cloudinary or Local server fallback)
 * @param {string} localFilePath - Path of the locally stored temporary file from Multer
 * @returns {Promise<string>} The secure URL of the uploaded asset
 */
export const uploadResumeFile = async (localFilePath) => {
  try {
    if (isCloudinaryConfigured) {
      // Stream to Cloudinary
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: 'dev-portfolios/resumes',
        resource_type: 'raw', // PDF is uploaded as 'raw' or 'image' (raw preserves name, but 'image' is great for pages. Let's use 'raw')
        use_filename: true,
        unique_filename: true,
      });

      // Remove local temp file
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      return result.secure_url;
    } else {
      // Fallback local storage
      const filename = path.basename(localFilePath);
      const destinationPath = path.join(publicUploadsDir, filename);

      // Copy file from temp to public/uploads
      fs.renameSync(localFilePath, destinationPath);

      // Return a relative path or absolute local link
      const serverPort = process.env.PORT || 5000;
      return `http://localhost:${serverPort}/uploads/${filename}`;
    }
  } catch (error) {
    // Make sure we clean up temp file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};
