import api from '@/services/api';

function normalizeAnnouncement(raw) {
  const title = raw.title ?? raw.subject ?? 'Untitled';
  const message = raw.message ?? raw.content ?? raw.body ?? raw.description ?? '';
  return {
    id: raw.id ?? raw.announcementId ?? raw._id ?? `tmp_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    title: String(title),
    message: String(message),
    content: String(message),
    is_active: typeof raw.is_active !== 'undefined'
      ? (String(raw.is_active) === '1' || String(raw.is_active).toLowerCase() === 'true')
      : (raw.active ?? raw.isActive ?? true),
    createdAt: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
    createdBy: raw.created_by ?? raw.createdBy ?? raw.user?.name ?? 'System'
  };
}

export default {
  namespaced: true,
  state: {
    announcements: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_ANNOUNCEMENTS(state, list) {
      const arr = Array.isArray(list) ? list : [];
      state.announcements = arr.map(normalizeAnnouncement);
    },
    ADD_ANNOUNCEMENT(state, item) {
      state.announcements.unshift(normalizeAnnouncement(item));
    },
    SET_LOADING(state, val) { state.loading = !!val; },
    SET_ERROR(state, err) { state.error = err || null; }
  },
  actions: {
    async fetchAnnouncements({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const response = await api.get('/announcements');
        const payload = response?.data?.data ?? response?.data?.items ?? response?.data ?? [];
        const list = Array.isArray(payload) ? payload : [];
        commit('SET_ANNOUNCEMENTS', list);
        return { success: true };
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to fetch announcements';
        commit('SET_ERROR', msg);
        commit('SET_ANNOUNCEMENTS', []);
        return { success: false, message: msg };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addAnnouncement({ commit }, payload) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const title = String(payload?.title ?? payload?.subject ?? '').trim();
        const message = String(payload?.message ?? payload?.content ?? payload?.body ?? payload?.description ?? '').trim();
        const is_active = payload?.is_active ? 1 : 0;
        if (!title || !message) throw new Error('Title and content/message are required');

        const res = await api.post('/announcements', { title, message, is_active });
        const created = res?.data?.data ?? res?.data ?? { title, message, is_active };
        commit('ADD_ANNOUNCEMENT', created);
        return { success: true, data: created };
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to add announcement';
        commit('SET_ERROR', msg);
        return { success: false, message: msg };
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  getters: {
    allAnnouncements: state => state.announcements,
    isLoading: state => state.loading,
    error: state => state.error,
    recentAnnouncements: (state) => (limit = 5) =>
      (Array.isArray(state.announcements) ? [...state.announcements] : [])
        .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
  }
};