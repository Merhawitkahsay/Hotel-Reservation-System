/**
 * Reservation.js - Reservation model
 * Handles booking operations including creation, modification,
 * cancellation, and availability checking.
 */
import pool from '../config/database.js';

class Reservation {
  /**
   * Fetches reservations for the logged-in guest.
   * Joins with room_types to retrieve the category name (room_type).
   */
  static async getGuestReservations(userId) {
    try {
      const query = `
        SELECT 
          res.reservation_id, 
          res.check_in_date, 
          res.check_out_date, 
          res.total_amount, 
          res.payment_status,
          res.status AS reservation_status, 
          r.room_number, 
          rt.type_name AS room_type
        FROM reservations res
        JOIN guests g ON res.guest_id = g.guest_id
        JOIN rooms r ON res.room_id = r.room_id
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        WHERE g.user_id = $1
        ORDER BY res.check_in_date DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Database error fetching guest reservations: ${error.message}`);
    }
  }  
  /**
   * Find reservation by ID
   */
  static async findById(reservationId) {
    try {
      const query = `
        SELECT 
          res.*,
          g.first_name || ' ' || g.last_name as guest_name,
          g.email as guest_email,
          r.room_number,
          rt.type_name as room_type
        FROM reservations res
        JOIN guests g ON res.guest_id = g.guest_id
        JOIN rooms r ON res.room_id = r.room_id
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        WHERE res.reservation_id = $1
      `;
      const result = await pool.query(query, [reservationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error finding reservation: ${error.message}`);
    }
  }

  /**
   * Get guest's reservations - SQL JOIN
   */
  static async getGuestReservations(userId) {
    try {
      const query = `
        SELECT 
          res.reservation_id,
          res.check_in_date,
          res.check_out_date,
          res.total_amount,
          res.payment_status,
          res.status AS reservation_status,
          r.room_number,
          rt.type_name AS room_type
        FROM reservations res
        JOIN guests g ON res.guest_id = g.guest_id
        JOIN rooms r ON res.room_id = r.room_id
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        WHERE g.user_id = $1
        ORDER BY res.check_in_date DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Database error getting guest reservations: ${error.message}`);
    }
  }

  /**
   * Calculate reservation price
   */
  static async calculatePrice(roomId, checkInDate, checkOutDate) {
    try {
      const roomQuery = `SELECT rt.base_price, r.price_adjustment FROM rooms r JOIN room_types rt ON r.room_type_id = rt.room_type_id WHERE r.room_id = $1`;
      const roomResult = await pool.query(roomQuery, [roomId]);
      const { base_price, price_adjustment } = roomResult.rows[0];
      const dailyRate = parseFloat(base_price) + parseFloat(price_adjustment || 0);
      const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
      return dailyRate * nights;
    } catch (error) {
      throw new Error(`Error calculating price: ${error.message}`);
    }
  }

  static async update(id, data) {
    const fields = Object.keys(data).map((k, i) => `${k} = $${i + 1}`).join(', ');
    const query = `UPDATE reservations SET ${fields}, updated_at = NOW() WHERE reservation_id = $${Object.keys(data).length + 1} RETURNING *`;
    const result = await pool.query(query, [...Object.values(data), id]);
    return result.rows[0];
  }

  static async cancel(id, reason) { return this.update(id, { status: 'cancelled', cancellation_reason: reason }); }
  static async checkIn(id) { return this.update(id, { status: 'checked-in', actual_check_in: new Date() }); }
  static async checkOut(id) { return this.update(id, { status: 'checked-out', actual_check_out: new Date() }); }
}

export default Reservation;