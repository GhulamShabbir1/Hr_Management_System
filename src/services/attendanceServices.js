import api from './api';

export default {
  async checkIn(userId, location) {
    const res = await api.post('/attendance/check-in', { userId, location });
    return res.data;
  },
  async checkOut(userId) {
    const res = await api.post('/attendance/check-out', { userId });
    return res.data;
  },
  async getAttendanceLogs({ userId, startDate, endDate, page = 1, limit = 10 }) {
    const params = { userId, startDate, endDate, page, limit };
    const res = await api.get('/attendances', { params });
    return res.data;
  }
};