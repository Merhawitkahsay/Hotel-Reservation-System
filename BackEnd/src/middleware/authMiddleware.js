/**
 * authMiddleware.js - Authentication & Authorization middleware
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * 1. NAMED EXPORT: verifyToken
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    let message = 'Authentication failed';
    if (error.name === 'TokenExpiredError') message = 'Token expired';
    if (error.name === 'JsonWebTokenError') message = 'Invalid token';
    
    return res.status(401).json({ success: false, message });
  }
};

/**
 * 2. CLASS EXPORT: AuthMiddleware
 */
class AuthMiddleware {
  // Point authenticate to the standalone function to avoid duplication
  static authenticate = verifyToken;

  /**
   * Alias for authorizeRoles
   */
  static authorize = (allowedRoles = []) => {
    return this.authorizeRoles(...allowedRoles);
  };

  /**
   * Check if user has any of the required roles
   */
  static authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const userRole = req.user.role || req.user.role_name;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Requires one of: ${allowedRoles.join(', ')}`
        });
      }
      next();
    };
  };

  /**
   * Check if user has specific permission
   */
  static requirePermission = (permission) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const hasPermission = req.user.permissions && (
        req.user.permissions.includes('*') || 
        req.user.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Requires permission: ${permission}`
        });
      }
      next();
    };
  };

  /**
   * Validate user exists and is active (Hits database)
   */
  static validateUser = async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const user = await User.findById(req.user.id);
      if (!user || !user.is_active) {
        return res.status(401).json({ success: false, message: 'User account is inactive or not found' });
      }

      req.user = { ...req.user, ...user };
      next();
    } catch (error) {
      console.error('User validation error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

export default AuthMiddleware;