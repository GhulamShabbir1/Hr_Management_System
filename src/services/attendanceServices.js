// src/services/attendanceServices.js
import api from './api';

export default {
  async checkIn(userId, location) {
    const response = await api.post('/attendance/check-in', { userId, location });
    return response.data;
  },

  async checkOut(userId) {
    const response = await api.post('/attendance/check-out', { userId });
    return response.data;
  },

  async list(params = {}) {
    const response = await api.get('/attendances', { params });
    return response.data;
  }
};
