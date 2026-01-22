import pool from '../config/database.js';

class RoomController {
  // ==========================================
  // 1. Get All Rooms (For Guest Gallery)
  // ==========================================
  static async getAllRooms(req, res) {
    try {
      const { type, minPrice, maxPrice, capacity } = req.query;

      let query = `
        SELECT 
          r.room_id,
          r.room_number,
          r.status,
          r.main_image_url,
          r.price_adjustment,
          r.description as room_desc,
          rt.type_name as room_type,
          rt.base_price,
          rt.max_occupancy,
          rt.description as type_desc,
          (COALESCE(rt.base_price, 0) + COALESCE(r.price_adjustment, 0)) as final_price
        FROM rooms r
        LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
        WHERE r.is_active = TRUE
      `;
      
      const queryParams = [];
      let paramIndex = 1;

      if (type && type.trim() !== '' && type !== 'All Types') {
        query += ` AND rt.type_name = $${paramIndex}`;
        queryParams.push(type);
        paramIndex++;
      }

      if (minPrice) {
        query += ` AND (COALESCE(rt.base_price, 0) + COALESCE(r.price_adjustment, 0)) >= $${paramIndex}`;
        queryParams.push(minPrice);
        paramIndex++;
      }

      if (maxPrice) {
        query += ` AND (COALESCE(rt.base_price, 0) + COALESCE(r.price_adjustment, 0)) <= $${paramIndex}`;
        queryParams.push(maxPrice);
        paramIndex++;
      }

      if (capacity) {
        query += ` AND COALESCE(rt.max_occupancy, 0) >= $${paramIndex}`;
        queryParams.push(capacity);
        paramIndex++;
      }

      query += ' ORDER BY r.room_number ASC';

      const result = await pool.query(query, queryParams);

      const formattedRooms = result.rows.map(room => ({
        ...room,
        room_type: room.room_type || 'Standard',
        final_price: parseFloat(room.final_price || 0), 
        max_occupancy: parseInt(room.max_occupancy || 2), 
        description: room.room_desc || room.type_desc || "Experience luxury.",
        main_image_url: room.main_image_url ? room.main_image_url.replace(/\\/g, '/') : null
      }));

      res.json({
        success: true,
        data: {
          rooms: formattedRooms,
          count: result.rowCount
        }
      });

    } catch (error) {
      console.error('Get Rooms Error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch rooms' });
    }
  }


  // 2. Get Single Room By ID

  static async getRoomById(req, res) {
    try {
      const { id } = req.params;
      
      const query = `
        SELECT 
          r.room_id, r.room_number, r.status, r.main_image_url, r.price_adjustment,
          r.description as room_desc, rt.type_name as room_type, rt.base_price,
          rt.max_occupancy, rt.description as type_desc, rt.amenities,
          (COALESCE(rt.base_price, 0) + COALESCE(r.price_adjustment, 0)) as final_price
        FROM rooms r
        LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
        WHERE r.room_id = $1
      `;

      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      
      const room = result.rows[0];
      const formattedRoom = {
        ...room,
        room_type: room.room_type || 'Standard',
        final_price: parseFloat(room.final_price || 0),
        max_occupancy: parseInt(room.max_occupancy || 2),
        main_image_url: room.main_image_url ? room.main_image_url.replace(/\\/g, '/') : null
      };

      res.json({ success: true, data: formattedRoom });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

 
  // 3. Admin: Add New Room
  static async addRoom(req, res) {
    try {
      const { room_number, room_type_id, floor, price_adjustment, description } = req.body;

      // Check if room exists
      const check = await pool.query('SELECT * FROM rooms WHERE room_number = $1', [room_number]);
      if (check.rows.length > 0) {
        return res.status(400).json({ success: false, message: "Room number already exists" });
      }

      const query = `
        INSERT INTO rooms (room_number, room_type_id, floor, price_adjustment, description, status, is_active)
        VALUES ($1, $2, $3, $4, $5, 'available', TRUE)
        RETURNING *
      `;
      const values = [room_number, room_type_id, floor, price_adjustment || 0, description];
      const result = await pool.query(query, values);

      res.status(201).json({ success: true, message: "Room added successfully!", data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }


  // 4. Get Room Types (For Admin Dropdown)
 
  static async getRoomTypes(req, res) {
    try {
      const result = await pool.query('SELECT room_type_id, type_name FROM room_types ORDER BY type_name');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch types' });
    }
  }


 

// Delete a room
static async deleteRoom(req, res) {
  try {
    const { id } = req.params;
    
    // Check for active reservations first to prevent database errors
    const activeRes = await pool.query(
      "SELECT * FROM reservations WHERE room_id = $1 AND status != 'cancelled'", 
      [id]
    );
    
    if (activeRes.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete room with active reservations." 
      });
    }

    await pool.query('DELETE FROM rooms WHERE room_id = $1', [id]);
    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Update room details
static async updateRoom(req, res) {
    try {
      const { id } = req.params;
      
      // 1. Get text data from req.body
      const { 
        room_number, 
        room_type_id, 
        floor, 
        price_adjustment, 
        description, 
        status 
      } = req.body;

      // 2. Handle Image logic
   
      let imageUrl = req.body.main_image_url; 

      if (req.files && req.files['main_image'] && req.files['main_image'][0]) {
        imageUrl = `uploads/rooms/${req.files['main_image'][0].filename}`;
      }

      // 3. The Actual Database Logic
      const query = `
        UPDATE rooms SET 
          room_number = $1, 
          room_type_id = $2, 
          floor = $3, 
          price_adjustment = $4, 
          description = $5, 
          status = $6,
          main_image_url = $7,
          updated_at = NOW()
        WHERE room_id = $8 RETURNING *`;
      
      const values = [
        room_number, 
        room_type_id, 
        floor, 
        price_adjustment, 
        description, 
        status, 
        imageUrl, 
        id
      ];
      
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }

      // 4. Return Success
      res.json({ 
        success: true, 
        message: "Room updated successfully", 
        data: result.rows[0] 
      });

    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }  // 5. Placeholders for Future Logic

  static async updateRoom(req, res) { 
    res.status(501).json({message: "Not implemented"}); 
  }

  static async deleteRoom(req, res) { 
    res.status(501).json({message: "Not implemented"}); 
  }
}

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure ID is a valid number to prevent SQL crashes
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid room ID" });
    }

    const result = await pool.query(
      `SELECT r.*, rt.type_name, rt.base_price 
       FROM rooms r 
       JOIN room_types rt ON r.room_type_id = rt.type_id 
       WHERE r.room_id = $1`, 
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    // This console.log will show you the EXACT database error in your terminal
    console.error("DATABASE ERROR:", err.message); 
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default RoomController;