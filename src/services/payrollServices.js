import api from './api';

export default {
  async listPayrolls() {
    const res = await api.get('/payroll/list');
    return res.data;
  },
  async createPayroll(data) {
    const res = await api.post('/payroll', data);
    return res.data;
  },
  async getUserPayroll(userId) {
    const res = await api.get(`/payroll/${userId}`);
    return res.data;
  },
  async generatePayslip(payrollId) {
    const res = await api.post(`/payslips/generate/${payrollId}`, null, { responseType: 'blob' });
    return res.data;
  },
  async downloadPayslip(payslipId) {
    const res = await api.get(`/payslips/download/${payslipId}`, { responseType: 'blob' });
    return res.data;
  }
};