import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  checkStatus: () => api.get('/auth/status'),
  logout: () => api.get('/auth/logout'),
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  createProfile: (data) => api.post('/profile', data),
  updateProfile: (data) => api.put('/profile', data),
};

// Suggestions API
export const suggestionsAPI = {
  getSuggestions: () => api.post('/suggestions'),
  refreshCache: () => api.post('/suggestions/refresh'),
};

export default api;
