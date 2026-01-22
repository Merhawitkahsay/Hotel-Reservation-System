import pool from '../config/database.js';
import nodemailer from 'nodemailer';

class ReservationController {

  // 1. Create Reservation (With Future Booking & Payment Link)
 
  static async createReservation(req, res) {
    const client = await pool.connect();
    try {
      const { 
        room_id, check_in_date, check_out_date, 
        number_of_guests, special_requests, guest_id 
      } = req.body;

      // Initialize Nodemailer Transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await client.query('BEGIN');

      // --- 1. IDENTIFY TARGET GUEST ---
      let targetGuestId = guest_id;
      if (!targetGuestId || req.user.role !== 'admin') {
        const guestLookup = await client.query(
          'SELECT guest_id FROM guests WHERE user_id = $1', 
          [req.user.id]
        );
        if (guestLookup.rows.length === 0) throw new Error("Guest profile not found.");
        targetGuestId = guestLookup.rows[0].guest_id;
      }

      // --- 2. DATE CONFLICT CHECK (Allows future bookings) ---
      const conflictQuery = `
        SELECT * FROM reservations 
        WHERE room_id = $1 
        AND status != 'cancelled'
        AND (
          (check_in_date < $3 AND check_out_date > $2)
        )
      `;
      const conflictRes = await client.query(conflictQuery, [room_id, check_in_date, check_out_date]);

      if (conflictRes.rows.length > 0) {
        throw new Error("This room is already reserved for the selected dates.");
      }

      // --- 3. ROOM & PRICE VALIDATION ---
      const roomQuery = `
        SELECT (COALESCE(rt.base_price, 0) + COALESCE(r.price_adjustment, 0)) as nightly_price, 
               rt.max_occupancy, r.room_number
        FROM rooms r 
        JOIN room_types rt ON r.room_type_id = rt.room_type_id 
        WHERE r.room_id = $1`;
      
      const roomResult = await client.query(roomQuery, [room_id]);
      if (roomResult.rows.length === 0) throw new Error('Room not found');
      
      const { nightly_price, max_occupancy, room_number } = roomResult.rows[0];

      if (number_of_guests > max_occupancy) {
        throw new Error(`Room capacity exceeded. Max allowed: ${max_occupancy}`);
      }

      const start = new Date(check_in_date);
      const end = new Date(check_out_date);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (nights <= 0) throw new Error("Check-out date must be after check-in date.");

      const total_amount = (parseFloat(nightly_price) * nights).toFixed(2);

      // --- 4. INSERT RESERVATION ---
      const insertQuery = `
        INSERT INTO reservations (
          guest_id, room_id, created_by, check_in_date, check_out_date, 
          number_of_guests, total_amount, special_requests, status, payment_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'confirmed', 'pending') RETURNING *`;
      
      const reservationResult = await client.query(insertQuery, [
        targetGuestId, room_id, req.user.id, check_in_date, check_out_date, 
        number_of_guests, total_amount, special_requests || null
      ]);

      // --- 5. CONDITIONAL ROOM STATUS UPDATE ---
      const today = new Date().toISOString().split('T')[0];
      if (check_in_date === today) {
        await client.query("UPDATE rooms SET status = 'occupied' WHERE room_id = $1", [room_id]);
      }

      // --- 6. FETCH GUEST INFO FOR EMAIL ---
      const guestDetails = await client.query(
        'SELECT first_name, email FROM guests WHERE guest_id = $1', 
        [targetGuestId]
      );
      const { first_name, email: guestEmail } = guestDetails.rows[0];

      await client.query('COMMIT');

      // --- 7. SEND EMAIL WITH PAYMENT LINK (FIXED SCOPE) ---
      const resId = reservationResult.rows[0].reservation_id;
      const paymentLink = `http://localhost:5173/payment/${resId}`;

      const emailOptions = {
        from: '"ህድሞ Reservation" <noreply@hidmo.com>',
        to: guestEmail,
        subject: "Booking Confirmation & Payment - ህድሞ",
        html: `
          <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px;">
            <h2 style="color: #d97706; text-transform: uppercase; letter-spacing: 2px;">Reservation Confirmed</h2>
            <p style="color: #666;">Hello <b>${first_name}</b>, your stay at ህድሞ for <b>Room ${room_number}</b> is secured.</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 15px; margin: 25px 0;">
              <p style="margin: 5px 0;"><b>Check-in:</b> ${check_in_date}</p>
              <p style="margin: 5px 0;"><b>Check-out:</b> ${check_out_date}</p>
              <p style="margin: 5px 0; color: #d97706; font-weight: bold;"><b>Total Amount:</b> ${total_amount} ETB</p>
            </div>

            <p style="margin-bottom: 30px; color: #666;">To finalize your booking, please complete your payment via our secure portal:</p>
            
            <a href="${paymentLink}" 
               style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
               Complete Payment
            </a>

            <p style="margin-top: 40px; font-size: 12px; color: #aaa;">If the button doesn't work, copy this link: ${paymentLink}</p>
          </div>
        `
      };

      transporter.sendMail(emailOptions).catch(err => console.error("Email Error:", err));

      res.status(201).json({ success: true, data: reservationResult.rows[0] });

    } catch (error) {
      if (client) await client.query('ROLLBACK');
      res.status(400).json({ success: false, message: error.message || 'Failed to create reservation' });
    } finally {
      client.release();
    }
  }

