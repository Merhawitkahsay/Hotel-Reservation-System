import { Router } from 'express';
import pool from '../config/database.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// RESTORED STABLE ROUTE
router.get('/stats', AuthMiddleware.authenticate, AuthMiddleware.authorizeRoles('admin', 'receptionist'), async (req, res) => {
  try {
    const bookings = await pool.query("SELECT COUNT(*) FROM reservations WHERE status != 'cancelled'");
    const revenue = await pool.query("SELECT SUM(total_amount) FROM reservations WHERE payment_status = 'paid'");
    const guests = await pool.query("SELECT COUNT(*) FROM guests");
    const rooms = await pool.query("SELECT COUNT(*) FROM rooms WHERE status = 'available'");

    res.json({
      success: true,
      data: {
        total_bookings: parseInt(bookings.rows[0].count) || 0,
        total_revenue: parseFloat(revenue.rows[0].sum) || 0,
        active_guests: parseInt(guests.rows[0].count) || 0,
        rooms_available: parseInt(rooms.rows[0].count) || 0
      }
    });
  } catch (err) {
    console.error("Dashboard DB Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;