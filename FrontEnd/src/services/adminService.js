import api from './api';

/**
 * adminService.js
 * Handles staff management and system auditing.
 * Requires 'admin' role permissions.
 */

// Staff Management
export const getAllStaff = async () => {
  // Fetches from the staff table joined with users
  const response = await api.get('/admin/staff');
  return response.data;
};

export const createStaffMember = async (staffData) => {
  // Creates a user and a staff record
  const response = await api.post('/admin/staff', staffData);
  return response.data;
};

export const updateStaffStatus = async (staffId, isActive) => {
  const response = await api.put(`/admin/staff/${staffId}`, { is_active: isActive });
  return response.data;
};

//  System Audit Logs 
export const getAuditLogs = async (params = {}) => {
  /** * Maps to the audit_logs table.
   * Useful for tracking 'INSERT', 'UPDATE', 'DELETE' actions.
   */
  const response = await api.get('/admin/audit-logs', { params });
  return response.data;
};

// Role Management 
export const getRoles = async () => {
  // Fetches from the roles table (admin, receptionist, guest)
  const response = await api.get('/admin/roles');
  return response.data;
};

export default { 
  getAllStaff, 
  createStaffMember, 
  updateStaffStatus, 
  getAuditLogs, 
  getRoles 
};