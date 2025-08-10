import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    reviews: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_REVIEWS(state, reviews) {
      state.reviews = reviews;
    },
    ADD_REVIEW(state, review) {
      state.reviews.push(review);
    },
    UPDATE_REVIEW(state, updatedReview) {
      const index = state.reviews.findIndex(r => r.id === updatedReview.id);
      if (index !== -1) {
        state.reviews.splice(index, 1, updatedReview);
      }
    },
    DELETE_REVIEW(state, id) {
      state.reviews = state.reviews.filter(r => r.id !== id);
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchReviews({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await api.get('/list-performance-review');
        commit('SET_REVIEWS', response.data.data || []);
        return { success: true, data: response.data.data };
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch reviews');
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to fetch reviews' 
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addReview({ commit }, reviewData) {
      try {
        commit('SET_LOADING', true);
        const response = await api.post('/create-performance-review', reviewData);
        commit('ADD_REVIEW', response.data.data);
        return { success: true, data: response.data.data };
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to add review');
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to add review',
          errors: error.response?.data?.errors 
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateReview({ commit }, { id, ...reviewData }) {
      try {
        commit('SET_LOADING', true);
        const response = await api.put(`/update-performance-review/${id}`, reviewData);
        commit('UPDATE_REVIEW', response.data.data);
        return { success: true, data: response.data.data };
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update review');
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to update review',
          errors: error.response?.data?.errors 
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteReview({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        await api.delete(`/delete-performance-review/${id}`);
        commit('DELETE_REVIEW', id);
        return { success: true };
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete review');
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to delete review' 
        };
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  getters: {
    getReviewsByEmployee: state => id => state.reviews.filter(r => r.employeeId === id),
    isLoading: state => state.loading,
    error: state => state.error
  }
};