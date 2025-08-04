import api from './apiService';

export default {
  async getSalaryDetails(employeeId) {
    const response = await api.get(`/payroll/salary/${employeeId}`);
    return response.data;
  },

  async generatePayslip(employeeId, period) {
    const response = await api.get(`/payroll/payslip/${employeeId}`, {
      params: { period },
      responseType: 'blob'
    });
    return response.data;
  },

  async updateSalary(employeeId, salaryData) {
    const response = await api.put(`/payroll/salary/${employeeId}`, salaryData);
    return response.data;
  },

  async getPayrollHistory(employeeId, year) {
    const response = await api.get(`/payroll/history/${employeeId}`, {
      params: { year }
    });
    return response.data;
  },

  async processPayroll(payrollData) {
    const response = await api.post('/payroll/process', payrollData);
    return response.data;
  }
};