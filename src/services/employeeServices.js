import api from './api';

export default {
  async getAll({ 
    page = 1, 
    limit = 10, 
    search = '', 
    status = '', 
    role = '',
    department = '' 
  }) {
    const params = { 
      page, 
      limit, 
      search, 
      status,
      role,
      department
    };
    const response = await api.get('/employees', { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  async getById(id) {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  async create(employeeData) {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  async update(id, employeeData) {
    const response = await api.patch(`/employees/${id}`, employeeData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  async toggleStatus(id) {
    const response = await api.patch(`/employees/${id}/status`);
    return response.data;
  },

  async uploadProfileImage(id, file) {
    const formData = new FormData();
    formData.append('profile_image', file);
    
    const response = await api.post(
      `/employees/${id}/profile-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  async getStatistics() {
    const response = await api.get('/employees/statistics');
    return response.data;
  },

  async exportToExcel(params = {}) {
    const response = await api.get('/employees/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  async getRoles() {
    const response = await api.get('/employees/roles');
    return response.data;
  },

  async getDepartments() {
    const response = await api.get('/employees/departments');
    return response.data;
  }
};