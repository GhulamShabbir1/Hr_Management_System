// src/services/performanceServices.js
import api from './api';

function toApiInput(payload = {}) {
  const uid =
    payload.user_id ??
    payload.userId ??
    payload['User ID'] ??
    null;

  const ratingRaw =
    payload.rating ??
    payload['User Rating'] ??
    null;

  const feedbackRaw =
    payload.feedback ??
    payload['User Feedback'] ??
    payload.comments ??
    '';

  return {
    user_id: uid,
    rating: ratingRaw != null ? Number(ratingRaw) : null,
    feedback: String(feedbackRaw).trim()
  };
}

export default {
  async createReview(payload) {
    const body = toApiInput(payload);
    const res = await api.post('/create-performance-review', body);
    return res.data;
  },

  async updateReview(id, payload) {
    const body = toApiInput(payload);
    const res = await api.put(`/update-performance-review/${id}`, body);
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