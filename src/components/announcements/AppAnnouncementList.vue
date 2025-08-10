<template>
  <div class="container-fluid py-4 animate-fade-in">
    <h2 class="h2 font-weight-bold mb-4 text-primary">Announcements</h2>
    
    <!-- Debug Panel -->
    <div class="alert alert-info mb-3" v-if="debugMode">
      <h5>Debug Information</h5>
      <p><strong>Announcements Count:</strong> {{ announcements.length }}</p>
      <p><strong>Loading:</strong> {{ loading }}</p>
      <p><strong>Error:</strong> {{ error || 'None' }}</p>
      <p><strong>First Announcement:</strong> {{ announcements[0] ? JSON.stringify(announcements[0]) : 'None' }}</p>
    </div>

    <button 
      v-if="isAdmin" 
      @click="openCreate()" 
      class="btn btn-primary px-4 py-2 mb-4 animate-pulse"
      :disabled="loading"
    >
      <i class="fas fa-plus-circle mr-2"></i>
      {{ loading ? 'Loading...' : 'Create Announcement' }}
    </button>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2">Loading announcements...</p>
    </div>

    <div v-if="error" class="alert alert-danger">
      <i class="fas fa-exclamation-circle mr-2"></i>
      {{ error }}
      <button @click="fetchAnnouncements" class="btn btn-sm btn-outline-danger ml-3">
        Retry
      </button>
    </div>

    <!-- Debug: Raw Data Display -->
    <div v-if="debugMode && announcements.length > 0" class="alert alert-warning mb-3">
      <h6>Raw Announcements Data:</h6>
      <pre>{{ JSON.stringify(announcements, null, 2) }}</pre>
    </div>

    <!-- Debug: No Data Message -->
    <div v-if="debugMode && announcements.length === 0 && !loading" class="alert alert-warning">
      <h6>No announcements found. Debug info:</h6>
      <ul>
        <li>Announcements array: {{ announcements }}</li>
        <li>Array length: {{ announcements.length }}</li>
        <li>Array is array: {{ Array.isArray(announcements) }}</li>
      </ul>
    </div>

    <ul v-if="!loading && !error" class="list-unstyled">
      <li 
        v-for="(announcement, index) in announcements" 
        :key="announcement.id || index" 
        class="card mb-3 announcement-item"
        :style="{'--animation-order': index}"
        :class="{'border-success': isActive(announcement), 'border-warning': !isActive(announcement)}"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h3 class="h5 font-weight-bold mb-0">{{ announcement.title || 'No Title' }}</h3>
            <span class="text-muted small">
              {{ formatDate(announcement.createdAt || announcement.created || announcement.created_at) }}
            </span>
          </div>
          <p class="mt-2 mb-1">
            {{ announcement.content || announcement.message || announcement.body || announcement.description || 'No Message' }}
          </p>
          <div class="mt-2 text-muted small">
            <i 
              v-if="isActive(announcement)" 
              class="fas fa-envelope-circle-check text-success" 
              title="Active / Published"
            ></i>
            <i 
              v-else 
              class="fas fa-envelope text-secondary" 
              title="Inactive / Draft"
            ></i>
            <span class="ml-2">{{ isActive(announcement) ? 'Published' : 'Draft' }}</span>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="!loading && !error && announcements.length === 0" class="text-center py-5">
      <i class="fas fa-bullhorn fa-3x text-muted mb-3"></i>
      <h4 class="h5">No announcements yet</h4>
      <p class="text-muted">Check back later or create the first announcement</p>
    </div>

    <AppCreateAnnouncement 
      v-if="showCreate" 
      @close="showCreate = false" 
      @created="handleAnnouncementCreated" 
      :loading="createLoading"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import AppCreateAnnouncement from "./AppCreateAnnouncement.vue";

export default {
  name: 'AppAnnouncementList',
  components: { AppCreateAnnouncement },
  data() {
    return {
      showCreate: false,
      createLoading: false,
      debugMode: false // set true to see debug info
    };
  },
  computed: {
    // Use namespaced getters from announcements store
    announcements() {
      return this.$store.getters['announcements/allAnnouncements'] || [];
    },
    loading() {
      return this.$store.getters['announcements/isLoading'];
    },
    error() {
      return this.$store.getters['announcements/error'];
    },
    // Role
    userRole() {
      const user = this.$store.getters['auth/currentUser'] || this.$store.state.auth.user || {};
      return user.role || 'employee';
    },
    isAdmin() {
      const role = (this.userRole || '').toLowerCase();
      return role === 'admin' || role === 'superadmin' || role === 'hr';
    }
  },
  watch: {
    announcements(newVal) {
      if (this.debugMode) console.log('Announcements updated:', newVal);
    }
  },
  created() {
    this.fetchAnnouncements();
  },
  methods: {
    ...mapActions('announcements', ['fetchAnnouncements', 'addAnnouncement']),
    openCreate() {
      this.showCreate = true;
    },
    async handleAnnouncementCreated(newAnnouncement) {
      this.createLoading = true;
      try {
        // Ensure store receives expected fields; store also accepts aliases
        const res = await this.addAnnouncement({
          title: newAnnouncement.title,
          content: newAnnouncement.content || newAnnouncement.message || newAnnouncement.body || '',
          // Optional flags
          sendEmail: !!newAnnouncement.sendEmail
        });

        if (res && res.success) {
          this.showCreate = false;
          // List updates instantly via ADD_ANNOUNCEMENT commit.
          // Optionally re-fetch to sync with server shape:
          // await this.fetchAnnouncements();
        } else {
          const msg = (res && res.message) ? res.message : 'Failed to create announcement';
          if (this.$notify) this.$notify({ type: 'error', title: 'Error', text: msg });
        }
      } catch (error) {
        if (this.$notify) this.$notify({ type: 'error', title: 'Error', text: 'Failed to create announcement' });
      } finally {
        this.createLoading = false;
      }
    },
    isActive(a) {
      // Determine active/published state with common keys
      const val = a.is_active ?? a.isActive ?? a.active ?? null;
      if (val === null || typeof val === 'undefined') return true; // default to active if not provided
      if (typeof val === 'string') return val === '1' || val.toLowerCase() === 'true';
      return !!val;
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return dateStr;
      }
    }
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.announcement-item {
  animation: fadeInUp 0.5s ease;
  animation-delay: calc(var(--animation-order) * 0.1s);
  opacity: 0;
  animation-fill-mode: forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%   { transform: scale(1);   }
  50%  { transform: scale(1.05);}
  100% { transform: scale(1);   }
}

.card {
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.border-success { border-color: #28a745; }
.border-warning { border-color: #ffc107; }

.fas {
  font-size: 1.1rem;
  vertical-align: middle;
}

.text-muted { color: #6c757d !important; }
</style>