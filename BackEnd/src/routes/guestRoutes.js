import { Router } from 'express';
import pool from '../config/database.js';
import GuestController from '../controllers/guestController.js';
// Import AuthMiddleware to fix the ReferenceError
import AuthMiddleware, { verifyToken } from '../middleware/authMiddleware.js';
import ErrorMiddleware from '../middleware/errorMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; 

const router = Router();

// AUTHENTICATION REQUIRED (Global)
// All routes defined below this line require a valid JWT token
router.use(AuthMiddleware.authenticate);

/**
 * @route   GET /api/guests/profile
 * @desc    Get current logged-in user's guest profile
 */
router.get(
  '/profile', 
  ErrorMiddleware.asyncHandler(GuestController.getProfile)
);

/**
 * @route   POST /api/guests/quick-register
 */
router.post(
  '/quick-register', 
  AuthMiddleware.authorizeRoles('admin'), 
  GuestController.quickRegister
);

/**
 * @route   PUT /api/guests/profile/:id
 * @desc    Update Guest Profile
 */
router.put(
  '/profile/:id',
  upload.fields([
    { name: 'profile_picture', maxCount: 1 }, 
    { name: 'id_document', maxCount: 1 }
  ]),
  ErrorMiddleware.asyncHandler(GuestController.updateGuest)
);

/**
 * @route   POST /api/guests/toggle-save
 * @desc    Toggle (Save/Unsave) a room to waitlist
 */
router.post('/toggle-save', verifyToken, async (req, res) => {
  const { roomId } = req.body;
  
  const userId = req.user.id || req.user.user_id || req.user.sub; 

  if (!userId) {
    return res.status(401).json({ success: false, message: 'User ID not found in token' });
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM saved_rooms WHERE user_id = $1 AND room_id = $2',
      [userId, roomId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'DELETE FROM saved_rooms WHERE user_id = $1 AND room_id = $2',
        [userId, roomId]
      );
      return res.json({ success: true, isSaved: false });
    } else {
      await pool.query(
        'INSERT INTO saved_rooms (user_id, room_id) VALUES ($1, $2)',
        [userId, roomId]
      );
      return res.json({ success: true, isSaved: true });
    }
  } catch (err) {
    console.error("Toggle Save Error:", err.message);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

/**
 * @route   GET /api/guests/saved-rooms
 */
router.get(
  '/saved-rooms',
  ErrorMiddleware.asyncHandler(GuestController.getSavedRooms)
);

// ADMIN / RECEPTIONIST ONLY ROUTES

router.get(
  '/', 
  AuthMiddleware.authorizeRoles('admin', 'receptionist'), 
  ErrorMiddleware.asyncHandler(GuestController.getAllGuests)
);

router.get(
  '/search', 
  AuthMiddleware.authorizeRoles('admin', 'receptionist'), 
  ErrorMiddleware.asyncHandler(GuestController.searchGuests)
);

router.delete(
  '/:id', 
  AuthMiddleware.authorizeRoles('admin'), 
  ErrorMiddleware.asyncHandler(GuestController.deleteGuest)
);

export default router;