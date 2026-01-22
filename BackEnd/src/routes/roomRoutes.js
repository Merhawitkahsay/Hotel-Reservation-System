import { Router } from 'express';
import pool from '../config/database.js';
const router = Router();

//  GET ALL ROOMS 
router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, capacity } = req.query;
    
    let query = `
      SELECT r.*, rt.type_name, rt.base_price, rt.max_occupancy, rt.amenities
      FROM rooms r 
      JOIN room_types rt ON r.room_type_id = rt.room_type_id 
      WHERE r.is_active = TRUE
    `;
    const params = [];

    if (type && type !== '') {
      params.push(type);
      query += ` AND rt.type_name = $${params.length}`;
    }
    if (minPrice) {
      params.push(minPrice);
      query += ` AND rt.base_price >= $${params.length}`;
    }
    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND rt.base_price <= $${params.length}`;
    }
    if (capacity) {
      params.push(capacity);
      query += ` AND rt.max_occupancy >= $${params.length}`;
    }

    query += ' ORDER BY r.room_number ASC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET ROOM TYPES (DROPDOWN) 
router.get('/types', async (req, res) => {
  try {
    const result = await pool.query('SELECT type_name FROM room_types ORDER BY type_name ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
});


// GET SINGLE ROOM BY ID 
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // We MUST join room_types to get type_name, base_price, and amenities for the details page
    const query = `
      SELECT 
        r.*, 
        rt.type_name, 
        rt.base_price, 
        rt.description, 
        rt.amenities, 
        rt.max_occupancy
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      WHERE r.room_id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sanctuary not found' 
      });
    }

    res.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (err) {
    console.error("Single Room Fetch Error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error' 
    });
  }
});

export default router;