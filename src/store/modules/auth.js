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
      // Demo authentication
      const users = {
        'admin@example.com': { password: 'admin123', role: 'Admin', name: 'Admin User' },
        'hr@example.com': { password: 'hr123', role: 'HR', name: 'HR Manager' },
        'user@example.com': { password: 'user123', role: 'Employee', name: 'John Doe' }
      };
      
      const user = users[email];
      if (user && user.password === password) {
        const fakeToken = 'fake-jwt-token-' + Date.now();
        const userData = { email, role: user.role, name: user.name };
        
        localStorage.setItem('auth_token', fakeToken);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        commit("SET_USER", userData);
        commit("SET_TOKEN", fakeToken);
        
        return { success: true };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  
  logout({ commit }) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    commit("LOGOUT");
  },
  
  initializeAuth({ commit }) {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      commit("SET_TOKEN", token);
      commit("SET_USER", JSON.parse(userData));
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
