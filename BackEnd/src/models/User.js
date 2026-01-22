import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

class User {
  /**
   * Find user by email
   */
  static async findByEmail(email) {
    try {
      const query = `
        SELECT u.*, r.role_name, r.permissions 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
      `; 
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Database error finding user: ' + error.message);
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    try {
      const query = `
        SELECT u.*, r.role_name, r.permissions 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.user_id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Database error finding user: ' + error.message);
    }
  }

  /**
   * Create new user
   */
  static async create(userData) {
    try {
      const { email, password, role_id, verification_token, is_verified } = userData;
      
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
      const passwordHash = await bcrypt.hash(password, salt);

      const query = `
        INSERT INTO users (email, password_hash, role_id, verification_token, is_verified, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING user_id, email, role_id, created_at
      `;
      
      // Default is_active to false until verified
      const result = await pool.query(query, [
        email, 
        passwordHash, 
        role_id, 
        verification_token, 
        is_verified || false, 
        is_verified || false 
      ]);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw new Error('Database error creating user: ' + error.message);
    }
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  static generateToken(user) {
    return jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role_name,
        permissions: user.permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  static async updateLastLogin(userId) {
    try {
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Error updating last login:', error.message);
    }
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

export default User;