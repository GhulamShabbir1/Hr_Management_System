// src/services/reportsService.js
import api from './api';

export default {
  // Get all reports with optional filters
  async getReports(filters = {}) {
    try {
      const response = await api.get('/reports', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Generate a specific report
  async generateReport(type, filters = {}) {
    try {
      const response = await api.post(`/reports/generate/${type}`, filters);
      return response;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Export report in different formats
  async exportReport(type, format, filters = {}) {
    try {
      const response = await api.post(`/reports/export/${type}`, {
        format,
        filters
      }, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  },

  // Get attendance report
  async getAttendanceReport(filters = {}) {
    try {
      const response = await api.get('/reports/attendance', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching attendance report:', error);
      throw error;
    }
  },

  // Get leave report
  async getLeaveReport(filters = {}) {
    try {
      const response = await api.get('/reports/leave', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching leave report:', error);
      throw error;
    }
  },

  // Get payroll report
  async getPayrollReport(filters = {}) {
    try {
      const response = await api.get('/reports/payroll', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching payroll report:', error);
      throw error;
    }
  },

  // Get performance report
  async getPerformanceReport(filters = {}) {
    try {
      const response = await api.get('/reports/performance', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching performance report:', error);
      throw error;
    }
  },

  // Get report statistics
  async getReportStats(filters = {}) {
    try {
      const response = await api.get('/reports/stats', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching report statistics:', error);
      throw error;
    }
  },

  // Download report as PDF
  async downloadPDF(type, filters = {}) {
    try {
      const response = await api.post(`/reports/download/${type}/pdf`, filters, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error downloading PDF report:', error);
      throw error;
    }
  },

  // Download report as Excel
  async downloadExcel(type, filters = {}) {
    try {
      const response = await api.post(`/reports/download/${type}/excel`, filters, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error downloading Excel report:', error);
      throw error;
    }
  },

  // Email report
  async emailReport(type, emailData, filters = {}) {
    try {
      const response = await api.post(`/reports/email/${type}`, {
        email: emailData,
        filters
      });
      return response;
    } catch (error) {
      console.error('Error emailing report:', error);
      throw error;
    }
  },

  // Schedule report
  async scheduleReport(scheduleData) {
    try {
      const response = await api.post('/reports/schedule', scheduleData);
      return response;
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  },

  // Get scheduled reports
  async getScheduledReports() {
    try {
      const response = await api.get('/reports/scheduled');
      return response;
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
      throw error;
    }
  },

  // Delete scheduled report
  async deleteScheduledReport(id) {
    try {
      const response = await api.delete(`/reports/scheduled/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
      throw error;
    }
  }
}; 