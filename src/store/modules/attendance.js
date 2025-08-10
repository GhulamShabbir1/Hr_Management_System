// src/store/modules/attendance.js

import api from '../../services/api'; // Make sure this path and api instance are correct

export default {
  namespaced: true,
  state: {
    records: [], // All attendance records
  },

  mutations: {
    SET_ATTENDANCE(state, records) {
      state.records = records;
    },
    MARK_ATTENDANCE(state, record) {
      state.records.push(record);
    }
  },

  actions: {
    // Get all attendance records from API
    async fetchAttendance({ commit }) {
      try {
        const response = await api.get("/attendances"); // Replace with actual endpoint
        commit("SET_ATTENDANCE", response.data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    },

    // Add new attendance record (check-in or check-out)
    async markAttendance({ commit }, { employeeId, date, status }) {
      try {
        const payload = { employeeId, date, status };
        const response = await api.post("/attendance/check-in", payload); // Replace with actual POST endpoint
        commit("MARK_ATTENDANCE", response.data);
      } catch (error) {
        console.error("Error marking attendance:", error);
      }
    }
  },

  getters: {
    // Get attendance by employee
    getAttendanceByEmployee: (state) => (id) =>
      state.records.filter((r) => r.employeeId === id),

    // Get only users who checked in
    checkedInUsers: (state) =>
      state.records.filter((r) => r.status.toLowerCase() === "check-in"),

    // Get only users who checked out
    checkedOutUsers: (state) =>
      state.records.filter((r) => r.status.toLowerCase() === "check-out"),

    // Get all records
    allAttendance: (state) => state.records,
  },
};
