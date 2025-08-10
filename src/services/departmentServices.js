// import api from './api';

// export default {
//   // Get all departments with optional filters
//   async getDepartments(filters = {}) {
//     try {
//       const response = await api.get('/departments', { params: filters });
//       return response;
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       throw error;
//     }
//   },

//   // Get a specific department
//   async getDepartment(id) {
//     try {
//       const response = await api.get(`/departments/${id}`);
//       return response;
//     } catch (error) {
//       console.error('Error fetching department:', error);
//       throw error;
//     }
//   },

//   // Get department employees
//   async getDepartmentEmployees(departmentId) {
//     try {
//       const response = await api.get(`/departments/${departmentId}/employees`);
//       return response;
//     } catch (error) {
//       console.error('Error fetching department employees:', error);
//       throw error;
//     }
//   },

//   // Create a new department
//   async createDepartment(departmentData) {
//     try {
//       const response = await api.post('/departments', departmentData);
//       return response;
//     } catch (error) {
//       console.error('Error creating department:', error);
//       throw error;
//     }
//   },

//   // Update a department
//   async updateDepartment(id, departmentData) {
//     try {
//       const response = await api.put(`/departments/${id}`, departmentData);
//       return response;
//     } catch (error) {
//       console.error('Error updating department:', error);
//       throw error;
//     }
//   },

//   // Delete a department
//   async deleteDepartment(id) {
//     try {
//       const response = await api.delete(`/departments/${id}`);
//       return response;
//     } catch (error) {
//       console.error('Error deleting department:', error);
//       throw error;
//     }
//   },

//   // Get department statistics
//   async getDepartmentStats(id) {
//     try {
//       const response = await api.get(`/departments/${id}/stats`);
//       return response;
//     } catch (error) {
//       console.error('Error fetching department statistics:', error);
//       throw error;
//     }
//   }
// };