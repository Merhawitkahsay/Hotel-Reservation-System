import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Guest from '../models/Guest.js';
import EmailService from '../services/emailService.js';
import pool from '../config/database.js';

class AuthController {

  // REGISTER
  static async register(req, res) {
    console.log("--------------- START REGISTRATION ---------------");
    try {
      const { 
        email, password, first_name, last_name, phone, 
        address, region, id_type, id_number, date_of_birth, nationality 
      } = req.body;

      // 1. Basic Age Check
      const age = Math.floor((new Date() - new Date(date_of_birth)) / 31557600000);
      if (age < 18) {
        return res.status(400).json({ success: false, message: 'Guests must be at least 18 years old.' });
      }

      // 2. Check Duplicates
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      // 3. Role Lookup (With Fail-Safe)
      let role = await Role.findByName('guest');
      
      // If role table is empty or 'guest' missing, try to find ANY role or default to ID 1 (dangerous but prevents crash)
      if (!role) {
         console.warn(" 'guest' role not found. Attempting to fetch first available role.");
         const allRoles = await pool.query('SELECT * FROM roles LIMIT 1');
         if (allRoles.rows.length > 0) {
             role = allRoles.rows[0];
         } else {
             // If NO roles exist, we must stop.
             return res.status(500).json({ success: false, message: 'System Configuration Error: No roles defined in database.' });
         }
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // 4. Create User (Auth Credentials)
      const user = await User.create({ 
        email: email.toLowerCase().trim(), 
        password, 
        role_id: role.role_id,
        verification_token: verificationToken,
        is_verified: false 
      });

      // 5. Handle File Path (Normalize for Windows/Linux)
      // Checks if a file was actually uploaded before trying to access .path
      const idDocumentUrl = req.file ? req.file.path.replace(/\\/g, '/') : null;

      // 6. Create Guest Profile (Personal Details)
      await Guest.create({
        user_id: user.user_id,
        created_by: user.user_id, 
        first_name,
        last_name,
        email: user.email,
        phone,
        address,
        region,
        id_type,
        id_number,
        date_of_birth,
        nationality,
        id_document_url: idDocumentUrl,
        guest_type: 'online'
      });

      // 7. Send Verification Email (Non-blocking)
      try {
        await EmailService.sendVerificationEmail(user.email, first_name, verificationToken);
      } catch (e) {
        console.error("⚠️ Email failed to send:", e.message);
        // We do NOT fail the request here, because the user is already created.
      }

      res.status(201).json({ success: true, message: 'Registration successful! Check your email to verify.' });

    } catch (error) {
      console.error('❌ Registration Error:', error);
      res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
  }


  // LOGIN
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Get User + Role + Guest Name
      const result = await pool.query(
        `SELECT u.*, r.role_name, g.first_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.role_id 
         LEFT JOIN guests g ON u.user_id = g.user_id
         WHERE u.email = $1`, 
        [email.toLowerCase().trim()]
      );

      const user = result.rows[0];
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      
      // Allow Admins to login without email verification
      const isStaff = ['admin', 'receptionist'].includes(user.role_name);
      
      if (!isStaff && !user.is_verified) {
        return res.status(403).json({ success: false, message: 'Please verify your email address before logging in.' });
      }

      // Verify Password
      let isMatch = false;
      if (user.password_hash.startsWith('$2')) {
         isMatch = await bcrypt.compare(password, user.password_hash);
      } else {
         isMatch = (password === user.password_hash);
      }

      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      // Generate Token
      const token = jwt.sign(
        { 
            id: user.user_id, 
            role: user.role_name,
            permissions: user.permissions
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({ 
        success: true, 
        data: { 
          token, 
          user: { 
            id: user.user_id, 
            email: user.email, 
            role: user.role_name,
            first_name: user.first_name || 'User' 
          } 
        } 
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // VERIFY EMAIL
  
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      const userResult = await pool.query('SELECT user_id FROM users WHERE verification_token = $1', [token]);

      if (userResult.rowCount === 0) {
        return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
      }

      await pool.query('UPDATE users SET is_verified = true, verification_token = null, is_active = true WHERE user_id = $1', [userResult.rows[0].user_id]);

      res.json({ success: true, message: 'Email verified! You may now login.' });
    } catch (error) {
      console.error('Verify Error:', error);
      res.status(500).json({ success: false, message: 'Verification failed.' });
    }
  }

  static async getCurrentUser(req, res) { res.json({ success: true, data: { user: req.user } }); }
  static async logout(req, res) { res.json({ success: true, message: 'Logout successful' }); }
}

export default AuthController;