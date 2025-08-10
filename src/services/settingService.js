import api from './api';

export default {
  // Get all settings
  async getSettings() {
    try {
      const response = await api.get('/settings');
      return response;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Update a single setting
  async updateSetting(key, value) {
    try {
      const response = await api.put(`/settings/${key}`, { value });
      return response;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  },

  // Update multiple settings
  async updateSettings(settings) {
    try {
      const response = await api.put('/settings', settings);
      return response;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Reset settings to defaults
  async resetSettings() {
    try {
      const response = await api.post('/settings/reset');
      return response;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  },

  // Get system settings
  async getSystemSettings() {
    try {
      const response = await api.get('/settings/system');
      return response;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  },

  // Update system settings
  async updateSystemSettings(settings) {
    try {
      const response = await api.put('/settings/system', settings);
      return response;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  },

  // Get user preferences
  async getUserPreferences() {
    try {
      const response = await api.get('/settings/preferences');
      return response;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  },

  // Update user preferences
  async updateUserPreferences(preferences) {
    try {
      const response = await api.put('/settings/preferences', preferences);
      return response;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
};