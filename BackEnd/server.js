import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './src/config/db.js'; // Connection to database

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Hotel Reservation API is Running!');
});

// Test DB Connection Route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Database Connected Successfully!',
      db_name: process.env.DB_NAME,
      time: result.rows[0].now 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database Connection Failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});