<template>
  <div class="reports-container">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h3 mb-0">Reports Dashboard</h1>
              <p class="text-muted">Generate and view various HR reports</p>
            </div>
            <div class="d-flex gap-2">
                              <button 
                  @click="handleExportReport" 
                  class="btn btn-gradient-primary"
                  :disabled="isLoading"
                >
                <i class="fas fa-download me-2"></i>
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Types -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card card-gradient">
            <div class="card-header card-gradient-header">
              <h5 class="card-title mb-0">Report Types</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-3">
                  <div class="stat-card stat-card-1 animate-hover-grow" @click="selectReport('attendance')">
                    <div class="d-flex align-items-center">
                      <div class="icon-gradient icon-gradient-1">
                        <i class="fas fa-clock"></i>
                      </div>
                      <div class="ms-3">
                        <h6 class="mb-1">Attendance Report</h6>
                        <p class="text-muted mb-0">View attendance statistics</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="stat-card stat-card-2 animate-hover-grow" @click="selectReport('leave')">
                    <div class="d-flex align-items-center">
                      <div class="icon-gradient icon-gradient-2">
                        <i class="fas fa-calendar-minus"></i>
                      </div>
                      <div class="ms-3">
                        <h6 class="mb-1">Leave Report</h6>
                        <p class="text-muted mb-0">Leave management analytics</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="stat-card stat-card-3 animate-hover-grow" @click="selectReport('payroll')">
                    <div class="d-flex align-items-center">
                      <div class="icon-gradient icon-gradient-3">
                        <i class="fas fa-money-bill-wave"></i>
                      </div>
                      <div class="ms-3">
                        <h6 class="mb-1">Payroll Report</h6>
                        <p class="text-muted mb-0">Salary and compensation data</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="stat-card stat-card-4 animate-hover-grow" @click="selectReport('performance')">
                    <div class="d-flex align-items-center">
                      <div class="icon-gradient icon-gradient-4">
                        <i class="fas fa-star"></i>
                      </div>
                      <div class="ms-3">
                        <h6 class="mb-1">Performance Report</h6>
                        <p class="text-muted mb-0">Employee performance metrics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4" v-if="selectedReport">
        <div class="col-12">
          <div class="card card-gradient">
            <div class="card-header card-gradient-header">
              <h5 class="card-title mb-0">Report Filters</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-3">
                  <label class="form-label">Date Range</label>
                  <select v-model="filters.dateRange" class="form-control">
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                    <option value="this_quarter">This Quarter</option>
                    <option value="this_year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Department</label>
                  <select v-model="filters.department" class="form-control">
                    <option value="">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Employee</label>
                  <select v-model="filters.employee" class="form-control">
                    <option value="">All Employees</option>
                    <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                      {{ emp.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">&nbsp;</label>
                  <button @click="handleGenerateReport" class="btn btn-gradient-primary w-100" :disabled="isLoading">
                    <i class="fas fa-search me-2"></i>
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Results -->
      <div class="row" v-if="reportData && selectedReport">
        <div class="col-12">
          <div class="card card-gradient">
            <div class="card-header card-gradient-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">{{ getReportTitle() }}</h5>
              <div class="btn-group">
                <button @click="exportToPDF" class="btn btn-sm btn-outline-light">
                  <i class="fas fa-file-pdf me-1"></i> PDF
                </button>
                <button @click="exportToExcel" class="btn btn-sm btn-outline-light">
                  <i class="fas fa-file-excel me-1"></i> Excel
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-gradient">
                  <thead>
                    <tr>
                      <th v-for="header in reportHeaders" :key="header">{{ header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in reportData" :key="row.id">
                      <td v-for="header in reportHeaders" :key="header">
                        {{ row[header.toLowerCase().replace(/\s+/g, '_')] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="row" v-if="isLoading">
        <div class="col-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Generating report...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AppReports',
  data() {
    return {
      selectedReport: null,
      reportData: null,
      reportHeaders: [],
      employees: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Mike Johnson' }
      ]
    };
  },
  computed: {
    ...mapGetters('reports', [
      'isLoading',
      'hasError',
      'errorMessage',
      'filters',
      'reportTypes',
      'currentReport'
    ])
  },
  methods: {
    ...mapActions('reports', [
      'generateReport',
      'exportReport',
      'updateFilters'
    ]),

    selectReport(type) {
      this.selectedReport = type;
      this.reportData = null;
      this.reportHeaders = [];
    },
    
    getReportTitle() {
      const titles = {
        attendance: 'Attendance Report',
        leave: 'Leave Management Report',
        payroll: 'Payroll Report',
        performance: 'Performance Report'
      };
      return titles[this.selectedReport] || 'Report';
    },
    
    async handleGenerateReport() {
      try {
        await this.generateReport({
          type: this.selectedReport,
          filters: this.filters
        });
        
        // Update local data from store
        if (this.currentReport) {
          this.reportData = this.currentReport.data;
          this.reportHeaders = this.currentReport.headers;
        }
        
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Report generated successfully'
        });
        
      } catch (error) {
        console.error('Error generating report:', error);
        this.$notify({
          type: 'error',
          title: 'Error',
          text: this.errorMessage || 'Failed to generate report'
        });
      }
    },
    
    getMockData() {
      const mockData = {
        attendance: [
          { id: 1, employee_name: 'John Doe', department: 'IT', total_days: 22, present_days: 20, absent_days: 2, attendance_rate: '90.9%' },
          { id: 2, employee_name: 'Jane Smith', department: 'HR', total_days: 22, present_days: 21, absent_days: 1, attendance_rate: '95.5%' },
          { id: 3, employee_name: 'Mike Johnson', department: 'Finance', total_days: 22, present_days: 19, absent_days: 3, attendance_rate: '86.4%' }
        ],
        leave: [
          { id: 1, employee_name: 'John Doe', leave_type: 'Annual', start_date: '2024-01-15', end_date: '2024-01-17', status: 'Approved' },
          { id: 2, employee_name: 'Jane Smith', leave_type: 'Sick', start_date: '2024-01-20', end_date: '2024-01-20', status: 'Approved' },
          { id: 3, employee_name: 'Mike Johnson', leave_type: 'Personal', start_date: '2024-01-25', end_date: '2024-01-26', status: 'Pending' }
        ],
        payroll: [
          { id: 1, employee_name: 'John Doe', basic_salary: '$5000', allowances: '$500', deductions: '$200', net_salary: '$5300' },
          { id: 2, employee_name: 'Jane Smith', basic_salary: '$4500', allowances: '$400', deductions: '$150', net_salary: '$4750' },
          { id: 3, employee_name: 'Mike Johnson', basic_salary: '$4800', allowances: '$450', deductions: '$180', net_salary: '$5070' }
        ],
        performance: [
          { id: 1, employee_name: 'John Doe', department: 'IT', rating: '4.5/5', goals_met: '8/10', overall_score: '85%' },
          { id: 2, employee_name: 'Jane Smith', department: 'HR', rating: '4.8/5', goals_met: '9/10', overall_score: '92%' },
          { id: 3, employee_name: 'Mike Johnson', department: 'Finance', rating: '4.2/5', goals_met: '7/10', overall_score: '78%' }
        ]
      };
      
      return mockData[this.selectedReport] || [];
    },
    
    getReportHeaders() {
      const headers = {
        attendance: ['Employee Name', 'Department', 'Total Days', 'Present Days', 'Absent Days', 'Attendance Rate'],
        leave: ['Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Status'],
        payroll: ['Employee Name', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary'],
        performance: ['Employee Name', 'Department', 'Rating', 'Goals Met', 'Overall Score']
      };
      
      return headers[this.selectedReport] || [];
    },
    
    async handleExportReport() {
      try {
        await this.exportReport({
          type: this.selectedReport,
          format: 'excel',
          filters: this.filters
        });
        
        this.$notify({
          type: 'success',
          title: 'Export',
          text: 'Report exported successfully'
        });
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'Export Error',
          text: this.errorMessage || 'Failed to export report'
        });
      }
    },
    
    async exportToPDF() {
      try {
        await this.exportReport({
          type: this.selectedReport,
          format: 'pdf',
          filters: this.filters
        });
        
        this.$notify({
          type: 'success',
          title: 'PDF Export',
          text: 'Report exported as PDF'
        });
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'Export Error',
          text: this.errorMessage || 'Failed to export PDF'
        });
      }
    },
    
    async exportToExcel() {
      try {
        await this.exportReport({
          type: this.selectedReport,
          format: 'excel',
          filters: this.filters
        });
        
        this.$notify({
          type: 'success',
          title: 'Excel Export',
          text: 'Report exported as Excel'
        });
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'Export Error',
          text: this.errorMessage || 'Failed to export Excel'
        });
      }
    }
  }
};
</script>

<style scoped>
.reports-container {
  padding: 1rem;
}

.gap-2 {
  gap: 0.5rem;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.btn-group .btn {
  margin-left: 0.25rem;
}

.table-gradient {
  border-radius: 10px;
  overflow: hidden;
}

.table-gradient thead th {
  background: var(--gradient-primary);
  color: white;
  border: none;
  font-weight: 600;
}

.table-gradient tbody tr {
  transition: all 0.2s ease;
}

.table-gradient tbody tr:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style> 