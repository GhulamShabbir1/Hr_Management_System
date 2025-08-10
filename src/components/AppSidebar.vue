<template>
  <div>
    <!-- Mobile Toggle Button -->
    <button
      v-if="isMobile"
      @click="toggleMobileMenu"
      class="mobile-menu-toggle"
      aria-label="Toggle navigation menu"
    >
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar -->
    <div
      class="sidebar"
      :class="{ 'mobile-visible': isMobileVisible }"
      @click.self="handleOutsideClick"
    >
      <div class="sidebar-header">
        <div class="brand-container">
          <h3 class="brand-title">HRMS</h3>
          <p class="brand-subtitle">Human Resource System</p>
        </div>
        <div class="user-info" v-if="currentUser">
          <div class="avatar">
            {{ getInitials(currentUser.name) }}
          </div>
          <div class="user-details">
            <p class="user-name">{{ currentUser.name }}</p>
            <span class="user-role badge">{{ formatRole(currentUser.role) }}</span>
          </div>
        </div>
      </div>

      <div class="menu-container">
        <ul class="nav flex-column">
          <li
            v-for="(item, index) in filteredMenuItems"
            :key="`${item.path}-${index}`"
            class="nav-item"
          >
            <router-link
              :to="item.path"
              class="nav-link"
              :class="{
                active: isActive(item.path),
                'has-notification': showNotification(item)
              }"
              @click.native="handleNavClick"
              :aria-current="isActive(item.path) ? 'page' : null"
            >
              <i :class="item.icon" class="nav-icon"></i>
              <span class="nav-text">{{ item.label }}</span>
              <span
                v-if="showNotification(item)"
                class="notification-badge"
                aria-label="New notifications"
              ></span>
              <i
                v-if="item.children"
                class="fas fa-chevron-down toggle-submenu"
                :class="{ 'rotate': isSubmenuOpen(item) }"
                @click.stop="toggleSubmenu(item)"
              ></i>
            </router-link>

            <!-- Submenu Items -->
            <transition name="slide">
              <ul v-if="item.children && isSubmenuOpen(item)" class="submenu">
                <li
                  v-for="(child, childIndex) in item.children"
                  :key="`${child.path}-${childIndex}`"
                  class="submenu-item"
                >
                  <router-link
                    :to="child.path"
                    class="submenu-link"
                    :class="{ active: isActive(child.path) }"
                    @click.native="handleNavClick"
                  >
                    <i :class="child.icon" class="submenu-icon"></i>
                    <span>{{ child.label }}</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <button
          @click="handleLogout"
          class="btn btn-logout"
          aria-label="Logout"
        >
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
        <div class="sidebar-version">
          v{{ appVersion }}
        </div>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div
      v-if="isMobile && isMobileVisible"
      class="sidebar-overlay"
      @click="toggleMobileMenu"
    ></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AppSidebar",
  data() {
    return {
      menuItems: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: "fas fa-tachometer-alt",
          roles: ["Admin", "HR", "Employee"],
          notification: false
        },
        {
          label: "Employee Management",
          path: "/employees",
          icon: "fas fa-users",
          roles: ["Admin", "HR"],
          notification: false
        },
        {
          label: "Attendance",
          path: "/attendance",
          icon: "fas fa-clock",
          roles: ["Admin", "HR", "Employee"],
          notification: true,
          children: [
            {
              label: "Check In/Out",
              path: "/attendance/check",
              icon: "fas fa-fingerprint"
            },
            {
              label: "Attendance Reports",
              path: "/attendance/reports",
              icon: "fas fa-history"
            }
          ]
        },
        {
          label: "Leave Management",
          path: "/attendance/leave-request",
          icon: "fas fa-calendar-minus",
          roles: ["Admin", "HR", "Employee"],
          notification: true
        },
        {
          label: "Payroll",
          path: "/payroll",
          icon: "fas fa-money-bill-wave",
          roles: ["HR", "Admin"],
          notification: false
        },
        {
          label: "Performance",
          path: "/performance",
          icon: "fas fa-star",
          roles: ["HR", "Admin", "Manager"],
          notification: true,
          children: [
            {
              label: "Reviews",
              path: "/performance",
              icon: "fas fa-clipboard-check"
            },
            {
              label: "Tasks",
              path: "/performance/tasks",
              icon: "fas fa-tasks"
            }
          ]
        },
        {
          label: "Announcements",
          path: "/announcements",
          icon: "fas fa-bullhorn",
          roles: ["Admin", "HR", "Employee"],
          notification: false
        }
      ],
      isMobileVisible: false,
      isMobile: false,
      openSubmenus: [],
      appVersion: process.env.VUE_APP_VERSION || "1.0.0"
    };
  },
  computed: {
    ...mapGetters("auth", ["currentUser", "userRole"]),
    filteredMenuItems() {
      if (!this.userRole) return [];
      return this.menuItems
        .filter((item) => item.roles.includes(this.userRole))
        .map((item) => {
          if (item.children) {
            return {
              ...item,
              children: item.children.filter(
                (child) => !child.roles || child.roles.includes(this.userRole)
              )
            };
          }
          return item;
        });
    }
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    getInitials(name) {
      if (!name) return "";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    },
    formatRole(role) {
      return role || "User";
    },
    isActive(path) {
      return this.$route.path.startsWith(path);
    },
    showNotification(item) {
      return item.notification;
    },
    isSubmenuOpen(item) {
      return this.openSubmenus.includes(item.path);
    },
    toggleSubmenu(item) {
      const index = this.openSubmenus.indexOf(item.path);
      if (index === -1) this.openSubmenus.push(item.path);
      else this.openSubmenus.splice(index, 1);
    },
    async handleLogout() {
      try {
        await this.logout();
      } finally {
        this.$router.push("/login");
      }
    },
    handleNavClick() {
      if (this.isMobile) {
        this.isMobileVisible = false;
      }
    },
    handleOutsideClick() {
      if (this.isMobile) {
        this.isMobileVisible = false;
      }
    },
    toggleMobileMenu() {
      this.isMobileVisible = !this.isMobileVisible;
    },
    checkScreenSize() {
      this.isMobile = window.innerWidth < 768;
      if (!this.isMobile) {
        this.isMobileVisible = false;
      }
    }
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);

    // Open submenu if current route is a child
    const currentPath = this.$route.path;
    for (const item of this.menuItems) {
      if (item.children && item.children.some((child) => currentPath.startsWith(child.path))) {
        this.openSubmenus.push(item.path);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenSize);
  }
};
</script>

