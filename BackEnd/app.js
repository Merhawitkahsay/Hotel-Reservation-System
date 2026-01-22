import express from 'express';
import dotenv from 'dotenv';
import os from 'os';
import cors from 'cors'; 

// Load environment variables
dotenv.config();

// Import middleware
import { httpLogger } from './src/utils/logger.js';
import SecurityMiddleware from './src/middleware/securityMiddleware.js';
import PerformanceMiddleware from './src/middleware/performanceMiddleware.js';
import ErrorMiddleware from './src/middleware/errorMiddleware.js';

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import guestRoutes from './src/routes/guestRoutes.js';
import roomRoutes from './src/routes/roomRoutes.js'; 
import reservationRoutes from './src/routes/reservationRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

const app = express();

// CORE MIDDLEWARE
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// SECURITY & PERFORMANCE
SecurityMiddleware.applyAllSecurity(app);
PerformanceMiddleware.applyAllOptimizations(app);

app.use(httpLogger);

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API ROUTES mapping
app.use('/api/auth', authRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// ERROR HANDLING
ErrorMiddleware.handleErrors(app);

export default app;