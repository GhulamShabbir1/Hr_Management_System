// src/store/modules/settings.js
import settingService from '@/services/settingService';

export default {
  namespaced: true,
  state: {
    settings: {},
    loading: false,
    error: null,
    categories: {
      general: {
        name: 'General Settings',
        icon: 'fas fa-cog',
        settings: ['company_name', 'company_logo', 'timezone', 'date_format']
      },
      notifications: {
        name: 'Notification Settings',
        icon: 'fas fa-bell',
        settings: ['email_notifications', 'push_notifications', 'notification_sound']
      },
      security: {
        name: 'Security Settings',
        icon: 'fas fa-shield-alt',
        settings: ['password_policy', 'session_timeout', 'two_factor_auth']
      },
      appearance: {
        name: 'Appearance Settings',
        icon: 'fas fa-palette',
        settings: ['theme', 'language', 'sidebar_collapsed']
      }
    }
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SETTINGS(state, settings) {
      state.settings = settings;
    },
    UPDATE_SETTING(state, { key, value }) {
      state.settings = { ...state.settings, [key]: value };
    },
    UPDATE_SETTINGS(state, settings) {
      state.settings = { ...state.settings, ...settings };
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },
  actions: {
    async fetchSettings({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await settingService.getSettings();
        commit('SET_SETTINGS', response.data);
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch settings');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateSetting({ commit }, { key, value }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await settingService.updateSetting(key, value);
        commit('UPDATE_SETTING', { key, value });
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to update setting');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateSettings({ commit }, settings) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await settingService.updateSettings(settings);
        commit('UPDATE_SETTINGS', settings);
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to update settings');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async resetSettings({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await settingService.resetSettings();
        commit('SET_SETTINGS', response.data);
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to reset settings');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  getters: {
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error,
    allSettings: state => state.settings,
    categories: state => state.categories,
    getSetting: state => key => state.settings[key],
    getSettingsByCategory: state => category => {
      const categorySettings = state.categories[category]?.settings || [];
      return categorySettings.reduce((acc, setting) => {
        acc[setting] = state.settings[setting];
        return acc;
      }, {});
    },
    getCompanyInfo: state => ({
      name: state.settings.company_name || 'HR Management System',
      logo: state.settings.company_logo,
      timezone: state.settings.timezone || 'UTC',
      dateFormat: state.settings.date_format || 'MM/DD/YYYY'
    }),
    getNotificationSettings: state => ({
      email: state.settings.email_notifications || false,
      push: state.settings.push_notifications || false,
      sound: state.settings.notification_sound || false
    }),
    getSecuritySettings: state => ({
      passwordPolicy: state.settings.password_policy || 'medium',
      sessionTimeout: state.settings.session_timeout || 30,
      twoFactorAuth: state.settings.two_factor_auth || false
    }),
    getAppearanceSettings: state => ({
      theme: state.settings.theme || 'light',
      language: state.settings.language || 'en',
      sidebarCollapsed: state.settings.sidebar_collapsed || false
    })
  }
}; 