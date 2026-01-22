import api from './api';

/**
 * reportService.js
 * * Interfaces with the backend ReportController to fetch hotel analytics.
 * Requires 'view_reports' permission.
 */

/**
 * Fetches the daily performance report.
 * @returns {Promise<Object>} Object containing today's revenue, check-ins, and occupancy.
 */
export const getDailyReport = async () => {
  try {
    const response = await api.get('/reports/daily');
    return response.data;
  } catch (error) {
    console.error('Error fetching daily report:', error);
    throw error;
  }
};

/**
 * Fetches the weekly performance trends.
 * @returns {Promise<Array>} List of stats for the last 7 days.
 */
export const getWeeklyReport = async () => {
  try {
    const response = await api.get('/reports/weekly');
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly report:', error);
    throw error;
  }
};

/**
 * Fetches the monthly financial and occupancy summary.
 * @returns {Promise<Object>} Month-to-date performance metrics.
 */
export const getMonthlyReport = async () => {
  try {
    const response = await api.get('/reports/monthly');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    throw error;
  }
};

/**
 * Fetches a report based on a custom date range.
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {Promise<Object>}
 */
export const getCustomReport = async (startDate, endDate) => {
  try {
    const response = await api.get('/reports/custom', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching custom report:', error);
    throw error;
  }
};

/**
 * Specifically fetches current occupancy data for dashboard charts.
 * Leverages the vw_daily_occupancy view logic from the backend.
 */
export const getOccupancyStats = async () => {
  try {
    const response = await api.get('/rooms/occupancy');
    return response.data;
  } catch (error) {
    console.error('Error fetching occupancy stats:', error);
    throw error;
  }
};

export default {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getCustomReport,
  getOccupancyStats
};