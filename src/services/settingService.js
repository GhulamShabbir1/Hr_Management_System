import api from './apiService';

export default {
  async getSystemSettings() {
    const response = await api.get('/settings/system');
    return response.data;
  },

  async updateSystemSettings(settings) {
    const response = await api.put('/settings/system', settings);
    return response.data;
  },

  async getUserPreferences() {
    const response = await api.get('/settings/preferences');
    return response.data;
  },

  async updateUserPreferences(preferences) {
    const response = await api.put('/settings/preferences', preferences);
    return response.data;
  }
};