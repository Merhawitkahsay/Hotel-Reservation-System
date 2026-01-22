import axios from 'axios';

// 1. Create the base instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Automatically inject JWT token into headers for every request
// This fixes the 401 Unauthorized errors
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Global error handler (auto-logout on expired token)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Details:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

// 4. Full API Object Wrapper
const api = {
  // AUTHENTICATION
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  
  // ROOMS
  getRooms: (params) => axiosInstance.get('/rooms', { params }),
  getRoomById: (id) => axiosInstance.get(`/rooms/${id}`),
  getRoomTypes: () => axiosInstance.get('/rooms/types'),
  
  // GUESTS & WAITLIST 
  getGuestProfile: () => axiosInstance.get('/guests/profile'),
  updateGuestProfile: (id, data) => axiosInstance.put(`/guests/profile/${id}`, data),
  getSavedRooms: () => axiosInstance.get('/guests/saved-rooms'),
  //  This fixes the "TypeError: api.toggleSavedRoom is not a function"
  toggleSavedRoom: (roomId) => axiosInstance.post('/guests/toggle-save', { roomId }),
  
  // RESERVATIONS
  createReservation: (data) => axiosInstance.post('/reservations', data),
  getMyBookings: () => axiosInstance.get('/reservations/my-bookings'),
  cancelReservation: (id) => axiosInstance.put(`/reservations/cancel/${id}`),
  
  //  ADMIN 
  getAdminStats: () => axiosInstance.get('/admin/stats'),
  getAllGuests: (params) => axiosInstance.get('/guests', { params }),
  
  // GENERIC HELPERS 
  get: (url, config) => axiosInstance.get(url, config),
  post: (url, data, config) => axiosInstance.post(url, data, config),
  put: (url, data, config) => axiosInstance.put(url, data, config),
  delete: (url, config) => axiosInstance.delete(url, config),
};

export default api;