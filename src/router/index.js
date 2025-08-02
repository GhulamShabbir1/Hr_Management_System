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

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    { path: "/login", component: AppLogin },
    { path: "/register", component: AppRegister },
    { path: "/dashboard", component: AppDashboard, meta: { requiresAuth: true } },

    // Employee management
    { path: "/employees", component: AppEmployeeList, meta: { requiresAuth: true, roles: ["Admin", "HR"] } },
    { path: "/employees/:id", component: AppEmployeeProfile, meta: { requiresAuth: true, roles: ["Admin", "HR"] } },

    // Attendance (accessible by all authenticated users)
    {
      path: "/attendance",
      component: { render: h => h("router-view") },
      meta: { requiresAuth: true },
      children: [
        { path: "check", component: AppAttendanceCheck },
        { path: "leave", component: AppLeaveRequestForm },
        { path: "report", component: AppAttendanceReport },
      ]
    },

    // Payroll
    { path: "/payroll", component: AppPayrollList, meta: { requiresAuth: true, roles: ["HR"] } },

    { path: "*", component: AppNotFound }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuth = store.getters["auth/isAuthenticated"];
  const role = store.getters["auth/userRole"];

  if (to.meta.requiresAuth && !isAuth) return next("/login");
  if (to.meta.roles && !to.meta.roles.includes(role)) return next("/dashboard");
  next();
});

export default router;
