import pool from '../config/database.js';

class Room {
  static async create(roomData) {
    const {
      room_type_id, room_number, floor, status,
      price_adjustment, special_features, is_active,
      image_url, additional_images, description
    } = roomData;

    const query = `
      INSERT INTO rooms (
        room_type_id, room_number, floor, status, 
        price_adjustment, special_features, is_active, 
        image_url, additional_images, description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      room_type_id, room_number, floor, status,
      price_adjustment, special_features, is_active,
      image_url, additional_images, description
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT r.*, rt.type_name, rt.base_price, rt.max_occupancy 
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      WHERE r.room_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(filters, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT r.*, rt.type_name, rt.base_price 
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      WHERE 1=1
    `;
    const values = [];

    if (filters.room_type_id) {
      values.push(filters.room_type_id);
      query += ` AND r.room_type_id = $${values.length}`;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;
    const result = await pool.query(query, values);
    return { rooms: result.rows, pagination: { page, limit } };
  }

  /**
   * Update Room - Handles TEXT[] arrays for additional_images
   */
  static async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = fields
      .map((field, index) => {
        // Explicitly cast to text array for Postgres
        if (field === 'additional_images' || field === 'special_features') {
          return `${field} = $${index + 2}::text[]`;
        }
        return `${field} = $${index + 2}`;
      })
      .join(', ');

    const query = `
      UPDATE rooms 
      SET ${setClause} 
      WHERE room_id = $1 
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }
}

export default Room;