<style scoped>
:root {
  --sidebar-width: 280px;
  --sidebar-bg: #f8f9fa;
  --sidebar-color: #495057;
  --sidebar-active-bg: #e9ecef;
  --sidebar-hover-bg: #e9ecef;
  --sidebar-header-bg: #343a40;
  --sidebar-notification: #dc3545;
  --sidebar-submenu-bg: #e9ecef;
  --sidebar-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --sidebar-accent: #6c757d;
  --sidebar-footer-bg: #343a40;
  --sidebar-border: #dee2e6;
}

/* Mobile Toggle Button */
.mobile-menu-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1040;
  background: #495057;
  color: #f8f9fa;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: var(--sidebar-transition);
}

.mobile-menu-toggle:hover {
  transform: scale(1.1);
  background: #343a40;
}

/* Sidebar */
.sidebar {
  background: var(--sidebar-bg);
  color: var(--sidebar-color);
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1030;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
  transition: var(--sidebar-transition);
  transform: translateX(0);
  border-right: 1px solid var(--sidebar-border);
}

.sidebar-header {
  padding: 1.5rem;
  background: var(--sidebar-header-bg);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.sidebar-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
}

.brand-container {
  margin-bottom: 1.5rem;
  position: relative;
}

.brand-title {
  color: #f8f9fa;
  font-weight: 700;
  margin-bottom: 0.25rem;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
}

.brand-title::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #adb5bd;
  border-radius: 50%;
  margin-right: 10px;
}

