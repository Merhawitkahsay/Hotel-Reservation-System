import { query } from '../config/database.js';

/**
 * Middleware to check if user has required role
 * @param {...string} allowedRoles - Role names allowed to access
 */
const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get user's role from database
      const result = await query(
        `SELECT r.role_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.role_id 
         WHERE u.user_id = $1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User role not found'
        });
      }

      const userRole = result.rows[0].role_name;

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        });
      }

      req.user.role = userRole;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking user role',
        error: error.message
      });
    }
  };
};

/**
 * Check if user has any of the required permissions
 * @param {...string} requiredPermissions - Permissions required
 */
const hasPermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get user's permissions from database
      const result = await query(
        `SELECT r.permissions 
         FROM users u 
         JOIN roles r ON u.role_id = r.role_id 
         WHERE u.user_id = $1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User permissions not found'
        });
      }

      const userPermissions = result.rows[0].permissions;

      // Check if user has admin access (all permissions)
      if (userPermissions.includes('*')) {
        return next();
      }

      // Check if user has any of the required permissions
      const hasRequiredPermission = requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );

      if (!hasRequiredPermission) {
        return res.status(403).json({
          success: false,
          message: `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking user permissions',
        error: error.message
      });
    }
  };
};

export { 
  authorize,
  hasPermission
};