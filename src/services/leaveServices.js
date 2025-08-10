import api from './api';

export default {
  async requestLeave(leaveData) {
    const res = await api.post('/leave/request', leaveData);
    return res.data;
  },
  async getMyLeaves() {
    const res = await api.get('/leave/my');
    return res.data;
  },
  async getPendingLeaves() {
    const res = await api.get('/leave/pending');
    return res.data;
  },
  async listAllLeaves() {
    const res = await api.get('/list-leaves');
    return res.data;
  },
  async updateStatus(id, status) {
    const res = await api.put(`/leave/status/${id}`, { status });
    return res.data;
  },
  async deleteRequest(id) {
    const res = await api.post(`/delete-leave-request/${id}`);
    return res.data;
  }
};