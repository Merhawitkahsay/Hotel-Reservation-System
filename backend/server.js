import express  from 'express';
import cors  from 'cors';
import helmet  from 'helmet';
import dotenv  from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Hotel Reservation System API is running'
  });
});










// Add after middleware setup, before error handling:

// Import routes
import authRoutes  from './src/routes/authRoutes.js';

// Use routes
app.use('/api/auth', authRoutes);

// Test route (keep existing)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Hotel Reservation System API'
  });
});






// Error handling middleware (will be expanded later)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;













//import app  from './app.js';
import config  from './src/config/env.js';

// Validate environment variables
try {
  config.validate();
} catch (error) {
  console.error('Startup failed:', error.message);
  process.exit(1);
}

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
  Server is running!
  Port: ${PORT}
  Environment: ${config.nodeEnv}
  Time: ${new Date().toLocaleString()}
  Health check: http://localhost:${PORT}/api/health
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});



// import app  from './app.js';
// import pool  from './src/config/db.js';

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(` Server running on http://localhost:${PORT}`);
// });






// require('dotenv').config();
// require('./src/config/db');

// console.log('PORT:', process.env.PORT);
// console.log('DB NAME:', process.env.DB_NAME);
// console.log('JWT SECRET:', process.env.JWT_SECRET);