  // 2. Update Reservation (Edit Logic)

  static async updateReservation(req, res) {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const { check_in_date, check_out_date, number_of_guests, special_requests } = req.body;

      await client.query('BEGIN');
      const existingRes = await client.query('SELECT * FROM reservations WHERE reservation_id = $1', [id]);
      if (existingRes.rows.length === 0) throw new Error('Reservation not found');
      
      const oldRes = existingRes.rows[0];
      if (oldRes.created_by !== req.user.id && req.user.role !== 'admin') throw new Error('Unauthorized');

      let newTotal = oldRes.total_amount;
      if (check_in_date && check_out_date) {
        const start = new Date(check_in_date);
        const end = new Date(check_out_date);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const roomRes = await client.query(
          `SELECT (COALESCE(rt.base_price, 0) + COALESCE(r.price_adjustment, 0)) as nightly_price 
           FROM rooms r JOIN room_types rt ON r.room_type_id = rt.room_type_id WHERE r.room_id = $1`, [oldRes.room_id]
        );
        newTotal = (parseFloat(roomRes.rows[0].nightly_price) * nights).toFixed(2);
      }

      const updateQuery = `
        UPDATE reservations SET 
          check_in_date = COALESCE($1, check_in_date), 
          check_out_date = COALESCE($2, check_out_date), 
          number_of_guests = COALESCE($3, number_of_guests), 
          special_requests = COALESCE($4, special_requests),
          total_amount = $5, updated_at = NOW()
        WHERE reservation_id = $6 RETURNING *`;
      
      const result = await client.query(updateQuery, [check_in_date, check_out_date, number_of_guests, special_requests, newTotal, id]);
      await client.query('COMMIT');
      res.json({ success: true, message: 'Update saved.', data: result.rows[0] });
    } catch (error) {
      if (client) await client.query('ROLLBACK');
      res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  }

 
  // 3. Get Personal Reservations

  static async getMyReservations(req, res) {
    try {
      const query = `
        SELECT r.reservation_id, r.check_in_date, r.check_out_date, r.status AS reservation_status, 
               r.payment_status, r.total_amount, rm.room_number, rt.type_name AS room_type
        FROM reservations r
        JOIN rooms rm ON r.room_id = rm.room_id
        JOIN room_types rt ON rm.room_type_id = rt.room_type_id
        JOIN guests g ON r.guest_id = g.guest_id
        WHERE g.user_id = $1 ORDER BY r.check_in_date DESC`;
      const result = await pool.query(query, [req.user.id]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }


  // 4. Admin: Get All 
  
  static async getAllReservations(req, res) {
    try {
      const query = `
        SELECT r.*, g.first_name, g.last_name, rm.room_number 
        FROM reservations r
        JOIN guests g ON r.guest_id = g.guest_id
        JOIN rooms rm ON r.room_id = rm.room_id
        ORDER BY r.created_at DESC`;
        
      const result = await pool.query(query);
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error("CRITICAL ERROR:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  
  // 5. Cancel Reservation

  static async cancelReservation(req, res) {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      await client.query('BEGIN');
      const check = await client.query('SELECT room_id, created_by FROM reservations WHERE reservation_id = $1', [id]);
      if (check.rows.length === 0) throw new Error("Not found");
      if (check.rows[0].created_by !== req.user.id && req.user.role !== 'admin') throw new Error("Unauthorized");

      await client.query("UPDATE reservations SET status = 'cancelled' WHERE reservation_id = $1", [id]);
      await client.query("UPDATE rooms SET status = 'available' WHERE room_id = $1", [check.rows[0].room_id]);
      await client.query('COMMIT');
      res.json({ success: true, message: "Cancelled" });
    } catch (error) {
      if (client) await client.query('ROLLBACK');
      res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  }
}

export default ReservationController;