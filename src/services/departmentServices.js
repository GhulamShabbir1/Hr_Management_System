import api from './apiService';

export default {
  async getAllDepartments() {
    const response = await api.get('/departments');
    return response.data;
  },

  async getDepartmentEmployees(departmentId) {
    const response = await api.get(`/departments/${departmentId}/employees`);
    return response.data;
  },

  async createDepartment(departmentData) {
    const response = await api.post('/departments', departmentData);
    return response.data;
  },

  async updateDepartment(departmentId, departmentData) {
    const response = await api.put(`/departments/${departmentId}`, departmentData);
    return response.data;
  },

  async deleteDepartment(departmentId) {
    const response = await api.delete(`/departments/${departmentId}`);
    return response.data;
  }
};