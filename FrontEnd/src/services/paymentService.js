import api from './api';

/**
 * paymentService.js
 * Interfaces with the PaymentController on the backend.
 * All methods require authentication. Access roles vary by endpoint.
 */

/**
 * Fetches all payments with optional filtering (status, method, date).
 * Access: Private (admin, receptionist)
 */
export const getAllPayments = async (filters = {}) => {
  try {
    const response = await api.get('/payments', { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching all payments:", error);
    throw error;
  }
};

/**
 * Fetches payment summary for a specific reservation.
 * Access: Private (admin, receptionist)
 */
export const getReservationPayments = async (reservationId) => {
  try {
    const response = await api.get(`/payments/reservation/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payments for reservation ${reservationId}:`, error);
    throw error;
  }
};

/**
 * Fetches the financial report for accounting.
 * Access: Private (admin, receptionist)
 */
export const getFinancialReport = async (startDate, endDate) => {
  try {
    const response = await api.get('/payments/financial-report', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching financial report:", error);
    throw error;
  }
};

/**
 * Fetches a single payment record by ID.
 * Access: Private (admin, receptionist)
 */
export const getPaymentById = async (id) => {
  try {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new payment record (initializes as 'pending').
 * Access: Private (admin, receptionist)
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

/**
 * Processes a payment, marking it as 'completed'.
 * Access: Private (admin, receptionist)
 */
export const processPayment = async (id) => {
  try {
    const response = await api.put(`/payments/${id}/process`);
    return response.data;
  } catch (error) {
    console.error(`Error processing payment ${id}:`, error);
    throw error;
  }
};

/**
 * Processes a refund for a specific payment.
 * Access: Private (Admin Only)
 */
export const processRefund = async (id, refundData) => {
  try {
    // refundData usually contains { refund_amount, refund_reason }
    const response = await api.put(`/payments/${id}/refund`, refundData);
    return response.data;
  } catch (error) {
    console.error(`Error processing refund for payment ${id}:`, error);
    throw error;
  }
};

export default {
  getAllPayments,
  getReservationPayments,
  getFinancialReport,
  getPaymentById,
  createPayment,
  processPayment,
  processRefund
};