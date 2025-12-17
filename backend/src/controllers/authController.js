import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { generateToken } from '../utils/jwtUtils.js';
import { isValidEmail, validatePassword, emailExists } from '../utils/validation.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { email, password, role_id = 3, first_name, last_name, phone } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Check if email already exists
    if (await emailExists(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Start transaction
    await query('BEGIN');

    try {
      // Create user
      const userResult = await query(
        `INSERT INTO users (role_id, email, password_hash, is_active) 
         VALUES ($1, $2, $3, $4) 
         RETURNING user_id, email, role_id, created_at`,
        [role_id, email, hashedPassword, true]
      );

      const user = userResult.rows[0];

      // If guest registration, create guest record
      if (role_id === 3 && (first_name || last_name || phone)) {
        await query(
          `INSERT INTO guests (user_id, first_name, last_name, phone, email, guest_type) 
           VALUES ($1, $2, $3, $4, $5, 'online')`,
          [user.user_id, first_name || '', last_name || '', phone || '', email]
        );
      }

      // If staff registration, create staff record
      if (role_id === 2 && (first_name || last_name || phone)) {
        await query(
          `INSERT INTO staff (user_id, first_name, last_name, phone, email, position, hire_date) 
           VALUES ($1, $2, $3, $4, $5, 'Receptionist', CURRENT_DATE)`,
          [user.user_id, first_name || '', last_name || '', phone || '', email]
        );
      }

      await query('COMMIT');

      // Generate token
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.user_id,
            email: user.email,
            role_id: user.role_id
          },
          token
        }
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const userResult = await query(
      `SELECT u.user_id, u.email, u.password_hash, u.role_id, u.is_active,
              r.role_name, r.permissions
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user.user_id]
    );

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.user_id,
          email: user.email,
          role_id: user.role_id,
          role_name: user.role_name,
          permissions: user.permissions
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT u.user_id, u.email, u.role_id, u.created_at, u.last_login,
              r.role_name, r.permissions,
              COALESCE(
                json_build_object(
                  'staff_id', s.staff_id,
                  'first_name', s.first_name,
                  'last_name', s.last_name,
                  'position', s.position
                ),
                json_build_object(
                  'guest_id', g.guest_id,
                  'first_name', g.first_name,
                  'last_name', g.last_name
                )
              ) as profile
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN staff s ON u.user_id = s.user_id
       LEFT JOIN guests g ON u.user_id = g.user_id
       WHERE u.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.user_id,
          email: user.email,
          role_id: user.role_id,
          role_name: user.role_name,
          permissions: user.permissions,
          created_at: user.created_at,
          last_login: user.last_login,
          profile: user.profile
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Logout user (client-side token invalidation)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = (req, res) => {
  // Note: JWT is stateless, so logout is handled client-side
  // In a real app, you might implement a token blacklist
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh
 * @access  Private
 */
const refreshToken = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT user_id, email, role_id FROM users WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];
    const token = generateToken(user);

    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing token'
    });
  }
};

export { 
  register,
  login,
  getMe,
  logout,
  refreshToken
};