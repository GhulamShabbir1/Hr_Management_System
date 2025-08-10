// src/store/modules/reports.js
import reportsService from '@/services/reportsService';

export default {
  namespaced: true,
  state: {
    reports: [],
    currentReport: null,
    loading: false,
    error: null,
    filters: {
      dateRange: 'this_month',
      department: '',
      employee: '',
      reportType: ''
    },
    reportTypes: [
      { id: 'attendance', name: 'Attendance Report', icon: 'fas fa-clock' },
      { id: 'leave', name: 'Leave Management Report', icon: 'fas fa-calendar-minus' },
      { id: 'payroll', name: 'Payroll Report', icon: 'fas fa-money-bill-wave' },
      { id: 'performance', name: 'Performance Report', icon: 'fas fa-star' }
    ]
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_REPORTS(state, reports) {
      state.reports = reports;
    },
    SET_CURRENT_REPORT(state, report) {
      state.currentReport = report;
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters };
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },
  actions: {
    async fetchReports({ commit }, filters = {}) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await reportsService.getReports(filters);
        commit('SET_REPORTS', response.data);
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch reports');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async generateReport({ commit }, { type, filters }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await reportsService.generateReport(type, filters);
        commit('SET_CURRENT_REPORT', response.data);
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to generate report');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async exportReport({ commit }, { type, format, filters }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await reportsService.exportReport(type, format, filters);
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to export report');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters);
    },

    clearCurrentReport({ commit }) {
      commit('SET_CURRENT_REPORT', null);
    }
  },
  getters: {
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error,
    allReports: state => state.reports,
    currentReport: state => state.currentReport,
    filters: state => state.filters,
    reportTypes: state => state.reportTypes,
    getReportByType: state => type => state.reports.find(report => report.type === type),
    getFilteredReports: state => {
      let filtered = state.reports;
      
      if (state.filters.reportType) {
        filtered = filtered.filter(report => report.type === state.filters.reportType);
      }
      
      if (state.filters.department) {
        filtered = filtered.filter(report => report.department === state.filters.department);
      }
      
      return filtered;
    }
  }
}; 