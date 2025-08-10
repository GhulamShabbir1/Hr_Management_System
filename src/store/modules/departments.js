// // src/store/modules/departments.js
// import departmentServices from '@/services/departmentServices';

// export default {
//   namespaced: true,
//   state: {
//     departments: [],
//     currentDepartment: null,
//     loading: false,
//     error: null,
//     filters: {
//       search: '',
//       status: 'all'
//     }
//   },
//   mutations: {
//     SET_LOADING(state, loading) {
//       state.loading = loading;
//     },
//     SET_ERROR(state, error) {
//       state.error = error;
//     },
//     SET_DEPARTMENTS(state, departments) {
//       state.departments = departments;
//     },
//     SET_CURRENT_DEPARTMENT(state, department) {
//       state.currentDepartment = department;
//     },
//     ADD_DEPARTMENT(state, department) {
//       state.departments.push(department);
//     },
//     UPDATE_DEPARTMENT(state, updatedDepartment) {
//       const index = state.departments.findIndex(dept => dept.id === updatedDepartment.id);
//       if (index !== -1) {
//         state.departments.splice(index, 1, updatedDepartment);
//       }
//     },
//     DELETE_DEPARTMENT(state, departmentId) {
//       state.departments = state.departments.filter(dept => dept.id !== departmentId);
//     },
//     SET_FILTERS(state, filters) {
//       state.filters = { ...state.filters, ...filters };
//     },
//     CLEAR_ERROR(state) {
//       state.error = null;
//     }
//   },
//   actions: {
//     async fetchDepartments({ commit }, filters = {}) {
//       try {
//         commit('SET_LOADING', true);
//         commit('CLEAR_ERROR');
        
//         const response = await departmentServices.getDepartments(filters);
//         commit('SET_DEPARTMENTS', response.data);
        
//         return response;
//       } catch (error) {
//         commit('SET_ERROR', error.message || 'Failed to fetch departments');
//         throw error;
//       } finally {
//         commit('SET_LOADING', false);
//       }
//     },

//     async fetchDepartment({ commit }, id) {
//       try {
//         commit('SET_LOADING', true);
//         commit('CLEAR_ERROR');
        
//         const response = await departmentServices.getDepartment(id);
//         commit('SET_CURRENT_DEPARTMENT', response.data);
        
//         return response;
//       } catch (error) {
//         commit('SET_ERROR', error.message || 'Failed to fetch department');
//         throw error;
//       } finally {
//         commit('SET_LOADING', false);
//       }
//     },

//     async createDepartment({ commit }, departmentData) {
//       try {
//         commit('SET_LOADING', true);
//         commit('CLEAR_ERROR');
        
//         const response = await departmentServices.createDepartment(departmentData);
//         commit('ADD_DEPARTMENT', response.data);
        
//         return response;
//       } catch (error) {
//         commit('SET_ERROR', error.message || 'Failed to create department');
//         throw error;
//       } finally {
//         commit('SET_LOADING', false);
//       }
//     },

//     async updateDepartment({ commit }, { id, data }) {
//       try {
//         commit('SET_LOADING', true);
//         commit('CLEAR_ERROR');
        
//         const response = await departmentServices.updateDepartment(id, data);
//         commit('UPDATE_DEPARTMENT', response.data);
        
//         return response;
//       } catch (error) {
//         commit('SET_ERROR', error.message || 'Failed to update department');
//         throw error;
//       } finally {
//         commit('SET_LOADING', false);
//       }
//     },

//     async deleteDepartment({ commit }, id) {
//       try {
//         commit('SET_LOADING', true);
//         commit('CLEAR_ERROR');
        
//         await departmentServices.deleteDepartment(id);
//         commit('DELETE_DEPARTMENT', id);
        
//         return { success: true };
//       } catch (error) {
//         commit('SET_ERROR', error.message || 'Failed to delete department');
//         throw error;
//       } finally {
//         commit('SET_LOADING', false);
//       }
//     },

//     updateFilters({ commit }, filters) {
//       commit('SET_FILTERS', filters);
//     },

//     clearCurrentDepartment({ commit }) {
//       commit('SET_CURRENT_DEPARTMENT', null);
//     }
//   },
//   getters: {
//     isLoading: state => state.loading,
//     hasError: state => !!state.error,
//     errorMessage: state => state.error,
//     allDepartments: state => state.departments,
//     currentDepartment: state => state.currentDepartment,
//     filters: state => state.filters,
//     getDepartmentById: state => id => state.departments.find(dept => dept.id === id),
//     getActiveDepartments: state => state.departments.filter(dept => dept.status === 'active'),
//     getFilteredDepartments: state => {
//       let filtered = state.departments;
      
//       if (state.filters.search) {
//         const search = state.filters.search.toLowerCase();
//         filtered = filtered.filter(dept => 
//           dept.name.toLowerCase().includes(search) ||
//           dept.description?.toLowerCase().includes(search)
//         );
//       }
      
//       if (state.filters.status && state.filters.status !== 'all') {
//         filtered = filtered.filter(dept => dept.status === state.filters.status);
//       }
      
//       return filtered;
//     }
//   }
// }; 