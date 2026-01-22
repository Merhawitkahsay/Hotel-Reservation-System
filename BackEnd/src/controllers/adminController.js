import pool from '../config/database.js';

class AdminController {

  // Get Real-Time Dashboard Statistics
  static async getDashboardStats(req, res) {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*)::INT FROM reservations) as total_bookings,
        (SELECT COALESCE(SUM(total_amount), 0)::FLOAT FROM reservations WHERE status != 'cancelled') as total_revenue,
        (SELECT COUNT(DISTINCT guest_id)::INT FROM reservations WHERE status = 'confirmed') as active_guests,
        (SELECT COUNT(*)::INT FROM rooms WHERE status = 'available') as rooms_available
    `;
    
    const result = await pool.query(statsQuery);
    

    console.log("DB Stats Result:", result.rows[0]);

    return res.status(200).json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}
}

export default AdminController;