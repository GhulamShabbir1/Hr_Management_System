<template>
  <div class="notification-container">
    <transition-group name="slide-fade" tag="div">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="notification-toast"
        :class="notification.type"
      >
        <i :class="getIcon(notification.type)" class="notification-icon"></i>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <button 
          @click="removeNotification(notification.id)" 
          class="close-btn" 
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'AppNotificationToast',
  data() {
    return {
      notifications: [],
      nextId: 1
    };
  },
  methods: {
    getIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      };
      return icons[type] || 'fas fa-bell';
    },
    
    addNotification(notification) {
      const id = this.nextId++;
      const newNotification = {
        id,
        type: notification.type || 'info',
        title: notification.title || 'Notification',
        message: notification.message || '',
        duration: notification.duration || 4000
      };
      
      this.notifications.push(newNotification);
      
      // Auto remove after duration
      setTimeout(() => {
        this.removeNotification(id);
      }, newNotification.duration);
    },
    
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }
  },
  
  mounted() {
    // Listen for global notifications
    this.$root.$on('show-notification', this.addNotification);
  },
  
  beforeDestroy() {
    this.$root.$off('show-notification', this.addNotification);
  }
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1100;
  max-width: 400px;
}

.notification-toast {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  border-left: 4px solid #007bff;
  animation: slideInRight 0.3s ease;
}

.notification-toast.success {
  border-left-color: #28a745;
}

.notification-toast.error {
  border-left-color: #dc3545;
}

.notification-toast.warning {
  border-left-color: #ffc107;
}

.notification-toast.info {
  border-left-color: #17a2b8;
}

.notification-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.notification-toast.success .notification-icon {
  color: #28a745;
}

.notification-toast.error .notification-icon {
  color: #dc3545;
}

.notification-toast.warning .notification-icon {
  color: #ffc107;
}

.notification-toast.info .notification-icon {
  color: #17a2b8;
}

.notification-content {
  flex-grow: 1;
  margin-right: 0.5rem;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #212529;
}

.notification-message {
  color: #6c757d;
  font-size: 0.875rem;
  line-height: 1.4;
}

.close-btn {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.25rem;
  opacity: 0.7;
  cursor: pointer;
  padding: 0;
  margin: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  opacity: 1;
  color: #495057;
}

/* Slide-fade transition */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Slide in animation */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>