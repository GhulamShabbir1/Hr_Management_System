import api from './api';

export default {
  async createReview(payload) {
    const res = await api.post('/create-performance-review', payload);
    return res.data;
  },
  async updateReview(id, payload) {
    const res = await api.put(`/update-performance-review/${id}`, payload);
    return res.data;
  },
  async deleteReview(id) {
    const res = await api.post(`/delete-performance-review/${id}`);
    return res.data;
  },
  async showReview(id) {
    const res = await api.get(`/show-performance-review/${id}`);
    return res.data;
  },
  async listReviews() {
    const res = await api.get('/list-performance-review');
    return res.data;
  }
};