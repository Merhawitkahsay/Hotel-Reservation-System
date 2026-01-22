import api from './api';

/**
 * reservationService.js
 * * Interfaces with the ReservationController.
 * All methods require authentication. Access roles vary by endpoint.
 */

/**
 * Fetches all reservations with optional filters.
 * Access: admin, receptionist
 */
export const getAllReservations = async (filters = {}) => {
  try {
    const response = await api.get('/reservations', { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    throw error;
  }
};

/**
 * Fetches reservations for a specific guest.
 * Access: admin, receptionist, guest (own reservations)
 */
export const getGuestReservations = async (guestId) => {
  try {
    const response = await api.get(`/reservations/guest/${guestId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reservations for guest ${guestId}:`, error);
    throw error;
  }
};

/**
 * Fetches a single reservation by ID.
 * Access: admin, receptionist, guest (own reservation)
 */
export const getReservationById = async (id) => {
  try {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reservation ${id}:`, error);
    throw error;
  }
};

/**
 * Calculates the total price for a potential reservation.
 * @param {Object} data - { room_id, check_in_date, check_out_date, number_of_guests }
 */
export const calculatePrice = async (data) => {
  try {
    const response = await api.post('/reservations/calculate-price', data);
    return response.data;
  } catch (error) {
    console.error("Error calculating reservation price:", error);
    throw error;
  }
};

/**
 * Creates a new reservation.
 * Maps to POST /api/reservations.
 */
export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

/**
 * Updates an existing reservation.
 * Access: admin, receptionist
 */
export const updateReservation = async (id, updateData) => {
  try {
    const response = await api.put(`/reservations/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating reservation ${id}:`, error);
    throw error;
  }
};

/**
 * Cancels a reservation.
 * Access: admin, receptionist, guest (own reservation)
 */
export const cancelReservation = async (id, reason) => {
  try {
    const response = await api.put(`/reservations/${id}/cancel`, { cancellation_reason: reason });
    return response.data;
  } catch (error) {
    console.error(`Error cancelling reservation ${id}:`, error);
    throw error;
  }
};

/**
 * Processes a guest check-in.
 * Access: admin, receptionist
 */
export const checkInGuest = async (id) => {
  try {
    const response = await api.put(`/reservations/${id}/check-in`);
    return response.data;
  } catch (error) {
    console.error(`Error checking in reservation ${id}:`, error);
    throw error;
  }
};

/**
 * Processes a guest check-out.
 * Access: admin, receptionist
 */
export const checkOutGuest = async (id) => {
  try {
    const response = await api.put(`/reservations/${id}/check-out`);
    return response.data;
  } catch (error) {
    console.error(`Error checking out reservation ${id}:`, error);
    throw error;
  }
};

export default {
  getAllReservations,
  getGuestReservations,
  getReservationById,
  calculatePrice,
  createReservation,
  updateReservation,
  cancelReservation,
  checkInGuest,
  checkOutGuest
};