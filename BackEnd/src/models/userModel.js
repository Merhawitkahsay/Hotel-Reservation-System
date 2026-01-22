import pool from '../config/database.js';

// 1. Find a user by email
export const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0]; // Returns the user object or undefined
};

// 2. Create a new user
export const createUser = async (userData) => {
  const { username, email, passwordHash, role_id } = userData;
  
  const query = `
    INSERT INTO users (username, email, password_hash, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id, username, email, role_id, created_at;
  `;
  
  const values = [username, email, passwordHash, role_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};