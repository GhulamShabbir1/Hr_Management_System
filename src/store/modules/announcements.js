import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    announcements: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_ANNOUNCEMENTS(state, announcements) {
      state.announcements = announcements;
    },
    ADD_ANNOUNCEMENT(state, announcement) {
      state.announcements.unshift(announcement);
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchAnnouncements({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await api.get('/announcements');
        
        // Handle different API response structures
        let announcements = [];
        
        if (response.data && Array.isArray(response.data)) {
          // Case 1: Direct array response
          announcements = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Case 2: Wrapped in data property
          announcements = response.data.data;
        } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
          // Case 3: Alternative structure (items instead of data)
          announcements = response.data.items;
        } else {
          console.error('Unexpected API response structure:', response.data);
          throw new Error('Unexpected API response structure');
        }

        // Validate announcement structure
        if (announcements.length > 0) {
          const requiredKeys = ['id', 'title', 'content', 'createdAt'];
          const sampleItem = announcements[0];
          const missingKeys = requiredKeys.filter(key => !(key in sampleItem));
          
          if (missingKeys.length > 0) {
            console.warn('Announcement items missing required fields:', missingKeys);
            // Fill in missing fields with defaults if needed
            announcements = announcements.map(item => ({
              content: '',
              createdAt: new Date().toISOString(),
              ...item
            }));
          }
        }

        commit('SET_ANNOUNCEMENTS', announcements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        
        const errorMessage = error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch announcements';
        
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async addAnnouncement({ commit }, announcement) {
      try {
        if (!announcement.title || !announcement.content) {
          throw new Error('Title and content are required');
        }

        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await api.post('/announcements', announcement);
        
        let newAnnouncement = null;
        
        if (response.data) {
          // Handle different success response structures
          newAnnouncement = response.data.data || response.data;
          
          if (!newAnnouncement.id) {
            console.warn('Created announcement missing ID:', newAnnouncement);
            // Generate a temporary ID if missing
            newAnnouncement.id = `temp-${Date.now()}`;
          }
          
          // Ensure required fields exist
          newAnnouncement = {
            content: '',
            createdAt: new Date().toISOString(),
            ...newAnnouncement
          };
          
          commit('ADD_ANNOUNCEMENT', newAnnouncement);
          return newAnnouncement;
        }
        
        throw new Error('Invalid response structure');
      } catch (error) {
        console.error('Error adding announcement:', error);
        
        const errorMessage = error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to add announcement';
        
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  getters: {
    allAnnouncements: state => state.announcements,
    isLoading: state => state.loading,
    error: state => state.error,
    // Additional useful getters
    activeAnnouncements: state => state.announcements.filter(a => !a.isArchived),
    recentAnnouncements: (state) => (limit = 5) => {
      return [...state.announcements]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    }
  }
};