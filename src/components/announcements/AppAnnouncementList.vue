<template>
  <div class="container-fluid py-4 animate-fade-in">
    <h2 class="h2 font-weight-bold mb-4 text-primary">Announcements</h2>
    <button 
      v-if="isAdmin" 
      @click="openCreate()" 
      class="btn btn-primary px-4 py-2 mb-4 animate-pulse"
    >
      <i class="fas fa-plus-circle mr-2"></i>Create Announcement
    </button>

    <ul class="list-unstyled">
      <li 
        v-for="(announcement, index) in announcements" 
        :key="announcement.id" 
        class="card mb-3 announcement-item"
        :style="{'--animation-order': index}"
        :class="{'border-success': announcement.emailSent, 'border-warning': !announcement.emailSent}"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h3 class="h5 font-weight-bold mb-0">{{ announcement.title }}</h3>
            <span class="text-muted small">{{ formatDate(announcement.date) }}</span>
          </div>
          <p class="mt-2 mb-1">{{ announcement.content }}</p>
          <div class="mt-2 text-muted small">
            <i 
              v-if="announcement.emailSent" 
              class="fas fa-envelope-circle-check text-success" 
              title="Email sent"
            ></i>
            <i 
              v-else 
              class="fas fa-envelope text-secondary" 
              title="Email not sent"
            ></i>
          </div>
        </div>
      </li>
    </ul>

    <AppCreateAnnouncement 
      v-if="showCreate" 
      @close="showCreate = false" 
      @created="addAnnouncement" 
    />
  </div>
</template>

<script>
import AppCreateAnnouncement from "./AppCreateAnnouncement.vue";

export default {
  components: { AppCreateAnnouncement },
  data() {
    return {
      announcements: [
        {
          id: 1,
          title: "New HR Policy",
          content: "Please review the updated HR policy effective next month.",
          date: "2025-08-01",
          emailSent: true,
        },
        {
          id: 2,
          title: "Office Maintenance",
          content: "Office will be closed for maintenance on 10th August.",
          date: "2025-07-28",
          emailSent: false,
        },
      ],
      showCreate: false,
      userRole: "Admin", // This should come from auth store but here is dummy
    };
  },
  computed: {
    isAdmin() {
      return this.userRole === "Admin";
    },
  },
  methods: {
    openCreate() {
      this.showCreate = true;
    },
    addAnnouncement(newAnnouncement) {
      newAnnouncement.id = this.announcements.length + 1;
      this.announcements.unshift(newAnnouncement);
      this.showCreate = false;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
/* Custom animations */
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

/* Keyframe animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Custom styles */
.card {
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.border-success {
  border-color: #28a745;
}

.border-warning {
  border-color: #ffc107;
}

.fas {
  font-size: 1.1rem;
  vertical-align: middle;
}
</style>