.brand-subtitle {
  color: rgba(248, 249, 250, 0.7);
  font-size: 0.8rem;
  margin-bottom: 0;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(52, 58, 64, 0.5);
  border-radius: 8px;
  transition: var(--sidebar-transition);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.user-info:hover {
  background: rgba(52, 58, 64, 0.8);
  border-color: rgba(108, 117, 125, 0.3);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c757d, #495057);
  color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.75rem;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-details {
  overflow: hidden;
}

.user-name {
  margin-bottom: 0.2rem;
  font-size: 0.9rem;
  color: #f8f9fa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.user-role {
  background: rgba(248, 249, 250, 0.15);
  color: #f8f9fa;
  font-weight: normal;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  text-transform: capitalize;
}

.menu-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: var(--sidebar-color);
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  position: relative;
  transition: var(--sidebar-transition);
  text-decoration: none;
  border-left: 4px solid transparent;
  margin: 0.15rem 0.5rem;
  border-radius: 6px;
}

.nav-link:hover {
  color: #212529;
  background: var(--sidebar-hover-bg);
  transform: translateX(4px);
}

.nav-link.active {
  background: var(--sidebar-active-bg);
  color: #212529;
  border-left-color: #6c757d;
  font-weight: 500;
}

.nav-link.has-notification::after {
  content: '';
  position: absolute;
  right: 1.5rem;
  width: 8px;
  height: 8px;
  background: var(--sidebar-notification);
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--sidebar-bg);
  animation: pulse 2s infinite;
}

.nav-icon {
  margin-right: 0.75rem;
  width: 1.25rem;
  text-align: center;
  font-size: 0.9rem;
  color: #6c757d;
}

.toggle-submenu {
  margin-left: auto;
  transition: transform 0.3s ease;
  font-size: 0.8rem;
  color: #6c757d;
}

.toggle-submenu.rotate {
  transform: rotate(180deg);
}

/* Submenu Styles */
.submenu {
  list-style: none;
  padding: 0;
  margin: 0 0 0 1rem;
  background: transparent;
  border-left: 1px dashed #dee2e6;
}

.submenu-item {
  border-left: 4px solid transparent;
}

.submenu-link {
  display: flex;
  align-items: center;
  padding: 0.7rem 1rem 0.7rem 2.5rem;
  color: #6c757d;
  text-decoration: none;
  transition: var(--sidebar-transition);
  position: relative;
  border-radius: 4px;
  margin: 0.1rem 0;
}

.submenu-link:hover {
  color: #495057;
  background: var(--sidebar-submenu-bg);
}

.submenu-link.active {
  color: #495057;
  background: var(--sidebar-submenu-bg);
  font-weight: 500;
}

.submenu-link.active::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #6c757d;
  border-radius: 50%;
}

.submenu-icon {
  margin-right: 0.75rem;
  font-size: 0.8rem;
  width: 1rem;
  text-align: center;
  color: #adb5bd;
}

/* Slide transition for submenu */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.slide-enter, .slide-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  background: var(--sidebar-footer-bg);
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.btn-logout {
  width: calc(100% - 2rem);
  background: #495057;
  color: #f8f9fa;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin: 0 auto 0.75rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #343a40;
}

.btn-logout i {
  margin-right: 0.5rem;
}

.sidebar-version {
  font-size: 0.7rem;
  color: rgba(248, 249, 250, 0.5);
  letter-spacing: 0.5px;
}

/* Overlay for mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1020;
  backdrop-filter: blur(2px);
}

/* Animations */
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
}

/* Fade-in animation for sidebar */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-item {
  animation: fadeIn 0.3s ease forwards;
  opacity: 0;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.15s; }
.nav-item:nth-child(3) { animation-delay: 0.2s; }
.nav-item:nth-child(4) { animation-delay: 0.25s; }
.nav-item:nth-child(5) { animation-delay: 0.3s; }
.nav-item:nth-child(6) { animation-delay: 0.35s; }
.nav-item:nth-child(7) { animation-delay: 0.4s; }
.nav-item:nth-child(8) { animation-delay: 0.45s; }

/* Responsive Styles */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }

  .sidebar {
    transform: translateX(-100%);
    box-shadow: none;
  }

  .sidebar.mobile-visible {
    transform: translateX(0);
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
  }

  .sidebar-header {
    padding: 1rem;
  }

  .nav-link {
    padding: 0.75rem 1rem;
  }

  .submenu-link {
    padding-left: 2.5rem;
  }
}
</style>