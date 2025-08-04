import Vue from "vue";
import Router from "vue-router";
import store from "@/store"; // <-- Use @ (alias for src)

// Lazy-loaded components (ensure these paths exist)
const AppLogin = () => import("@/pages/AppLogin.vue");
const AppRegister = () => import("@/pages/AppRegister.vue");
const AppDashboard = () => import("@/pages/AppDashboard.vue");
const AppNotFound = () => import("@/pages/AppNotFound.vue");

// Employee Management
const EmployeeList = () => import("@/components/employee/AppEmployeeList.vue");
const EmployeeProfile = () => import("@/components/employee/AppEmployeeProfile.vue");

// Attendance Management
const AttendanceCheck = () => import("@/components/attendance/AppAttendanceCheck.vue");
const LeaveRequestForm = () => import("@/components/attendance/AppLeaveRequestForm.vue");

// Payroll Management
const PayrollList = () => import("@/components/payroll/AppPayrollList.vue");

// Performance Management
const PerformanceReview = () => import("@/components/performance/AppReviewSummary.vue");

// Announcements
const AnnouncementList = () => import("@/components/announcements/AppAnnouncementList.vue");

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { 
      path: "/", 
      redirect: "/dashboard",
      meta: { title: "HRMS - Redirecting", transition: "fade" }
    },
    { 
      path: "/login", 
      component: AppLogin,
      meta: { title: "HRMS - Login", transition: "slide-up", guestOnly: true }
    },
    { 
      path: "/register", 
      component: AppRegister,
      meta: { title: "HRMS - Register", transition: "slide-up", guestOnly: true }
    },
    { 
      path: "/dashboard", 
      component: AppDashboard, 
      meta: { 
        requiresAuth: true,
        title: "HRMS - Dashboard",
        transition: "fade",
        roles: ["Admin", "HR", "Employee", "Manager"]
      }
    },
    // Employee Management
    {
      path: "/employees",
      component: EmployeeList,
      meta: { requiresAuth: true, title: "HRMS - Employees", transition: "slide-right", roles: ["Admin", "HR"] }
    },
    {
      path: "/employees/:id",
      component: EmployeeProfile,
      meta: { requiresAuth: true, title: "HRMS - Employee Profile", transition: "slide-right", roles: ["Admin", "HR", "Employee"] }
    },
    // Attendance Management
    {
      path: "/attendance/check",
      component: AttendanceCheck,
      meta: { requiresAuth: true, title: "HRMS - Attendance", transition: "slide-up", roles: ["Admin", "HR", "Employee"] }
    },
    {
      path: "/attendance/leave",
      component: LeaveRequestForm,
      meta: { requiresAuth: true, title: "HRMS - Leave Request", transition: "slide-up", roles: ["Admin", "HR", "Employee", "Manager"] }
    },
    // Payroll
    {
      path: "/payroll",
      component: PayrollList,
      meta: { requiresAuth: true, title: "HRMS - Payroll", transition: "slide-left", roles: ["Admin", "HR"] }
    },
    // Performance
    {
      path: "/performance",
      component: PerformanceReview,
      meta: { requiresAuth: true, title: "HRMS - Performance", transition: "slide-down", roles: ["Admin", "HR", "Manager"] }
    },
    // Announcements
    {
      path: "/announcements",
      component: AnnouncementList,
      meta: { requiresAuth: true, title: "HRMS - Announcements", transition: "fade", roles: ["Admin", "HR", "Employee", "Manager"] }
    },
    // 404 - Not Found
    { 
      path: "*", 
      component: AppNotFound,
      meta: { title: "HRMS - Page Not Found", transition: "fade" }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

// Route guards
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "HR Management System";

  const isAuthenticated = store.getters["auth/isAuthenticated"];
  const userRole = store.getters["auth/userRole"];

  // Redirect guest users trying to access protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }

  // Redirect authenticated users trying to access guest-only routes
  if (to.meta.guestOnly && isAuthenticated) {
    return next("/dashboard");
  }

  // Check role-based access
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return next(isAuthenticated ? "/dashboard" : "/login");
  }

  // Page transition animation
  if (to.meta.transition) {
    document.body.classList.add(`page-transition-${to.meta.transition}`);
    setTimeout(() => document.body.classList.remove(`page-transition-${to.meta.transition}`), 500);
  }

  next();
});

export default router;
