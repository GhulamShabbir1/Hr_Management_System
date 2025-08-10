// src/store/modules/employees.js
import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    employees: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
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
    DELETE_EMPLOYEE(state, id) {
      state.employees = state.employees.filter(e => e.id !== id);
    },
    TOGGLE_EMPLOYEE_STATUS(state, id) {
      const employee = state.employees.find(e => e.id === id);
      if (employee) {
        employee.status = employee.status === "active" ? "inactive" : "active";
      }
    }
  },
  actions: {
    // Fetch all employees
    async fetchEmployees({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);

        const response = await api.get('/list-users');
        console.log('Employees API Response:', response.data.data.data);

        const employees = response.data.data.data || [];
        commit('SET_EMPLOYEES', employees);

      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message || 'Failed to fetch employees');
        console.error('API Error:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Add a new employee
    async addEmployee({ commit }, employeeData) {
      try {
        const response = await api.post('/add-user', employeeData);
        console.log('Employee added:', response.data.data.data);
        commit('ADD_EMPLOYEE', response.data.data.data);
      } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
      }
    },

    // Update an employee
    // Update an employee
async updateEmployee({ commit }, updatedEmployee) {
  try {
    const response = await api.post(`/update-user/${updatedEmployee.id}`, updatedEmployee, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    console.log('Update Employee API Response:', response.data);

    // Try to get updated employee object from response, fallback to original
    const updatedData = response.data?.data?.data || updatedEmployee;

    // Commit only if updatedData has an id
    if (updatedData && updatedData.id) {
      commit('UPDATE_EMPLOYEE', updatedData);
    } else {
      console.warn('No updated employee data returned. Using input data.');
      commit('UPDATE_EMPLOYEE', updatedEmployee);
    }

  } catch (error) {
    console.error('Error updating employee:', error.response?.data || error);
    throw error;
  }
},


    // Delete an employee
    async deleteEmployee({ commit }, id) {
      try {
        await api.post(`/delete-user/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        commit('DELETE_EMPLOYEE', id);
      } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
      }
    }
  },
  getters: {
    employees: state => state.employees || [],
    allEmployees: state => Array.isArray(state.employees) ? state.employees : [],
    activeEmployees: state =>
      Array.isArray(state.employees)
        ? state.employees.filter(e => e.is_active)
        : [],
    getByDepartment: state => dept =>
      Array.isArray(state.employees)
        ? state.employees.filter(e => e.department === dept)
        : [],
    isLoading: state => state.loading,
    error: state => state.error
  }
};
