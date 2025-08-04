// src/store/modules/performance.js
export default {
  namespaced: true,
  state: {
    reviews: [
      { id: 1, employeeId: 1, reviewer: "HR Manager", score: 4.5, comments: "Excellent performance", date: "2025-07-30" }
    ]
  },
  mutations: {
    ADD_REVIEW(state, review) {
      state.reviews.push(review);
    }
  },
  actions: {
    addReview({ commit }, review) {
      commit("ADD_REVIEW", { id: Date.now(), ...review });
    }
  },
  getters: {
    getReviewsByEmployee: state => id => state.reviews.filter(r => r.employeeId === id)
  }
};
