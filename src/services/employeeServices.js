import api from './apiService';

export default {
  async getAll({ page = 1, limit = 10, search = '', status = '' }) {
    const params = { page, limit, search, status };
    const response = await api.get('/employees', { params });
    return response.data;
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
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  async uploadDocument(id, fileType, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileType);
    
    const response = await api.post(
      `/employees/${id}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  async getDocuments(id) {
    const response = await api.get(`/employees/${id}/documents`);
    return response.data;
  }
};