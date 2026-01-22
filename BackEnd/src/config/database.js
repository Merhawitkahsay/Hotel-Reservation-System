/**
 * database.js - PostgreSQL connection manager
 * Fixes: Ensures 'pool' is exported as default so pool.connect() works.
 */

import pg from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger.js'; 

const { Pool } = pg;
dotenv.config();

// 1. Configuration for connection pool
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'hotel_db', 
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: parseInt(process.env.DB_POOL_MAX) || 20,
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000,
  allowExitOnIdle: false,
};

// 2. Instantiate the Pool Immediately (Fixes "pool is null" issues)
// We assign it to a const so it is available for export immediately.
const pool = new Pool(poolConfig);

let isConnected = false;

// 3. Attach Event Listeners
pool.on('connect', () => {
  if (!isConnected) {
    logger.info('PostgreSQL pool connected');
    isConnected = true;
  }
});

pool.on('error', (err) => {
  logger.error('PostgreSQL pool error', { error: err.message });
  isConnected = false;
  // Note: pg.Pool automatically tries to reconnect clients, 
  // but we track status for health checks.
});

// 4. Enhanced Helper Functions

/**
 * Execute a query with logging and performance tracking
 */
export const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries (> 1s)
    if (duration > 1000) {
      logger.warn('Slow query detected', {
        query: text,
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(' Database query failed', {
      query: text,
      duration: `${duration}ms`,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Execute a transaction (Wrapper)
 */
export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(' Transaction failed', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get database statistics
 */
export const getPoolStats = () => {
  return {
    status: isConnected ? 'connected' : 'disconnected',
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
};

/**
 * Test database connection
 */
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as time, version() as version');
    client.release();
    
    logger.info('Connection test successful', {
      version: result.rows[0].version.split(' ').slice(0, 4).join(' '),
    });
    return true;
  } catch (error) {
    logger.error('Connection test failed', { error: error.message });
    return false;
  }
};

/**
 * Health Check
 */
export const healthCheck = async () => {
  try {
    const stats = getPoolStats();
    const working = await testConnection();
    return {
      status: working ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      details: { stats, working }
    };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

/**
 * Close the connection pool
 */
export const closePool = async () => {
  try {
    await pool.end();
    logger.info('PostgreSQL connection pool closed');
    isConnected = false;
  } catch (error) {
    logger.error('Error closing pool', { error: error.message });
  }
};

// 5. Graceful Shutdown Handling
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing database pool...');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Closing database pool...');
  await closePool();
  process.exit(0);
});

// 6. DEFAULT EXPORT (Crucial for pool.connect() to work in Controllers)
export default pool;