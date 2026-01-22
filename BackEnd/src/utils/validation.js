import { query } from '../config/database.js';

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {Object} { isValid: boolean, message: string }
 */
const validatePassword = (password) => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Check if email already exists in database
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const emailExists = async (email) => {
  const result = await query(
    'SELECT 1 FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return result.rows.length > 0;
};

export { 
  isValidEmail,
  validatePassword,
  emailExists
};