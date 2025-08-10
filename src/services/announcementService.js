import api from './api';

export default {
  async getAnnouncements({ page = 1, limit = 10 } = {}) {
    const res = await api.get('/announcements', { params: { page, limit } });
    return res.data;
  },

  async createAnnouncement(announcementData) {
    const res = await api.post('/announcements', announcementData);
    return res.data;
  }
};