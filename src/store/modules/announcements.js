// src/store/modules/announcements.js
export default {
  namespaced: true,
  state: {
    announcements: [
      { id: 1, title: "New HR Policies", content: "Updated leave policy effective from August.", date: "2025-07-29" }
    ]
  },
  mutations: {
    ADD_ANNOUNCEMENT(state, announcement) {
      state.announcements.push(announcement);
    }
  },
  actions: {
    addAnnouncement({ commit }, announcement) {
      commit("ADD_ANNOUNCEMENT", { id: Date.now(), date: new Date().toISOString(), ...announcement });
    }
  },
  getters: {
    allAnnouncements: state => state.announcements
  }
};
