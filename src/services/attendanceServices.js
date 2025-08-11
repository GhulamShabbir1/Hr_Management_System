import api from './api';

export default {
  /**
   * Record employee check-in
   * @param {string} employeeId - Employee ID
   * @param {object} location - Geo location data
   * @param {number} location.latitude - Latitude coordinate
   * @param {number} location.longitude - Longitude coordinate
   * @returns {Promise<object>} Response data
   */
  async checkIn(employeeId, location) {
    try {
      const payload = {
        employeeId,
        latitude: location?.latitude,
        longitude: location?.longitude,
        timestamp: new Date().toISOString()
      };
      
      const response = await api.post('/attendance/check-in', payload);
      
      if (!response.data) {
        throw new Error('Invalid response structure');
      }
      
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Check-in failed:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message || 'Check-in failed'
      };
    }
  },

  /**
   * Record employee check-out
   * @param {string} employeeId - Employee ID
   * @returns {Promise<object>} Response data
   */
  async checkOut(employeeId) {
    try {
      const payload = {
        employeeId,
        timestamp: new Date().toISOString()
      };
      
      const response = await api.post('/attendance/check-out', payload);
      
      if (!response.data) {
        throw new Error('Invalid response structure');
      }
      
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Check-out failed:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message || 'Check-out failed'
      };
    }
  },

  /**
   * Get attendance logs with pagination
   * @param {object} params - Query parameters
   * @param {string} params.employeeId - Employee ID to filter
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<object>} Paginated attendance data
   */
  async getAttendanceLogs({ employeeId, startDate, endDate, page = 1, limit = 10 }) {
    try {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (startDate && !dateRegex.test(startDate)) {
        throw new Error('Invalid startDate format. Use YYYY-MM-DD');
      }
      if (endDate && !dateRegex.test(endDate)) {
        throw new Error('Invalid endDate format. Use YYYY-MM-DD');
      }

      const params = { 
        employeeId, 
        startDate, 
        endDate, 
        page: Math.max(1, parseInt(page)), 
        limit: Math.min(100, Math.max(1, parseInt(limit)))
      };

      const response = await api.get('/attendances', { params });
      
      if (!response.data) {
        throw new Error('Invalid response structure');
      }

      // Normalize response structure
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      const meta = response.data.meta || {
        total: data.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(data.length / params.limit)
      };

      return {
        success: true,
        data,
        meta,
        error: null
      };
    } catch (error) {
      console.error('Failed to fetch attendance logs:', error);
      return {
        success: false,
        data: [],
        meta: null,
        error: error.response?.data?.message || error.message || 'Failed to fetch attendance logs'
      };
    }
  },

  /**
   * Get today's attendance status for an employee
   * @param {string} employeeId - Employee ID
   * @returns {Promise<object>} Today's attendance record
   */
  async getTodayAttendance(employeeId) {
    try {
      const response = await api.get(`/attendances/today/${employeeId}`);
      
      return {
        success: true,
        data: response.data || null,
        error: null
      };
    } catch (error) {
      console.error('Failed to fetch today\'s attendance:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message || 'Failed to fetch today\'s attendance'
      };
    }
  },

  /**
   * Get monthly attendance summary
   * @param {string} employeeId - Employee ID
   * @param {string} month - Month in YYYY-MM format
   * @returns {Promise<object>} Monthly summary data
   */
  async getMonthlySummary(employeeId, month) {
    try {
      const response = await api.get(`/attendances/summary/${employeeId}`, {
        params: { month }
      });
      
      return {
        success: true,
        data: response.data || {},
        error: null
      };
    } catch (error) {
      console.error('Failed to fetch monthly summary:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message || 'Failed to fetch monthly summary'
      };
    }
  }
};