import api from './apiService';

export default {
  async submitReview(reviewData) {
    const response = await api.post('/performance/reviews', reviewData);
    return response.data;
  },

  async getEmployeeReviews(employeeId) {
    const response = await api.get(`/performance/reviews/employee/${employeeId}`);
    return response.data;
  },

  async getPendingReviews(reviewerId) {
    const response = await api.get(`/performance/reviews/pending/${reviewerId}`);
    return response.data;
  },

  async getReviewTemplates() {
    const response = await api.get('/performance/templates');
    return response.data;
  },

  async getKPIs(employeeId) {
    const response = await api.get(`/performance/kpis/${employeeId}`);
    return response.data;
  }
};