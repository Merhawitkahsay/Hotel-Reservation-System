import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AuthController from '../controllers/authController.js';
import ValidationMiddleware from '../middleware/validationMiddleware.js';
import AuthMiddleware from '../middleware/authMiddleware.js';
import ErrorMiddleware from '../middleware/errorMiddleware.js';

const router = Router();

// 1. Auto-Directory Creation

const uploadDir = 'uploads/guest_ids';
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created upload directory:', uploadDir);
  }
} catch (err) {
  console.error('Error creating upload directory:', err);
}

// 2. Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ID-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images (JPG, PNG) and PDFs are allowed'));
  }
});

// 3. Auth Routes
// Register Route
router.post(
  '/register',
  upload.single('id_document'), 
  ValidationMiddleware.registerValidation,
  ErrorMiddleware.asyncHandler(AuthController.register)
);

// Login Route
router.post('/login', ValidationMiddleware.loginValidation, ErrorMiddleware.asyncHandler(AuthController.login));

// Verify Email Route
router.get('/verify/:token', ErrorMiddleware.asyncHandler(AuthController.verifyEmail));

// Get Current User
router.get('/me', AuthMiddleware.authenticate, AuthMiddleware.validateUser, ErrorMiddleware.asyncHandler(AuthController.getCurrentUser));

// Logout
router.post('/logout', AuthMiddleware.authenticate, ErrorMiddleware.asyncHandler(AuthController.logout));

export default router;