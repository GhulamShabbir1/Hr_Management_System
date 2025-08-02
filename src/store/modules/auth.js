// src/store/modules/auth.js
const state = {
  user: null,
  token: null
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  userRole: (state) => (state.user ? state.user.role : null),
  user: (state) => state.user,
  userData: (state) => state.user
};

const mutations = {
  SET_USER(state, payload) {
    state.user = payload;
  },
  SET_TOKEN(state, payload) {
    state.token = payload;
  },
  LOGOUT(state) {
    state.user = null;
    state.token = null;
  }
};

const actions = {
  async login({ commit }, { email, password }) {
    try {
      // Simulate API call - replace with actual API endpoint
      // For demo purposes, accept any email/password combination
      if (email && password) {
        const mockUser = {
          id: 1,
          email: email,
          name: email.split('@')[0],
          role: email.includes('admin') ? 'Admin' : email.includes('hr') ? 'HR' : 'Employee'
        };
        const mockToken = 'demo-token-' + Date.now();
        
        commit("SET_USER", mockUser);
        commit("SET_TOKEN", mockToken);
        
        return { success: true };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  },
  logout({ commit }) {
    commit("LOGOUT");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
