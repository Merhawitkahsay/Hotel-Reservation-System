import { Router } from 'express';
import ReservationController from '../controllers/reservationController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';
import ErrorMiddleware from '../middleware/errorMiddleware.js';
import pool from '../config/database.js';

const router = Router();

// GLOBAL MIDDLEWARE
router.use(AuthMiddleware.authenticate);

// SPECIFIC ROUTES (Must come BEFORE /:id)

/**
 * @route   GET /api/reservations/my-bookings
 * @desc    Get current logged-in guest's personal reservations
 */
router.get(
  '/my-bookings',
  ErrorMiddleware.asyncHandler(async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
      }

      const query = `
          SELECT 
              r.reservation_id, 
              r.check_in_date, 
              r.check_out_date, 
              r.status AS reservation_status, 
              r.total_amount,
              r.payment_status,
              r.number_of_guests,
              r.created_at,
              rm.room_number, 
              rm.main_image_url,
              rt.type_name AS room_type
          FROM reservations r
          JOIN guests g ON r.guest_id = g.guest_id
          JOIN rooms rm ON r.room_id = rm.room_id
          LEFT JOIN room_types rt ON rm.room_type_id = rt.room_type_id
          WHERE g.user_id = $1
          ORDER BY r.check_in_date DESC
      `;
      
      const result = await pool.query(query, [req.user.id]);
      
      const formattedBookings = result.rows.map(booking => ({
        ...booking,
        main_image_url: booking.main_image_url ? booking.main_image_url.replace(/\\/g, '/') : null
      }));

      res.json({ success: true, data: formattedBookings });
    } catch (error) {
      console.error("SQL Error in my-bookings:", error.message);
      res.status(500).json({ success: false, message: "Database error fetching bookings" });
    }
  })
);

/**
 * @route   POST /api/reservations/calculate-price
 */
router.post(
  '/calculate-price',
  ErrorMiddleware.asyncHandler(async (req, res) => {
    res.status(501).json({ message: "Price calculation endpoint not yet implemented" });
  })
);

// ADMIN ROUTES

/**
 * @route   GET /api/reservations
 * @desc    Get ALL reservations (Admin/Receptionist only)
 */
router.get(
  '/',
  AuthMiddleware.authorizeRoles('admin', 'receptionist'),
  ErrorMiddleware.asyncHandler(async (req, res) => {
    if (ReservationController.getAllReservations) {
        return ReservationController.getAllReservations(req, res);
    }
    const result = await pool.query('SELECT * FROM reservations ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  })
);

// GENERIC ID ROUTES (Must come LAST)

/**
 * @route   POST /api/reservations
 */
router.post(
  '/',
  ErrorMiddleware.asyncHandler(ReservationController.createReservation)
);

/**
 * @route   GET /api/reservations/:id
 * @desc    Get a single reservation by ID (Fixed with JOINS for Edit Page)
 */
router.get('/:id', ErrorMiddleware.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const query = `
      SELECT r.*, rm.room_number, rt.max_occupancy,
             (COALESCE(rt.base_price, 0) + COALESCE(rm.price_adjustment, 0)) as final_price
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.room_id
      JOIN room_types rt ON rm.room_type_id = rt.room_type_id
      WHERE r.reservation_id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Reservation not found" });
    }
    res.json({ success: true, data: result.rows[0] });
}));

/**
 * @route   PUT /api/reservations/:id
 * @desc    Update/Edit Reservation
 */
router.put(
  '/:id', 
  ErrorMiddleware.asyncHandler(ReservationController.updateReservation)
);

/**
 * @route   PUT /api/reservations/:id/cancel
 */
router.put(
  '/:id/cancel',
  ErrorMiddleware.asyncHandler(ReservationController.cancelReservation)
);

/**
 * @route   PUT /api/reservations/:id/confirm-payment
 */
router.put(
  '/:id/confirm-payment', 
  ErrorMiddleware.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        "UPDATE reservations SET payment_status = 'paid', status = 'confirmed' WHERE reservation_id = $1 RETURNING *", 
        [id]
    );
    res.json({ success: true, message: "Payment confirmed", data: result.rows[0] });
  })
);

export default router;