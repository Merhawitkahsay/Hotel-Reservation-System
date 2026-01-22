/**
 * apiEndpoints.js - Complete API endpoints configuration
 * * Use in frontend:
 * import { API_ENDPOINTS } from './apiEndpoints';
 * * const url = API_ENDPOINTS.guests.getAll();
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ROOT_URL = BASE_URL.replace(/\/api\/?$/, '');

export const API_ENDPOINTS = {
  //  AUTH 
  auth: {
    register: () => `${BASE_URL}/auth/register`,
    login: () => `${BASE_URL}/auth/login`,
    me: () => `${BASE_URL}/auth/me`,
    refresh: () => `${BASE_URL}/auth/refresh`,
    logout: () => `${BASE_URL}/auth/logout`,
    changePassword: () => `${BASE_URL}/auth/change-password`,
  },

  // GUESTS
  guests: {
    getAll: (page = 1, limit = 20, filters = {}) => {
      const params = new URLSearchParams({ page, limit, ...filters });
      return `${BASE_URL}/guests?${params.toString()}`;
    },
    getById: (id) => `${BASE_URL}/guests/${encodeURIComponent(id)}`,
    create: () => `${BASE_URL}/guests`,
    update: (id) => `${BASE_URL}/guests/${encodeURIComponent(id)}`,
    delete: (id) => `${BASE_URL}/guests/${encodeURIComponent(id)}`,
    search: (query) => `${BASE_URL}/guests/search?query=${encodeURIComponent(query)}`,
    stats: () => `${BASE_URL}/guests/stats`,
  },

  //  ROOMS 
  rooms: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return `${BASE_URL}/rooms?${params.toString()}`;
    },
    getById: (id) => `${BASE_URL}/rooms/${encodeURIComponent(id)}`,
    create: () => `${BASE_URL}/rooms`,
    update: (id) => `${BASE_URL}/rooms/${encodeURIComponent(id)}`,
    getAvailable: (startDate, endDate, roomTypeId) => {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      if (roomTypeId) params.append('room_type_id', roomTypeId);
      return `${BASE_URL}/rooms/available?${params.toString()}`;
    },
    getTypes: () => `${BASE_URL}/rooms/types`,
    createType: () => `${BASE_URL}/rooms/types`,
    getOccupancy: (startDate, endDate) =>
      `${BASE_URL}/rooms/occupancy?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`,
  },

  // RESERVATIONS 
  reservations: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return `${BASE_URL}/reservations?${params.toString()}`;
    },
    getById: (id) => `${BASE_URL}/reservations/${encodeURIComponent(id)}`,
    create: () => `${BASE_URL}/reservations`,
    update: (id) => `${BASE_URL}/reservations/${encodeURIComponent(id)}`,
    cancel: (id) => `${BASE_URL}/reservations/${encodeURIComponent(id)}/cancel`,
    checkIn: (id) => `${BASE_URL}/reservations/${encodeURIComponent(id)}/check-in`,
    checkOut: (id) => `${BASE_URL}/reservations/${encodeURIComponent(id)}/check-out`,
    getGuestReservations: (guestId) =>
      `${BASE_URL}/reservations/guest/${encodeURIComponent(guestId)}`,
    calculatePrice: () => `${BASE_URL}/reservations/calculate-price`,
  },

  //  PAYMENTS 
  payments: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return `${BASE_URL}/payments?${params.toString()}`;
    },
    getById: (id) => `${BASE_URL}/payments/${encodeURIComponent(id)}`,
    create: () => `${BASE_URL}/payments`,
    process: (id) => `${BASE_URL}/payments/${encodeURIComponent(id)}/process`,
    refund: (id) => `${BASE_URL}/payments/${encodeURIComponent(id)}/refund`,
    getFinancialReport: (startDate, endDate) =>
      `${BASE_URL}/payments/financial-report?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`,
    getReservationPayments: (reservationId) =>
      `${BASE_URL}/payments/reservation/${encodeURIComponent(reservationId)}`,
  },

  //  REPORTS 
  reports: {
    daily: (date) => `${BASE_URL}/reports/daily?date=${encodeURIComponent(date)}`,
    weekly: (startDate) => `${BASE_URL}/reports/weekly?start_date=${encodeURIComponent(startDate)}`,
    monthly: (year, month) =>
      `${BASE_URL}/reports/monthly?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`,
    custom: (startDate, endDate, reportType) => {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        report_type: reportType,
      });
      return `${BASE_URL}/reports/custom?${params.toString()}`;
    },
  },

  // SYSTEM
  system: {
    health: () => `${BASE_URL}/health`,
    metrics: () => `${BASE_URL}/metrics`,
  },

  // DOCS 
  docs: {
    swaggerUI: () => `${ROOT_URL}/api-docs`,
    openAPI: () => `${ROOT_URL}/api-docs.json`,
  },
};

export default API_ENDPOINTS;
