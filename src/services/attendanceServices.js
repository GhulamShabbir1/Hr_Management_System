import api from './apiService';

export default {
  async checkIn(userId, location) {
    const response = await api.post('/attendance/check-in', { userId, location });
    return response.data;
  },

  async checkOut(userId) {
    const response = await api.post('/attendance/check-out', { userId });
    return response.data;
  },

  async getAttendanceLogs({ userId, startDate, endDate, page = 1, limit = 10 }) {
    const params = { userId, startDate, endDate, page, limit };
    const response = await api.get('/attendance/logs', { params });
    return response.data;
  },

  async getMonthlyReport(userId, year, month) {
    const response = await api.get(`/attendance/reports/${userId}/${year}/${month}`);
    return response.data;
  },

  async exportReport(params) {
    const response = await api.get('/attendance/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};