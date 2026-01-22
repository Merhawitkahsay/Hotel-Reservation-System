/**
 * Guest.js - with Profile Picture and ID support
 */
import pool from '../config/database.js';

class Guest {
  /**
   * Create a new guest profile
   */
  static async create(guestData) {
    try {
      const {
        user_id,
        created_by,
        first_name,
        last_name,
        email,
        phone,
        address,
        region,
        id_type,
        id_number,
        date_of_birth,
        nationality,
        id_document_url,
        profile_picture_url,
        guest_type = 'online'
      } = guestData;

      const final_created_by = created_by || user_id;

      const query = `
        INSERT INTO guests (
          user_id, created_by, first_name, last_name, email, phone,
          address, region, id_type, id_number, date_of_birth, 
          nationality, id_document_url, profile_picture_url, guest_type
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `;

      const values = [
        user_id, final_created_by, first_name, last_name, email, phone,
        address || null, region || null, id_type || null, id_number || null,
        date_of_birth || null, nationality || null, id_document_url || null, 
        profile_picture_url || null, guest_type
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('DATABASE ERROR IN GUEST MODEL:', error.message);
      throw error;
    }
  }

  /**
   * Find guest by User ID
   * Includes profile_picture_url explicitly
   */
  static async findByUserId(userId) {
    const query = `
      SELECT 
        guest_id, user_id, first_name, last_name, email, phone, 
        address, region, nationality, id_type, id_number, 
        date_of_birth, id_document_url, profile_picture_url, guest_type, created_at
      FROM guests 
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async findById(id) {
    const query = 'SELECT * FROM guests WHERE guest_id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE guests 
      SET ${setClause} 
      WHERE guest_id = $1 
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM guests WHERE guest_id = $1', [id]);
    return result.rowCount > 0;
  }
}

export default Guest;