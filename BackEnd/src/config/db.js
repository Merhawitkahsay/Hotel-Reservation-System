import pg from 'pg';
import dotenv from 'dotenv';

// Read the .env file
dotenv.config();

// Create the connection pool
const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Helper to log successful connection
pool.on('connect', () => {
  console.log('Connection to database established successfully.');
});

export default pool;