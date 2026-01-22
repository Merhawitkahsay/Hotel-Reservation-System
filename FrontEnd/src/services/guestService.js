import api from './api';

/**
 * guestService.js
 * * Interfaces with the GuestController on the backend.
 * All methods require 'admin' or 'receptionist' roles as per guestRoutes.js.
 */

/**
 * Fetches all guests with optional pagination.
 * @param {number} page - Current page number.
 * @param {number} limit - Items per page.
 * @returns {Promise<Array>} List of guest profiles.
 */
export const getAllGuests = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/guests', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching guest list:", error);
    throw error;
  }
};

/**
 * Searches for guests based on a query string.
 * Maps to GET /api/guests/search.
 * @param {string} searchTerm - Name, email, or phone.
 * @returns {Promise<Array>} Filtered guest list.
 */
export const searchGuests = async (searchTerm) => {
  try {
    const response = await api.get('/guests/search', {
      params: { query: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching guests:", error);
    throw error;
  }
};

/**
 * Fetches a single guest profile by ID.
 * @param {number|string} id - The guest_id.
 * @returns {Promise<Object>} The guest record.
 */
export const getGuestById = async (id) => {
  try {
    const response = await api.get(`/guests/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching guest ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new guest record in the database.
 * Backend validates this via guestCreateValidation middleware.
 * @param {Object} guestData - { first_name, last_name, email, phone, address, id_type, id_number, date_of_birth, nationality, guest_type }
 * @returns {Promise<Object>} The newly created guest record.
 */
export const createGuest = async (guestData) => {
  try {
    const response = await api.post('/guests', guestData);
    return response.data;
  } catch (error) {
    console.error("Error creating guest:", error);
    throw error;
  }
};

/**
 * Updates an existing guest profile.
 * Backend validates this via guestUpdateValidation middleware.
 * @param {number|string} id - The guest_id.
 * @param {Object} updateData - Partial or full guest data.
 * @returns {Promise<Object>} The updated guest record.
 */
export const updateGuest = async (id, updateData) => {
  try {
    const response = await api.put(`/guests/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating guest ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a guest record.
 * Access: Private (Admin only) as per guestRoutes.js.
 * @param {number|string} id - The guest_id.
 */
export const deleteGuest = async (id) => {
  try {
    const response = await api.delete(`/guests/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting guest ${id}:`, error);
    throw error;
  }
};

export default {
  getAllGuests,
  searchGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest
};