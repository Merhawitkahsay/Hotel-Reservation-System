import api from './api';

/**
 * roomService.js
 * Interfaces with the RoomController on the backend.
 * Handles room inventory, types, and availability.
 */

/**
 * Fetches all rooms with optional filtering.
 * Access: admin, receptionist
 */
export const getAllRooms = async (filters = {}) => {
  try {
    const response = await api.get('/rooms', { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching all rooms:", error);
    throw error;
  }
};

/**
 * Fetches available rooms for a specific date range.
 * Useful for the "Check Availability" feature.
 * Access: admin, receptionist, guest
 */
export const getAvailableRooms = async (startDate, endDate) => {
  try {
    const response = await api.get('/rooms/available', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    throw error;
  }
};

/**
 * Fetches all defined room types (Standard, Deluxe, etc.).
 * Access: admin, receptionist, guest
 */
export const getRoomTypes = async () => {
  try {
    const response = await api.get('/rooms/types');
    return response.data;
  } catch (error) {
    console.error("Error fetching room types:", error);
    throw error;
  }
};

/**
 * Fetches current occupancy rate for reports and dashboard.
 * Access: admin, receptionist
 */
export const getOccupancyRate = async (startDate, endDate) => {
  try {
    const response = await api.get('/rooms/occupancy', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching occupancy rate:", error);
    throw error;
  }
};

/**
 * Fetches a single room's details by ID.
 * Access: admin, receptionist
 */
export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching room ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new room in the inventory.
 * Access: Private (Admin only)
 */
export const createRoom = async (roomData) => {
  try {
    const response = await api.post('/rooms', roomData);
    return response.data;
  } catch (error) {
    console.error("Error creating new room:", error);
    throw error;
  }
};

/**
 * Defines a new room type (Category).
 * Access: Private (Admin only)
 */
export const createRoomType = async (typeData) => {
  try {
    const response = await api.post('/rooms/types', typeData);
    return response.data;
  } catch (error) {
    console.error("Error creating room type:", error);
    throw error;
  }
};

/**
 * Updates existing room information (Price adjustment, Status, etc.).
 * Access: admin, receptionist
 */
export const updateRoom = async (id, updateData) => {
  try {
    const response = await api.put(`/rooms/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating room ${id}:`, error);
    throw error;
  }
};

export default {
  getAllRooms,
  getAvailableRooms,
  getRoomTypes,
  getOccupancyRate,
  getRoomById,
  createRoom,
  createRoomType,
  updateRoom
};