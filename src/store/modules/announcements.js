// src/store/modules/announcements.js
import api from '../../services/api';

function normalizeAnnouncement(raw) {
  const title = raw.title ?? raw.subject ?? 'Untitled';
  const message = raw.message ?? raw.content ?? raw.body ?? raw.description ?? '';
  return {
    id: raw.id ?? raw.announcementId ?? raw._id ?? `tmp-${Date.now()}`,
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
    SET_ANNOUNCEMENTS(state, announcements) {
      state.announcements = Array.isArray(announcements) ? announcements : [];
    },
    ADD_ANNOUNCEMENT(state, announcement) {
      state.announcements.unshift(announcement);
    },
    SET_LOADING(state, isLoading) {
      state.loading = !!isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error || null;
    }
  },

  actions: {
    async fetchAnnouncements({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const res = await api.get('/announcements');
        const payload = res?.data?.data ?? res?.data ?? [];
        const list = Array.isArray(payload)
          ? payload
          : (Array.isArray(payload.items) ? payload.items : []);
        commit('SET_ANNOUNCEMENTS', list.map(normalizeAnnouncement));
        return { success: true };
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Failed to fetch announcements';
        commit('SET_ERROR', msg);
        commit('SET_ANNOUNCEMENTS', []);
        return { success: false, message: msg };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addAnnouncement({ commit }, payload) {
      // Accept aliases from various forms
      const rawTitle   = payload?.title   ?? payload?.subject   ?? '';
      const rawMessage = payload?.message ?? payload?.content   ?? payload?.body ?? payload?.description ?? '';

      const title   = String(rawTitle).trim();
      const message = String(rawMessage).trim();

      // is_active may be boolean/number/string; normalize and also send both variants if needed
      const isActiveBool = !!(payload?.is_active || payload?.active);
      const is_active = isActiveBool ? 1 : 0;

      if (!title || !message) {
        const msg = 'Title and content/message are required';
        return { success: false, message: msg };
      }

      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        // Send both message and content to satisfy backend variants
        const reqBody = {
          title,
          message,                // primary (backend requires this)
          content: message,       // fallback if backend reads 'content'
          is_active,              // numeric flag
          active: isActiveBool    // boolean flag (extra, harmless)
        };

        const res = await api.post('/announcements', reqBody);
        const createdRaw = res?.data?.data ?? res?.data ?? {};
        const created = normalizeAnnouncement({
          ...createdRaw,
          title,
          message,
          is_active
        });

        commit('ADD_ANNOUNCEMENT', created);
        return { success: true, data: created };
      } catch (e) {
        const apiMsg = e?.response?.data?.message;
        const firstError =
          (e?.response?.data?.errors && Object.values(e.response.data.errors)[0]?.[0]) || null;
        const msg = firstError || apiMsg || e.message || 'Failed to create announcement';
        commit('SET_ERROR', msg);
        return { success: false, message: msg };
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    allAnnouncements: (state) => state.announcements,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
    activeAnnouncements: (state) =>
      state.announcements.filter(a => a.is_active),
    recentAnnouncements: (state) => (limit = 5) =>
      [...state.announcements]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
  }
};