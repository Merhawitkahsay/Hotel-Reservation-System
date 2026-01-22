import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

// Mount Auth Routes
router.use('/auth', authRoutes);

export default router;