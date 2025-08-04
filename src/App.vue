<template>
  <div id="app" :class="['app-layout', { 'authenticated': isAuthenticated }]">
    <!-- Sidebar with transition animation -->
    <transition name="slide-fade">
      <AppSidebar v-if="isAuthenticated" />
    </transition>

    <!-- Main content with route transitions -->
    <div class="content-wrapper">
      <transition :name="transitionName" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </div>

    <!-- Global notification system -->
    <AppNotificationToast />
  </div>
</template>

<script>
import AppSidebar from "./components/AppSidebar.vue";
import AppNotificationToast from "./components/announcements/AppNotificationToast.vue";
import { mapGetters } from "vuex";

export default {
  name: "AppEmployee",
  components: {
    AppSidebar,
    AppNotificationToast
  },
  data() {
    return {
      transitionName: "fade"
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "userRole"])
  },
  watch: {
    $route(to, from) {
      // Set different transitions based on route depth
      const toDepth = to.meta.depth || 0;
      const fromDepth = from.meta.depth || 0;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    }
  },
  created() {
    // Initialize auth state
    this.$store.dispatch("auth/initializeAuth");
  }
};
</script>

<style scoped>
/* Bootstrap-based layout */
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  background-color: #f8f9fa;
}

.app-layout.authenticated {
  padding-left: 250px;
  transition: padding 0.3s ease;
}

.content-wrapper {
  flex: 1;
  padding: 2rem;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Bootstrap-enhanced transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-enter {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* Responsive adjustments using Bootstrap breakpoints */
@media (max-width: 768px) {
  .app-layout.authenticated {
    padding-left: 0;
  }

  .content-wrapper {
    padding: 1rem;
  }
}
</style>