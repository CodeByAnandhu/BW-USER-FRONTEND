import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

if (typeof window !== 'undefined') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  resetPasswordRequest: (email) => api.post('/auth/reset-password-request', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
};

export const images = {
  upload: (formData) => api.post('/images', formData),
  getAll: () => api.get('/images'),
  reorder: (imageOrders) => api.patch('/images/reorder', { imageOrders }),
  update: (imageId, formData) => api.patch(`/images/${imageId}`, formData),
  delete: (imageId) => api.delete(`/images/${imageId}`)
};

export default api;