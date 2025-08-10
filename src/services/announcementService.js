import api from './api';

export default {
  async getAnnouncements({ page = 1, limit = 10 }) {
    const response = await api.get('/announcements', {
      params: { page, limit }
    });
    return response.data;
  },

  async createAnnouncement(announcementData) {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  },

  async markAsRead(announcementId) {
    const response = await api.put(`/announcements/${announcementId}/read`);
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/announcements/unread-count');
    return response.data;
  },

  async deleteAnnouncement(id) {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  }
};