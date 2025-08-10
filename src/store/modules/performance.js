// src/store/modules/performance.js
import api from '../../services/api';

function toIso(value) {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function generateTempId() {
  return `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeReview(raw) {
  const userId = raw.userId ?? raw.user_id ?? raw['User ID'] ?? null;
  const ratingNum = Number(raw.rating ?? raw['User Rating'] ?? 0);
  const feedback = raw.feedback ?? raw['User Feedback'] ?? raw.comments ?? '';
  const date = raw.date ?? raw.created_at ?? raw.createdAt ?? null;

  return {
    id: raw.id ?? raw.reviewId ?? raw._id ?? generateTempId(),
    userId,
    rating: isNaN(ratingNum) ? 0 : ratingNum,
    feedback: String(feedback || ''),
    date: toIso(date)
  };
}

function dedupeById(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    if (seen.has(String(item.id))) continue;
    seen.add(String(item.id));
    out.push(item);
  }
  return out;
}

export default {
  namespaced: true,

  state: {
    reviews: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_LOADING(state, val) {
      state.loading = !!val;
    },
    SET_ERROR(state, msg) {
      state.error = msg || null;
    },
    SET_REVIEWS(state, list) {
      const normalized = Array.isArray(list) ? list.map(normalizeReview) : [];
      state.reviews = dedupeById(normalized);
    },
    ADD_REVIEW(state, reviewRaw) {
      const review = normalizeReview(reviewRaw);
      state.reviews = dedupeById([review, ...state.reviews]);
    },
    UPDATE_REVIEW(state, updatedRaw) {
      const updated = normalizeReview(updatedRaw);
      const idx = state.reviews.findIndex(r => String(r.id) === String(updated.id));
      if (idx !== -1) {
        state.reviews.splice(idx, 1, updated);
      } else {
        state.reviews = dedupeById([updated, ...state.reviews]);
      }
    },
    DELETE_REVIEW(state, id) {
      state.reviews = state.reviews.filter(r => String(r.id) !== String(id));
    }
  },

  actions: {
    async fetchReviews({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const res = await api.get('/list-performance-review');
        const payload = res?.data?.data ?? res?.data ?? [];
        const list = Array.isArray(payload) ? payload : [];
        commit('SET_REVIEWS', list);
        return { success: true };
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Failed to fetch performance reviews';
        commit('SET_ERROR', msg);
        commit('SET_REVIEWS', []);
        return { success: false, message: msg };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addReview({ commit }, payload) {
      const userId = payload?.userId ?? payload?.user_id ?? payload?.['User ID'] ?? null;
      const rating = payload?.rating ?? payload?.['User Rating'] ?? null;
      const feedback = payload?.feedback ?? payload?.['User Feedback'] ?? payload?.comments ?? '';

      if (!userId || rating === null || typeof rating === 'undefined') {
        return { success: false, message: 'User and rating are required' };
      }

      try {
        const res = await api.post('/create-performance-review', {
          user_id: userId,
          rating: Number(rating),
          feedback: String(feedback || '')
        });
        const createdRaw = res?.data?.data ?? res?.data ?? { userId, rating, feedback };
        commit('ADD_REVIEW', createdRaw);
        return { success: true, data: createdRaw };
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Failed to create review';
        return { success: false, message: msg };
      }
    },

    async updateReview({ commit, state }, payload) {
      const id = payload?.id ?? payload?.reviewId ?? null;
      const userId = payload?.userId ?? payload?.user_id ?? payload?.['User ID'] ?? null;
      const rating = payload?.rating ?? payload?.['User Rating'] ?? null;
      const feedback = payload?.feedback ?? payload?.['User Feedback'] ?? payload?.comments ?? '';

      if (!id) {
        return { success: false, message: 'Review id is required' };
      }

      try {
        const current = state.reviews.find(r => String(r.id) === String(id));
        const body = {
          user_id: userId ?? current?.userId,
          rating: (rating === null || typeof rating === 'undefined') ? current?.rating : Number(rating),
          feedback: String((feedback ?? current?.feedback) || '')
        };
        const res = await api.put(`/update-performance-review/${id}`, body);
        const updatedRaw = res?.data?.data ?? res?.data ?? { id, ...body };
        updatedRaw.id = id;
        commit('UPDATE_REVIEW', updatedRaw);
        return { success: true, data: updatedRaw };
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Failed to update review';
        return { success: false, message: msg };
      }
    },

    async deleteReview({ commit }, id) {
      if (!id) return { success: false, message: 'Review id is required' };
      try {
        await api.post(`/delete-performance-review/${id}`);
        commit('DELETE_REVIEW', id);
        return { success: true };
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Failed to delete review';
        return { success: false, message: msg };
      }
    }
  },

  getters: {
    reviews: state => state.reviews,
    loading: state => state.loading,
    error: state => state.error,
    getReviewsByUser: state => userId =>
      state.reviews.filter(r => String(r.userId) === String(userId))
  }
};