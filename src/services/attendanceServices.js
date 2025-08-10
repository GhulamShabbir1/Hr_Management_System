// src/service/attendanceApi.js

import api from './api'; // Ensure ./api is correctly pointing to your Axios instance

export default {
  // ✅ Check-in API call
  async checkIn(userId, location) {
    try {
      const response = await api.post('/attendance/check-in', { userId, location });
      return response.data;
    } catch (error) {
      console.error("Check-in failed:", error);
      throw error;
    }
  },

  // ✅ Check-out API call
  async checkOut(userId) {
    try {
      const response = await api.post('/attendance/check-out', { userId });
      return response.data;
    } catch (error) {
      console.error("Check-out failed:", error);
      throw error;
    }
  },

  // ✅ Get attendance logs (with optional filters)
  async getAttendanceLogs({ userId, startDate, endDate, page = 1, limit = 10 }) {
    try {
      const params = { userId, startDate, endDate, page, limit };
      const response = await api.get('/attendance/logs', { params });
      return response.data;
    } catch (error) {
      console.error("Fetching logs failed:", error);
      throw error;
    }
  },

  // ✅ Get monthly report for a specific user
  async getMonthlyReport(userId, year, month) {
    try {
      const response = await api.get(`/attendance/reports/${userId}/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error("Fetching monthly report failed:", error);
      throw error;
    }
  },

  // ✅ Export attendance report (returns blob)
  async exportReport(params) {
    try {
      const response = await api.get('/attendance/export', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error("Exporting report failed:", error);
      throw error;
    }
  }
};
