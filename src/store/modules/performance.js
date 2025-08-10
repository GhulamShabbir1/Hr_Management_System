import api from '@/services/api';

function toIso(value) {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function normalizeReview(raw) {
  const userId = raw.userId ?? raw.user_id ?? raw['User ID'] ?? null;
  const ratingNum = Number(raw.rating ?? raw['User Rating'] ?? 0);
  const feedback = raw.feedback ?? raw['User Feedback'] ?? raw.comments ?? '';
  const date = raw.date ?? raw.created_at ?? raw.createdAt ?? null;

  return {
    id: raw.id ?? raw.reviewId ?? raw._id ?? `${userId || 'u'}_${date || Date.now()}`,
    userId,
    rating: isNaN(ratingNum) ? 0 : ratingNum,
    feedback: String(feedback || ''),
    date: toIso(date)
  };
}

export default {
  namespaced: true,
  state: {
    reviews: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_REVIEWS(state, reviews) {
      const list = Array.isArray(reviews) ? reviews : [];
      state.reviews = list.map(normalizeReview);
    },
    ADD_REVIEW(state, review) {
      state.reviews.unshift(normalizeReview(review));
    },
    UPDATE_REVIEW(state, updatedReview) {
      const normalized = normalizeReview(updatedReview);
      const index = state.reviews.findIndex(r => String(r.id) === String(normalized.id));
      if (index !== -1) {
        state.reviews.splice(index, 1, normalized);
      } else {
        state.reviews.unshift(normalized);
      }
    },
    DELETE_REVIEW(state, id) {
      state.reviews = state.reviews.filter(r => String(r.id) !== String(id));
    },
    SET_LOADING(state, isLoading) {
      state.loading = !!isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error || null;
    }
  },
  actions: {
    async fetchReviews({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const response = await api.get('/list-performance-review');
        const payload = response?.data?.data ?? response?.data ?? [];
        commit('SET_REVIEWS', Array.isArray(payload) ? payload : []);
        return { success: true, data: payload };
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch reviews';
        commit('SET_ERROR', message);
        commit('SET_REVIEWS', []);
        return { success: false, message };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addReview({ commit }, payload) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const body = {
          user_id: payload?.user_id ?? payload?.userId ?? payload?.['User ID'] ?? null,
          rating: payload?.rating ?? payload?.['User Rating'] ?? null,
          feedback: payload?.feedback ?? payload?.['User Feedback'] ?? payload?.comments ?? ''
        };
        const response = await api.post('/create-performance-review', body);
        const created = response?.data?.data ?? response?.data ?? null;
        if (!created) throw new Error('Invalid create response');
        commit('ADD_REVIEW', created);
        return { success: true, data: created };
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to add review';
        commit('SET_ERROR', message);
        return { success: false, message, errors: error.response?.data?.errors };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateReview({ commit }, { id, ...payload }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const body = {
          user_id: payload?.user_id ?? payload?.userId ?? payload?.['User ID'] ?? null,
          rating: payload?.rating ?? payload?.['User Rating'] ?? null,
          feedback: payload?.feedback ?? payload?.['User Feedback'] ?? payload?.comments ?? ''
        };
        const response = await api.put(`/update-performance-review/${id}`, body);
        const updated = response?.data?.data ?? response?.data ?? null;
        if (!updated) throw new Error('Invalid update response');
        commit('UPDATE_REVIEW', updated);
        return { success: true, data: updated };
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to update review';
        commit('SET_ERROR', message);
        return { success: false, message, errors: error.response?.data?.errors };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteReview({ commit }, id) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        await api.post(`/delete-performance-review/${id}`);
        commit('DELETE_REVIEW', id);
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete review';
        commit('SET_ERROR', message);
        return { success: false, message };
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  getters: {
    getReviewsByEmployee: state => id => state.reviews.filter(r => String(r.userId) === String(id)),
    isLoading: state => state.loading,
    error: state => state.error
  }
};