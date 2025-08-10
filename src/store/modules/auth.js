import api from '../../services/api';
import authService from '@/services/authService';

export default {
  namespaced: true,
  state: {
    token: null,
    refreshToken: null,
    user: null,
    expiresIn: null
  },
  mutations: {
    SET_AUTH_DATA(state, { token, refreshToken, user, expiresIn }) {
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = user;
      state.expiresIn = expiresIn;
    },
    LOGOUT(state) {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.expiresIn = null;
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await api.post('/login', credentials);
        const data = response.data || {};
        const token = data.token || data.data?.token;
        const user = data.user || data.data?.user;
        const expiresIn = data.expiresIn || 3600;
        if (!token || !user) throw new Error('Invalid authentication data received');

        commit('SET_AUTH_DATA', { token, refreshToken: null, user, expiresIn });
        authService.setToken(token);
        authService.setUser(user);
        return { success: true, user };
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Login failed';
        return { success: false, message };
      }
    },

    async register({ commit }, userData) {
      try {
        const response = await api.post('/register', userData);
        if (response.data?.token) {
          commit('SET_AUTH_DATA', {
            token: response.data.token,
            refreshToken: response.data.refreshToken || null,
            user: response.data.user,
            expiresIn: response.data.expiresIn || 3600
          });
          authService.setToken(response.data.token);
          authService.setUser(response.data.user);
        }
        return { success: true, user: response.data.user, token: response.data.token };
      } catch (error) {
        let message = 'Registration failed';
        if (error.response) {
          if (error.response.status === 409) message = 'Email already registered';
          else if (error.response.data?.message) message = error.response.data.message;
        } else {
          message = error.message || message;
        }
        return { success: false, message };
      }
    },

    async fetchMe({ commit }) {
      try {
        const res = await api.get('/me');
        if (res.data?.user) {
          commit('SET_AUTH_DATA', {
            token: authService.getToken(),
            refreshToken: null,
            user: res.data.user,
            expiresIn: 3600
          });
          authService.setUser(res.data.user);
        }
      } catch (_) {}
    },

    async logout({ commit }) {
      try { await api.post('/logout'); } catch (_) {}
      authService.logout();
      commit('LOGOUT');
    },

    initializeAuth({ commit, dispatch }) {
      const token = authService.getToken();
      const user = authService.getUser();
      if (token) {
        commit('SET_AUTH_DATA', { token, refreshToken: null, user, expiresIn: 3600 });
        dispatch('fetchMe');
      } else {
        commit('LOGOUT');
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    userRole: state => state.user?.role || null,
    userData: state => state.user || {}
  }
};