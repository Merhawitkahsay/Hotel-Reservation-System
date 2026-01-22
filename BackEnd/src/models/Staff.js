/**
 * Staff.js - Staff model
 * * Handles staff member operations including employee management
 * and user-staff relationship.
 * * Dependencies:
 * - database pool from config/database.js
 */

import pool from '../config/database.js';

class Staff {
  /**
   * Create new staff member
   * @param {Object} staffData - Staff information
   * @returns {Promise<Object>} Created staff member
   */
  static async create(staffData) {
    try {
      const {
        user_id,
        first_name,
        last_name,
        phone,
        email,
        address = null,
        position,
        department = null,
        hire_date,
        is_active = true
      } = staffData;

      const query = `
        INSERT INTO staff (
          user_id, first_name, last_name, phone, email,
          address, position, department, hire_date, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        user_id,
        first_name,
        last_name,
        phone,
        email,
        address,
        position,
        department,
        hire_date,
        is_active
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Database error creating staff: ${error.message}`);
    }
  }

  /**
   * Find staff by ID
   * @param {number} staffId - Staff ID
   * @returns {Promise<Object|null>} Staff object or null
   */
  static async findById(staffId) {
    try {
      const query = `
        SELECT 
          s.*,
          u.email as user_email,
          r.role_name
        FROM staff s
        JOIN users u ON s.user_id = u.user_id
        JOIN roles r ON u.role_id = r.role_id
        WHERE s.staff_id = $1
      `;
      const result = await pool.query(query, [staffId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error finding staff: ${error.message}`);
    }
  }

  /**
   * Find staff by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} Staff object or null
   */
  static async findByUserId(userId) {
    try {
      const query = `
        SELECT 
          s.*,
          u.email as user_email,
          r.role_name
        FROM staff s
        JOIN users u ON s.user_id = u.user_id
        JOIN roles r ON u.role_id = r.role_id
        WHERE s.user_id = $1
      `;
      const result = await pool.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error finding staff: ${error.message}`);
    }
  }

  /**
   * Get all staff members
   */
  static async getAll(filters = {}, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const whereConditions = [];
      const values = [];
      let paramCount = 1;

      // Build filter conditions
      if (filters.department) {
        whereConditions.push(`s.department = $${paramCount}`);
        values.push(filters.department);
        paramCount++;
      }

      if (filters.position) {
        whereConditions.push(`s.position = $${paramCount}`);
        values.push(filters.position);
        paramCount++;
      }

      if (filters.is_active !== undefined) {
        whereConditions.push(`s.is_active = $${paramCount}`);
        values.push(filters.is_active);
        paramCount++;
      }

      // Build WHERE clause
      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      // Count query
      const countQuery = `
        SELECT COUNT(*) 
        FROM staff s
        ${whereClause}
      `;

      // Data query
      const dataQuery = `
        SELECT 
          s.*,
          u.email as user_email,
          r.role_name
        FROM staff s
        JOIN users u ON s.user_id = u.user_id
        JOIN roles r ON u.role_id = r.role_id
        ${whereClause}
        ORDER BY s.staff_id DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

      // Add pagination parameters
      values.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, values.slice(0, whereConditions.length)),
        pool.query(dataQuery, values)
      ]);

      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      return {
        staff: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Database error getting staff: ${error.message}`);
    }
  }

  /**
   * Update staff information
   */
  static async update(staffId, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(staffId);

      const query = `
        UPDATE staff 
        SET ${fields.join(', ')}
        WHERE staff_id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Database error updating staff: ${error.message}`);
    }
  }

  /**
   * Deactivate staff member
   */
  static async deactivate(staffId) {
    try {
      const query = `
        UPDATE staff 
        SET is_active = false
        WHERE staff_id = $1
        RETURNING *
      `;
      const result = await pool.query(query, [staffId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Database error deactivating staff: ${error.message}`);
    }
  }

  /**
   * Get department statistics
   */
  static async getDepartmentStats() {
    try {
      const query = `
        SELECT 
          COALESCE(department, 'Unassigned') as department,
          COUNT(*) as staff_count,
          SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_count,
          STRING_AGG(position, ', ') as positions
        FROM staff
        GROUP BY department
        ORDER BY staff_count DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Database error getting department stats: ${error.message}`);
    }
  }

  /**
   * Search staff by name or email
   */
  static async search(searchTerm) {
    try {
      const query = `
        SELECT 
          s.*,
          u.email as user_email,
          r.role_name
        FROM staff s
        JOIN users u ON s.user_id = u.user_id
        JOIN roles r ON u.role_id = r.role_id
        WHERE s.first_name ILIKE $1 
          OR s.last_name ILIKE $1 
          OR s.email ILIKE $1 
          OR u.email ILIKE $1
        ORDER BY s.staff_id DESC
        LIMIT 50
      `;
      const result = await pool.query(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      throw new Error(`Database error searching staff: ${error.message}`);
    }
  }
}

export default Staff;
