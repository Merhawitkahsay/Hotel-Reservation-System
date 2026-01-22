/**
 * server.js - Application entry point
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import logger from './src/utils/logger.js';
import { testConnection } from './src/config/database.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

//  STATIC FILE SERVING (FIXED)
// 1. We force the 'Cross-Origin-Resource-Policy' header to 'cross-origin'
//    This fixes the ERR_BLOCKED_BY_RESPONSE error on the frontend.
// 2. We use path.join(__dirname, 'uploads') assuming 'uploads' is in the root folder.
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

//  DATABASE INITIALIZATION
async function initializeDatabase() {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      logger.error(' Database connection failed');
      throw new Error('Database connection failed');
    }
    logger.info(' PostgreSQL database connected successfully');
    return true;
  } catch (error) {
    logger.error(' Database initialization failed:', { error: error.message });
    throw error;
  }
}

// SERVER STARTUP
async function startServer() {
  try {
    await initializeDatabase();
    
    const server = app.listen(PORT, () => {
      logger.info(`
      Hotel Reservation System Backend
       Server running in ${process.env.NODE_ENV || 'development'} mode
       Listening on port ${PORT}

       MAIN LINKS
       API Base URL:    ${BASE_URL}/api
       Swagger Docs:    ${BASE_URL}/api-docs
       Uploads Path:    ${BASE_URL}/uploads

       AUTHENTICATION
      POST   ${BASE_URL}/api/auth/register
      POST   ${BASE_URL}/api/auth/login
      
       GUESTS
      GET    ${BASE_URL}/api/guests/profile
      `);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        logger.error('Server error:', { error: error.message });
        throw error;
      }
    });

    const shutdown = async () => {
      logger.info('Received shutdown signal');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return server;
  } catch (error) {
    logger.error('Failed to start server:', { error: error.message });
    process.exit(1);
  }
}

// Global Handlers
process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED REJECTION:', { reason: reason.message || reason });
});

process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION:', { error: error.message });
});

startServer();