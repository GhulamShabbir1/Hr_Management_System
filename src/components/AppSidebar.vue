<template>
  <div class="sidebar">
    <div class="sidebar-header text-center">
      <h3 class="text-white mb-2">HRMS</h3>
      <p class="text-light small mb-0" v-if="user">{{ user.name }}</p>
      <small class="text-muted" v-if="user">({{ user.role }})</small>
    </div>
    
    <ul class="sidebar-menu">
      <li v-for="item in filteredMenuItems" :key="item.path">
        <router-link 
          :to="item.path" 
          :class="{ active: $route.path === item.path }"
        >
          <i :class="item.icon" class="me-2"></i>
          {{ item.label }}
        </router-link>
      </li>
    </ul>
    
    <div class="position-absolute bottom-0 w-100 p-3">
      <button 
        @click="handleLogout"
        class="btn btn-gradient-danger w-100"
      >
        <i class="fas fa-sign-out-alt me-2"></i>
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AppSidebar",
  data() {
    return {
      menuItems: [
        { label: "Dashboard", path: "/dashboard", icon: "fas fa-tachometer-alt", roles: ["Admin", "HR", "Employee"] },
        { label: "Employees", path: "/employees", icon: "fas fa-users", roles: ["Admin", "HR"] },
        { label: "Attendance", path: "/attendance/check", icon: "fas fa-clock", roles: ["Admin", "HR", "Employee"] },
        { label: "Payroll", path: "/payroll", icon: "fas fa-money-bill-wave", roles: ["HR", "Admin"] },
        { label: "Performance", path: "/performance", icon: "fas fa-chart-line", roles: ["HR", "Admin"] },
        { label: "Announcements", path: "/announcements", icon: "fas fa-bullhorn", roles: ["Admin", "HR", "Employee"] }
      ]
    };
  },
  computed: {
    ...mapGetters("auth", ["user", "userRole"]),
    filteredMenuItems() {
      if (!this.userRole) return [];
      return this.menuItems.filter(item => 
        item.roles.includes(this.userRole)
      );
    }
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    async handleLogout() {
      try {
        await this.logout();
        this.$router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
        // Force logout even if there's an error
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style scoped>
/* Component-specific styles */
.sidebar {
  background: var(--gradient-dark);
  min-height: 100vh;
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-menu a {
  display: block;
  padding: 1rem 1.5rem;
  color: #dee2e6;
  text-decoration: none;
  transition: all 0.3s ease;
}

.sidebar-menu a:hover {
  background: var(--gradient-primary);
  color: white;
  text-decoration: none;
  transform: translateX(5px);
}

.sidebar-menu a.active {
  background: var(--gradient-primary);
  color: white;
}

/* Make sure logout button is positioned correctly */
.position-absolute {
  position: absolute !important;
}

.bottom-0 {
  bottom: 0 !important;
}

.w-100 {
  width: 100% !important;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    margin-left: -250px;
  }
}
</style>