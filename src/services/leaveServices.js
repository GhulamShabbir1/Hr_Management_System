import api from './api';

export default {
  async requestLeave(leaveData) {
    const response = await api.post('/leave/requests', leaveData);
    return response.data;
  },

  async getLeaveRequests({ status, userId, page = 1, limit = 10 }) {
    const params = { status, userId, page, limit };
    const response = await api.get('/leave/requests', { params });
    return response.data;
  },

  async approveLeave(requestId, approverId) {
    const response = await api.put(`/leave/requests/${requestId}/approve`, { approverId });
    return response.data;
  },

  async rejectLeave(requestId, reason) {
    const response = await api.put(`/leave/requests/${requestId}/reject`, { reason });
    return response.data;
  },

  async getLeaveBalance(userId) {
    const response = await api.get(`/leave/balance/${userId}`);
    return response.data;
  },

  async getLeaveTypes() {
    const response = await api.get('/leave/types');
    return response.data;
  }
};