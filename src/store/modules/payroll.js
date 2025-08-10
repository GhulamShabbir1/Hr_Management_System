import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    payrolls: []
  },

  mutations: {
    SET_PAYROLL(state, payroll) {
      state.payrolls.push({
        id: payroll['Payroll ID'],
        employeeId: payroll['User ID'],
        basic: parseFloat(payroll['Basic Pay']) || 0,
        bonus: parseFloat(payroll['Bonuses']) || 0,
        netSalary: parseFloat(payroll['Net Salary']) || 0,
        payDate: payroll['Pay Date'] || new Date().toISOString().split('T')[0],
        ...payroll
      });
    },

    SET_PAYROLLS(state, payrolls) {
      state.payrolls = Array.isArray(payrolls)
        ? payrolls.map(p => ({
            id: p['Payroll ID'],
            employeeId: p['User ID'],
            basic: parseFloat(p['Basic Pay']) || 0,
            bonus: parseFloat(p['Bonuses']) || 0,
            netSalary: parseFloat(p['Net Salary']) || 0,
            payDate: p['Pay Date'] || new Date().toISOString().split('T')[0],
            ...p
          }))
        : [];
    },

    UPDATE_PAYROLL(state, updatedPayroll) {
      const index = state.payrolls.findIndex(p => p.id === updatedPayroll['Payroll ID']);
      if (index !== -1) {
        state.payrolls.splice(index, 1, {
          ...state.payrolls[index],
          basic: parseFloat(updatedPayroll['Basic Pay']) || 0,
          bonus: parseFloat(updatedPayroll['Bonuses']) || 0,
          netSalary: parseFloat(updatedPayroll['Net Salary']) || 0,
          payDate: updatedPayroll['Pay Date'] || new Date().toISOString().split('T')[0],
          ...updatedPayroll
        });
      }
    },

    DELETE_PAYROLL(state, id) {
      state.payrolls = state.payrolls.filter(p => p.id !== id);
    }
  },

  actions: {
    async generatePayroll({ commit }, payrollData) {
      try {
        const response = await api.post('/payroll', payrollData);
        commit("SET_PAYROLL", response.data.data);
        return { success: true, data: response.data.data };
      } catch (error) {
        console.error('Payroll creation failed:', error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || 'Payroll creation failed' };
      }
    },

    async fetchPayrolls({ commit }) {
      try {
        const response = await api.get('/payroll/list');
        commit("SET_PAYROLLS", response.data.data || []);
        return { success: true, data: response.data.data, message: response.data.message };
      } catch (error) {
        console.error('Fetching payrolls failed:', error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || 'Fetching payrolls failed' };
      }
    },

    async updatePayroll({ commit }, { id, updatedPayroll }) {
      try {
        const response = await api.put(`/payroll/update/${id}`, updatedPayroll);
        commit("UPDATE_PAYROLL", response.data.data);
        return { success: true, data: response.data.data };
      } catch (error) {
        console.error('Updating payroll failed:', error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || 'Payroll update failed' };
      }
    },

    async deletePayroll({ commit }, id) {
      try {
        await api.post(`/payroll/delete/${id}`);
        commit("DELETE_PAYROLL", id);
        return { success: true };
      } catch (error) {
        console.error('Deleting payroll failed:', error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || 'Payroll deletion failed' };
      }
    }
  },

  getters: {
    getPayrollByEmployee: state => id => {
      return state.payrolls.filter(p => p.employeeId === id);
    },

    getPayrollWithEmployees: (state, getters, rootState) => {
      const employees = rootState.employees?.employees || [];
      return state.payrolls.map(payroll => {
        const employee = employees.find(e => e.id === payroll.employeeId);
        return {
          ...payroll,
          employeeName: employee
            ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
            : 'N/A',
          department: employee?.department || 'N/A',
          formattedDate: payroll.payDate
            ? new Date(payroll.payDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : 'N/A'
        };
      });
    }
  }
};
