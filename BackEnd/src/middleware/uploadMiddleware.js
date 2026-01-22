import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Ensure upload directories exist
const uploadDir = 'uploads/';
const guestAssetsDir = 'uploads/guest_assets/';

// Create folders if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(guestAssetsDir)) {
  fs.mkdirSync(guestAssetsDir, { recursive: true });
}

// 2. Configure Storage (Where to save and what to name files)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save all guest-related files here
    cb(null, 'uploads/guest_assets/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename: fieldname-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// 3. File Filter (Only allow Images and PDFs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png) and PDFs are allowed!'));
  }
};

// 4. Initialize Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter
});

export default upload;