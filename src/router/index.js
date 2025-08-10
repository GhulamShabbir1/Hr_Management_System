import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

// Main Components
const AppDashboard = () => import("@/pages/AppDashboard");
const AppLogin = () => import("@/pages/AppLogin.vue");
const AppRegister = () => import("@/pages/AppRegister.vue");
const AppNotFound = () => import("@/pages/AppNotFound.vue");

// Employee Management
const EmployeeList = () => import("@/components/employee/AppEmployeeList.vue");
const EmployeeProfile = () => import("@/components/employee/AppEmployeeProfile.vue");

// Attendance
const AttendanceCheck = () => import("@/components/attendance/AppAttendanceCheck.vue");
const LeaveRequestForm = () => import("@/components/attendance/AppLeaveRequestForm.vue");
const AttendanceReport = () => import("@/components/attendance/AppAttendanceReport.vue");

// Payroll
const PayrollList = () => import("@/components/payroll/AppPayrollList.vue");

// Performance
const PerformanceReview = () => import("@/components/performance/AppReviewSummary.vue");
const TaskEvaluation = () => import("@/components/performance/AppTaskEvaluation.vue");

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
      meta: { title: "HRMS" }
    },
    { 
      path: "/login", 
      name: "login",
      component: AppLogin,
      meta: { title: "Login", guestOnly: true }
    },
    { 
      path: "/register", 
      name: "register",
      component: AppRegister,
      meta: { title: "Register", guestOnly: true }
    },
    { 
      path: "/dashboard", 
      name: "dashboard",
      component: AppDashboard, 
      meta: { 
        requiresAuth: true,
        title: "Dashboard",
        roles: ["Admin", "HR", "Employee", "Manager"]
      }
    },
    // Employee Management
    {
      path: "/employees",
      name: "employees",
      component: EmployeeList,
      meta: { 
        requiresAuth: true, 
        title: "Employees", 
        roles: ["Admin", "HR"] 
      }
    },
    {
      path: "/employees/:id",
      name: "employee-profile",
      component: EmployeeProfile,
      meta: { 
        requiresAuth: true, 
        title: "Employee Profile", 
        roles: ["Admin", "HR", "Employee"] 
      }
    },
    // Attendance
    {
      path: "/attendance",
      redirect: "/attendance/check"
    },
    {
      path: "/attendance/check",
      name: "attendance-check",
      component: AttendanceCheck,
      meta: { 
        requiresAuth: true, 
        title: "Attendance Check", 
        roles: ["Admin", "HR", "Employee"] 
      }
    },
    {
      path: "/attendance/leave-request",
      name: "leave-request",
      component: LeaveRequestForm,
      meta: { 
        requiresAuth: true, 
        title: "Leave Request", 
        roles: ["Admin", "HR", "Employee"] 
      }
    },
    {
      path: "/attendance/reports",
      name: "attendance-reports",
      component: AttendanceReport,
      meta: { 
        requiresAuth: true, 
        title: "Attendance Reports", 
        roles: ["Admin", "HR", "Manager"] 
      }
    },
    // Payroll
    {
      path: "/payroll",
      name: "payroll",
      component: PayrollList,
      meta: { 
        requiresAuth: true, 
        title: "Payroll", 
        roles: ["Admin", "HR"] 
      }
    },
    // Performance
    {
      path: "/performance",
      name: "performance",
      component: PerformanceReview,
      meta: { 
        requiresAuth: true, 
        title: "Performance Reviews", 
        roles: ["Admin", "HR", "Manager"] 
      }
    },
    {
      path: "/performance/tasks",
      name: "task-evaluation",
      component: TaskEvaluation,
      meta: { 
        requiresAuth: true, 
        title: "Task Evaluation", 
        roles: ["Admin", "HR", "Manager", "Employee"] 
      }
    },
    // Announcements
    {
      path: "/announcements",
      name: "announcements",
      component: AnnouncementList,
      meta: { 
        requiresAuth: true, 
        title: "Announcements", 
        roles: ["Admin", "HR", "Employee", "Manager"] 
      }
    },
    // 404 - Not Found
    { 
      path: "*", 
      component: AppNotFound,
      meta: { title: "Page Not Found" }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | HRMS` : "HRMS";
  
  const isAuthenticated = store.getters["auth/isAuthenticated"];
  const userRole = store.getters["auth/userRole"] || "Guest";
  
  // Redirect to login if route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }
  
  // Redirect away from auth pages if already logged in
  if (to.meta.guestOnly && isAuthenticated) {
    return next({ path: "/dashboard" });
  }
  
  // Check role permissions
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return next({ path: "/dashboard" });
  }
  
  next();
});

export default router;