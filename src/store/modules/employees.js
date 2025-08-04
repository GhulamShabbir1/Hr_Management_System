// src/store/modules/employees.js
export default {
  namespaced: true,
  state: {
    employees: [
      { id: 1, name: "Ali Khan", email: "ali@example.com", role: "Developer", department: "Engineering", status: "active" },
      { id: 2, name: "Sara Ahmed", email: "sara@example.com", role: "Designer", department: "Creative", status: "active" }
    ]
  },
  mutations: {
    SET_EMPLOYEES(state, employees) {
      state.employees = employees;
    },
    ADD_EMPLOYEE(state, employee) {
      state.employees.push(employee);
    },
    UPDATE_EMPLOYEE(state, updatedEmployee) {
      const index = state.employees.findIndex(e => e.id === updatedEmployee.id);
      if (index !== -1) state.employees.splice(index, 1, updatedEmployee);
    },
    TOGGLE_EMPLOYEE_STATUS(state, id) {
      const employee = state.employees.find(e => e.id === id);
      if (employee) employee.status = employee.status === "active" ? "inactive" : "active";
    }
  },
  actions: {
    fetchEmployees({ commit }) {
      // Simulate API call (you can replace with real API later)
      const employees = [
        { id: 1, name: "Ali Khan", email: "ali@example.com", role: "Developer", department: "Engineering", status: "active" },
        { id: 2, name: "Sara Ahmed", email: "sara@example.com", role: "Designer", department: "Creative", status: "active" }
      ];
      commit("SET_EMPLOYEES", employees);
      return employees;
    },
    addEmployee({ commit }, employee) {
      commit("ADD_EMPLOYEE", { ...employee, id: Date.now(), status: "active" });
    },
    updateEmployee({ commit }, employee) {
      commit("UPDATE_EMPLOYEE", employee);
    },
    toggleEmployeeStatus({ commit }, id) {
      commit("TOGGLE_EMPLOYEE_STATUS", id);
    }
  },
  getters: {
    employees: state => state.employees,              // <-- Added alias to fix `employees/employees` getter issue
    allEmployees: state => state.employees,
    activeEmployees: state => state.employees.filter(e => e.status === "active"),
    getByDepartment: state => dept => state.employees.filter(e => e.department === dept)
  }
};
