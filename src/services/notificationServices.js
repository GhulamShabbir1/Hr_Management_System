import api from './api';

export default {
  async getNotifications({ page = 1, limit = 10 }) {
    const response = await api.get('/notifications', {
      params: { page, limit }
    });
    return response.data;
  },

  async markAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  }
};