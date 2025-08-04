<template>
  <transition name="slide-fade">
    <div 
      v-if="visible" 
      class="notification-toast"
    >
      <i class="fas fa-bell mr-3"></i>
      <span class="message">{{ message }}</span>
      <button 
        @click="close" 
        class="close-btn" 
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["message"],
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit("closed");
    },
  },
  mounted() {
    setTimeout(() => this.close(), 4000);
  },
};
</script>

<style scoped>
.notification-toast {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  max-width: 350px;
  z-index: 1100;
  animation: fadeInUp 0.5s ease;
}

.message {
  flex-grow: 1;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  opacity: 0.8;
  cursor: pointer;
  padding: 0 0.5rem;
  margin-left: 1rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
  transform: rotate(90deg);
}

.fa-bell {
  font-size: 1.25rem;
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
  transform: translateX(20px);
  opacity: 0;
}

/* Fade-in-up animation */
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
</style>