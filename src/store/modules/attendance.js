// src/store/modules/attendance.js
export default {
  namespaced: true,
  state: {
    records: [
      { id: 1, employeeId: 1, date: "2025-08-01", status: "Present" },
      { id: 2, employeeId: 2, date: "2025-08-01", status: "Absent" }
    ]
  },
  mutations: {
    MARK_ATTENDANCE(state, record) {
      state.records.push(record);
    }
  },
  actions: {
    markAttendance({ commit }, { employeeId, date, status }) {
      commit("MARK_ATTENDANCE", { id: Date.now(), employeeId, date, status });
    }
  },
  getters: {
    getAttendanceByEmployee: state => id => state.records.filter(r => r.employeeId === id)
  }
};
