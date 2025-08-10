import Vue from "vue";
import Vuex from "vuex";

// Import modules
import announcements from "./modules/announcements";
import attendance from "./modules/attendance";
import auth from "./modules/auth";
import departments from "./modules/departments";
import employees from "./modules/employees";
import payroll from "./modules/payroll";
import performance from "./modules/performance";
import reports from "./modules/reports";
import settings from "./modules/settings";
import taskevaluation from "./modules/taskevaluation";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,           // Authentication & user management
    employees,      // Employee management
    attendance,     // Attendance tracking
    departments,    // Department management
    payroll,        // Payroll processing
    performance,    // Performance reviews
    announcements,  // Company announcements
    reports,        // Reports and analytics
    settings,       // Application settings
    taskevaluation  // Task evaluation
  },
  strict: process.env.NODE_ENV !== "production"
});