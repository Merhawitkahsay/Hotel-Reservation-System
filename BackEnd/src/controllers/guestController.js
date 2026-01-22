import pool from '../config/database.js';
import Guest from '../models/Guest.js';

class GuestController {

 
  // 1. Get Current User's Profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const query = `
  SELECT guest_id, first_name, last_name, email, phone, 
         profile_picture_url as profile_picture, nationality, address, id_number, 
         date_of_birth, id_document_url
  FROM guests 
  WHERE user_id = $1
`;
      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Guest profile not found' });
      }

      // Clean up file paths for the frontend
      const guestData = result.rows[0];
      if (guestData.profile_picture) {
        guestData.profile_picture = guestData.profile_picture.replace(/\\/g, '/');
      }
      if (guestData.id_document_url) {
        guestData.id_document_url = guestData.id_document_url.replace(/\\/g, '/');
      }

      res.json({ success: true, data: guestData });
    } catch (error) {
      console.error('Get Profile Error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
  }
  static async quickRegister(req, res) {
  try {
    const { 
      first_name, last_name, email, phone, address, 
      id_type, id_number, date_of_birth, nationality 
    } = req.body;

    // We set guest_type as 'walk-in' because an admin is manually registering them
    const query = `
      INSERT INTO guests (
        first_name, last_name, email, phone, address, 
        id_type, id_number, date_of_birth, nationality, guest_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'walk-in') 
      RETURNING *`;

    const values = [
      first_name, last_name, email, phone, address, 
      id_type, id_number, date_of_birth || null, nationality
    ];

    const result = await pool.query(query, values);

    res.status(201).json({ 
      success: true, 
      message: "Guest registered successfully", 
      data: result.rows[0] 
    });
  } catch (err) {
    console.error("Quick Register Error:", err.message);
    res.status(500).json({ success: false, message: "Database error during registration." });
  }
}

  
  // 2. Update Guest Profile (With File Support)
  
  static async updateGuest(req, res) {
    try {
      const { id } = req.params; // guest_id
      const updates = { ...req.body };

      // Process file uploads if they exist and sanitize paths
      if (req.files) {
        if (req.files.id_document) {
          const relativeIdPath = req.files.id_document[0].path.replace(/\\/g, '/'); 
          updates.id_document_url = relativeIdPath;
        }
        
        // FIX FOR PROFILE PICTURE
        if (req.files.profile_picture) {
          const relativeProfilePath = req.files.profile_picture[0].path.replace(/\\/g, '/');
          updates.profile_picture = relativeProfilePath;
        }
      }

      // Call the model to update the database
      const updatedGuest = await Guest.update(id, updates);

      if (!updatedGuest) {
        return res.status(404).json({ success: false, message: 'Guest not found' });
      }

      // Sanitize paths in the response object
      if (updatedGuest.profile_picture) {
        updatedGuest.profile_picture = updatedGuest.profile_picture.replace(/\\/g, '/');
      }
      if (updatedGuest.id_document_url) {
        updatedGuest.id_document_url = updatedGuest.id_document_url.replace(/\\/g, '/');
      }

      res.json({ success: true, message: 'Profile updated successfully', data: updatedGuest });
    } catch (error) {
      console.error('Update Guest Error:', error);
      res.status(500).json({ success: false, message: 'Failed to update guest' });
    }
  }

 
  // 3. Waitlist / Saved Rooms Logic

  static async toggleSavedRoom(req, res) {
    try {
      const { room_id } = req.body;
      const user_id = req.user.id;

      const guestRes = await pool.query('SELECT guest_id FROM guests WHERE user_id = $1', [user_id]);
      if (guestRes.rows.length === 0) return res.status(404).json({message: "Guest profile not found"});
      const guest_id = guestRes.rows[0].guest_id;

      const check = await pool.query('SELECT * FROM saved_rooms WHERE guest_id = $1 AND room_id = $2', [guest_id, room_id]);

      if (check.rows.length > 0) {
        await pool.query('DELETE FROM saved_rooms WHERE guest_id = $1 AND room_id = $2', [guest_id, room_id]);
        return res.json({ success: true, message: 'Room removed from waitlist', isSaved: false });
      } else {
        await pool.query('INSERT INTO saved_rooms (guest_id, room_id) VALUES ($1, $2)', [guest_id, room_id]);
        return res.json({ success: true, message: 'Room saved to waitlist', isSaved: true });
      }
    } catch (error) {
      console.error("Toggle Save Error:", error);
      res.status(500).json({ success: false, message: "Failed to toggle saved room" });
    }
  }

  static async getSavedRooms(req, res) {
    try {
      const user_id = req.user.id;
      
      const query = `
        SELECT s.saved_id, r.room_id, r.room_number, r.main_image_url, 
               (COALESCE(rt.base_price, 0) + COALESCE(r.price_adjustment, 0)) as final_price,
               rt.type_name
        FROM saved_rooms s
        JOIN guests g ON s.guest_id = g.guest_id
        JOIN rooms r ON s.room_id = r.room_id
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        WHERE g.user_id = $1
        ORDER BY s.created_at DESC
      `;
      const result = await pool.query(query, [user_id]);
      
      const formatted = result.rows.map(row => ({
        ...row,
        main_image_url: row.main_image_url ? row.main_image_url.replace(/\\/g, '/') : null
      }));

      res.json({ success: true, data: formatted });
    } catch (error) {
      console.error("Get Saved Rooms Error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch saved rooms" });
    }
  }


  // 4. Admin: Search & Management
 
  static async searchGuests(req, res) {
    try {
      const { q } = req.query;
      if (!q) return res.status(400).json({ success: false, message: 'Search query required' });

      const query = `
        SELECT * FROM guests 
        WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
      `;
      const result = await pool.query(query, [`%${q}%`]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Search failed' });
    }
  }

  static async getAllGuests(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const result = await pool.query(
        'SELECT * FROM guests ORDER BY created_at DESC LIMIT $1 OFFSET $2', 
        [limit, offset]
      );
      const countResult = await pool.query('SELECT COUNT(*) FROM guests');
      
      res.json({
        success: true,
        data: {
          guests: result.rows,
          pagination: {
            total: parseInt(countResult.rows[0].count),
            page,
            limit,
            pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch guests' });
    }
  }

  static async deleteGuest(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Guest.delete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Guest not found' });
      res.json({ success: true, message: 'Guest deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete guest' });
    }
  }
}

export default GuestController;