// src/store/modules/payroll.js
export default {
  namespaced: true,
  state: {
    payrolls: [
      { id: 1, employeeId: 1, amount: 80000, month: "July 2025", date: "2025-07-31" }
    ]
  },
  mutations: {
    SET_PAYROLL(state, payroll) {
      state.payrolls.push(payroll);
    }
  },
  actions: {
    generatePayroll({ commit }, { employeeId, amount, month }) {
      commit("SET_PAYROLL", { id: Date.now(), employeeId, amount, month, date: new Date().toISOString() });
    }
  },
  getters: {
    getPayrollByEmployee: state => id => state.payrolls.filter(p => p.employeeId === id)
  }
};
