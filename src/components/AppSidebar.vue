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
        @click="logout"
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
        { label: "Attendance", path: "/attendance", icon: "fas fa-clock", roles: ["Admin", "HR", "Employee"] },
        { label: "Payroll", path: "/payroll", icon: "fas fa-money-bill-wave", roles: ["HR"] },
        { label: "Performance", path: "/performance", icon: "fas fa-chart-line", roles: ["HR", "Admin"] },
        { label: "Announcements", path: "/announcements", icon: "fas fa-bullhorn", roles: ["Admin", "HR", "Employee"] },
      ],
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
    async logout() {
      await this.logout();
      this.$router.push("/login");
    }
  }
};
</script>