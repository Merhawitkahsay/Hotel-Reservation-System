import api from './api';

/**
 * authService.js
 * Manages user session and identity.
 */

export const login = async (email, password) => {
  try {
    // Maps to POST /api/auth/login
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const register = async (userData) => {
  // Maps to POST /api/auth/register
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  // Maps to GET /api/auth/me
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  try {
    // Maps to POST /api/auth/logout
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const changePassword = async (passwordData) => {
  // Maps to POST /api/auth/change-password
  const response = await api.post('/auth/change-password', passwordData);
  return response.data;
};

export default { login, register, getCurrentUser, logout, changePassword };