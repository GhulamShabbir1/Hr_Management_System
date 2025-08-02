// src/store/modules/auth.js
const state = {
  user: null,
  token: null
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  userRole: (state) => (state.user ? state.user.role : null),
  user: (state) => state.user
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
  login({ commit }, { user, token }) {
    commit("SET_USER", user);
    commit("SET_TOKEN", token);
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
