import jwt  from 'jsonwebtoken';
import config  from '../config/env.js';

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @param {string} user.user_id - User ID
 * @param {string} user.email - User email
 * @param {number} user.role_id - Role ID
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      role_id: user.role_id
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expire
    }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

export { 
  generateToken,
  verifyToken
 };