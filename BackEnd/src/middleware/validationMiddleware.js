import { body, param, validationResult } from 'express-validator';

class ValidationMiddleware {
  static validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  };

  static registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
    // Allows frontend to send confirmPassword without crashing, checks equality
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match');
      return true;
    }),
    body('first_name').notEmpty().withMessage('First name required'),
    body('last_name').notEmpty().withMessage('Last name required'),
    body('phone').notEmpty().withMessage('Phone required'),
    body('nationality').notEmpty().withMessage('Nationality required'),
    body('id_type').notEmpty().withMessage('ID Type required'),
    body('id_number').notEmpty().withMessage('ID Number required'),
    ValidationMiddleware.validate
  ];

  static loginValidation = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
    ValidationMiddleware.validate
  ];
  
  // Helper for ID params
  static validateId = (idName) => [
      param(idName).isInt({ min: 1 }).withMessage('Invalid ID'),
      ValidationMiddleware.validate
  ];
  
  // Helper for Pagination
  static paginationValidation = [
      ValidationMiddleware.validate
  ];
}

export default ValidationMiddleware;