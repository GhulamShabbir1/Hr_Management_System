// store/index.js
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

// Import modules
import auth from "./modules/auth";
import employees from "./modules/employees";
import attendance from "./modules/attendance";
import payroll from "./modules/payroll";
import performance from "./modules/performance";
import announcements from "./modules/announcements";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,           // Authentication & user management
    employees,      // Employee management
    attendance,     // Attendance tracking
    payroll,        // Payroll processing
    performance,    // Performance reviews
    announcements   // Company announcements
  },
  plugins: [
    createPersistedState({
      key: "hrms-vuex",
      paths: [
        "auth.token",
        "auth.user",
        "auth.refreshToken"
      ],
      storage: window.localStorage
    })
  ],
  strict: process.env.NODE_ENV !== "production"
});
