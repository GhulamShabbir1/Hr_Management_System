// src/store/modules/auth.js
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
        const mockUsers = {
          'admin@example.com': { 
            password: 'admin123', 
            role: 'Admin', 
            name: 'Admin User',
            permissions: ['all']
          },
          'hr@example.com': { 
            password: 'hr123', 
            role: 'HR', 
            name: 'HR Manager',
            permissions: ['employees', 'attendance']
          }
        };
        
        const user = mockUsers[credentials.email];
        if (!user || user.password !== credentials.password) {
          return { success: false, message: 'Invalid email or password' };
        }

        const authData = {
          user: {
            email: credentials.email,
            role: user.role,
            name: user.name,
            permissions: user.permissions
          },
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 3600
        };
        
        commit('SET_AUTH_DATA', authData);
        localStorage.setItem('auth', JSON.stringify({
          token: authData.token,
          refreshToken: authData.refreshToken,
          user: authData.user,
          expiry: Date.now() + (authData.expiresIn * 1000)
        }));

        return { success: true, user: authData.user };
      } catch (error) {
        console.error('Login failed:', error);
        return { success: false, message: 'An unexpected error occurred. Please try again.' };
      }
    },

    logout({ commit }) {
      localStorage.removeItem('auth');
      commit('LOGOUT');
    },

    initializeAuth({ commit }) {
      try {
        const authData = JSON.parse(localStorage.getItem('auth'));
        if (authData && authData.expiry > Date.now()) {
          commit('SET_AUTH_DATA', {
            user: authData.user,
            token: authData.token,
            refreshToken: authData.refreshToken,
            expiresIn: Math.floor((authData.expiry - Date.now()) / 1000)
          });
        } else {
          localStorage.removeItem('auth');
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('auth');
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    userRole: state => state.user?.role || null,
    userData: state => state.user || {}   // <-- Added to fix the error
  }
};
