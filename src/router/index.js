import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

import AppLogin from "@/pages/AppLogin.vue";
import AppRegister from "@/pages/AppRegister.vue";
import AppDashboard from "@/pages/AppDashboard.vue";
import AppNotFound from "@/pages/AppNotFound.vue";

import AppEmployeeList from "@/components/employee/AppEmployeeList.vue";
import AppEmployeeProfile from "@/components/employee/AppEmployeeProfile.vue";

import AppAttendanceCheck from "@/components/attendance/AppAttendanceCheck.vue";
import AppLeaveRequestForm from "@/components/attendance/AppLeaveRequestForm.vue";
import AppAttendanceReport from "@/components/attendance/AppAttendanceReport.vue";

import AppPayrollList from "@/components/payroll/AppPayrollList.vue";
import AppAnnouncementList from "@/components/announcements/AppAnnouncementList.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: AppLogin },
    { path: "/register", component: AppRegister },
    { path: "/dashboard", component: AppDashboard, meta: { requiresAuth: true } },

    // Employee management
    { path: "/employees", component: AppEmployeeList, meta: { requiresAuth: true, roles: ["Admin", "HR"] } },
    { path: "/employees/:id", component: AppEmployeeProfile, meta: { requiresAuth: true, roles: ["Admin", "HR"] } },

    // Attendance (accessible by all authenticated users)
    { path: "/attendance/check", component: AppAttendanceCheck, meta: { requiresAuth: true } },
    { path: "/attendance/leave", component: AppLeaveRequestForm, meta: { requiresAuth: true } },
    { path: "/attendance/report", component: AppAttendanceReport, meta: { requiresAuth: true } },
    { path: "/attendance", redirect: "/attendance/check", meta: { requiresAuth: true } },

    // Payroll
    { path: "/payroll", component: AppPayrollList, meta: { requiresAuth: true, roles: ["HR"] } },

    // Announcements
    { path: "/announcements", component: AppAnnouncementList, meta: { requiresAuth: true } },

    { path: "*", component: AppNotFound }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuth = store.getters["auth/isAuthenticated"];
  const role = store.getters["auth/userRole"];

  // Allow access to login and register pages
  if (to.path === "/login" || to.path === "/register") {
    return next();
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (to.meta.requiresAuth && !isAuth) {
    return next("/login");
  }

  // Check role-based access
  if (to.meta.roles && (!role || !to.meta.roles.includes(role))) {
    return next("/dashboard");
  }

  next();
});

export default router;
