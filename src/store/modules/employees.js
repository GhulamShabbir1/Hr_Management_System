// src/store/modules/employees.js
import employeeServices from '@/services/employeeServices';


const state = {
  employees: []
};

const mutations = {
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
  TOGGLE_STATUS(state, id) {
    const employee = state.employees.find(e => e.id === id);
    if (employee) employee.active = !employee.active;
  }
};

const actions = {
  async fetchEmployees({ commit }) {
    const employees = await employeeServices.getAll();
    commit("SET_EMPLOYEES", employees);
  },
  async addEmployee({ commit }, employee) {
    const newEmployee = await employeeServices.add(employee);
    commit("ADD_EMPLOYEE", newEmployee);
  },
  async updateEmployee({ commit }, { id, data }) {
    const updated = await employeeServices.update(id, data);
    commit("UPDATE_EMPLOYEE", updated);
  },
  async toggleStatus({ commit }, id) {
    await employeeServices.toggleStatus(id);
    commit("TOGGLE_STATUS", id);
  }
};

const getters = {
  employees: state => state.employees,
  getEmployeeById: state => id => state.employees.find(e => e.id === parseInt(id))
};

export default { namespaced: true, state, mutations, actions, getters };
