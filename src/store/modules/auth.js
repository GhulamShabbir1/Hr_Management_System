import api from '../../services/api';

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
        
        if (!response.data) {
          throw new Error("No data received from server");
        }

        const authData = {
          token: response.data.token || response.data.data?.token,
          refreshToken: response.data.refreshToken || null,
          user: response.data.user || response.data.data?.user,
          expiresIn: response.data.expiresIn || 3600
        };

        if (!authData.token || !authData.user) {
          throw new Error("Invalid authentication data received");
        }

        commit('SET_AUTH_DATA', authData);
        return { success: true, user: authData.user };
      } catch (error) {
        console.error('Login failed:', error);
        const message = error.response?.data?.message || 
                       error.message || 
                       'Login failed';
        return { success: false, message };
      }
    },

    async register({ commit }, userData) {
      try {
        const response = await api.post('/register', userData);
        
        if (!response.data) {
          throw new Error("No data received from server");
        }

        // Optionally login user after registration
        if (response.data.token) {
          commit('SET_AUTH_DATA', {
            token: response.data.token,
            refreshToken: response.data.refreshToken || null,
            user: response.data.user,
            expiresIn: response.data.expiresIn || 3600
          });
        }

        return { 
          success: true, 
          user: response.data.user,
          token: response.data.token
        };
      } catch (error) {
        console.error('Registration failed:', error);
        let message = 'Registration failed';
        
        if (error.response) {
          if (error.response.status === 409) {
            message = 'Email already registered';
          } else if (error.response.data?.message) {
            message = error.response.data.message;
          }
        } else {
          message = error.message || message;
        }
        
        return { success: false, message };
      }
    },

    logout({ commit }) {
      commit('LOGOUT');
    },

    initializeAuth({ commit }) {
      // This can be used to check existing auth state if needed
      // Currently just ensures clean state
      commit('LOGOUT');
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    userRole: state => state.user?.role || null,
    userData: state => state.user || {}
  }
};