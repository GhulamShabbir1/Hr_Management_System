<template>
  <div class="container-fluid p-4">
    <h2 class="h2 text-primary mb-4">Attendance Report</h2>

    <!-- Filters Card -->
    <div class="card p-4 mb-4 filter-card">
      <div class="row g-3 align-items-end">
        <div class="col-md-3">
          <label class="form-label">Select Month</label>
          <select v-model="selectedMonth" class="form-select">
            <option v-for="(m, i) in months" :key="i" :value="i + 1">
              {{ m }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Select Year</label>
          <select v-model="selectedYear" class="form-select">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Department</label>
          <select v-model="selectedDept" class="form-select">
            <option value="all">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <button
            @click="fetchReport"
            class="btn btn-primary w-100"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card stat-card stat-card-1 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="text-muted">Total Employees</h6>
                <h4 class="mb-0">{{ stats.totalEmployees }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-people-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card stat-card-2 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="text-muted">Average Attendance</h6>
                <h4 class="mb-0">{{ stats.avgAttendance }}%</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-calendar-check"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card stat-card-3 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="text-muted">Total Absent</h6>
                <h4 class="mb-0">{{ stats.totalAbsent }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-calendar-x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card stat-card-4 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="text-muted">Total Leaves</h6>
                <h4 class="mb-0">{{ stats.totalLeaves }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-file-earmark-text"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Table -->
    <div class="card p-4">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-primary">
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Total Days</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Leaves</th>
              <th>Attendance %</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="filteredReport.length > 0">
              <tr v-for="record in filteredReport" :key="record.id">
                <td>{{ record.name || 'N/A' }}</td>
                <td>{{ record.department || 'N/A' }}</td>
                <td>{{ Number(record.totalDays || 0) }}</td>
                <td>{{ Number(record.present || 0) }}</td>
                <td>{{ Number(record.absent || 0) }}</td>
                <td>{{ Number(record.leaves || 0) }}</td>
                <td>
                  <div class="progress" style="height: 20px;">
                    <div
                      class="progress-bar"
                      :class="getPercentageClass(record)"
                      :style="{ width: attendancePercentage(record) + '%' }"
                      role="progressbar"
                      :aria-valuenow="attendancePercentage(record)"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {{ attendancePercentage(record) }}%
                    </div>
                  </div>
                </td>
                <td>
                  <button
                    @click="viewDetails(record)"
                    class="btn btn-sm btn-outline-primary"
                    aria-label="View details"
                  >
                    <i class="bi bi-eye"></i> Details
                  </button>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="8" class="text-center py-4">
                <div class="text-muted">
                  <i class="bi bi-exclamation-circle fs-1"></i>
                  <p class="mt-2">No attendance records found</p>
                  <button class="btn btn-sm btn-outline-primary" @click="resetFilters">
                    Reset Filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage" :disabled="currentPage === 1">
              &laquo;
            </button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Export Button -->
    <div class="d-flex justify-content-end mt-3">
      <button
        @click="exportToExcel"
        class="btn btn-success"
        :disabled="loadingExport || filteredReport.length === 0"
      >
        <span v-if="loadingExport" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi bi-file-earmark-excel me-2"></i> Export to Excel
      </button>
    </div>

    <!-- Employee Details Modal -->
    <div class="modal fade" id="employeeDetailsModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Attendance Details</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedEmployee">
              <h4>{{ selectedEmployee.name }}</h4>
              <p class="text-muted">{{ selectedEmployee.department }}</p>

              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(day, index) in selectedEmployee.dailyAttendance" :key="index">
                    <td>{{ day.date }}</td>
                    <td>{{ day.checkIn || '-' }}</td>
                    <td>{{ day.checkOut || '-' }}</td>
                    <td>
                      <span class="badge" :class="getStatusClass(day)">
                        {{ getStatusText(day) }}
                      </span>
                    </td>
                    <td>{{ day.hours || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <AppNotificationToast
      :show="showToast"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import AppNotificationToast from '@/components/announcements/AppNotificationToast.vue';

export default {
  name: 'AppAttendanceReport',
  components: { AppNotificationToast },
  data() {
    const currentYear = new Date().getFullYear();
    return {
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: currentYear,
      selectedDept: 'all',
      months: [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
      ],
      years: Array.from({ length: 5 }, (_, i) => currentYear - 2 + i),
      departments: [
        { id: 1, name: 'HR' },
        { id: 2, name: 'IT' },
        { id: 3, name: 'Finance' },
        { id: 4, name: 'Operations' }
      ],
      attendanceReport: [],
      filteredReport: [],
      loading: false,
      loadingExport: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      stats: {
        totalEmployees: 0,
        avgAttendance: 0,
        totalAbsent: 0,
        totalLeaves: 0
      },
      currentPage: 1,
      perPage: 10,
      totalRecords: 0,
      selectedEmployee: null,
      detailsModal: null
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.totalRecords / this.perPage));
    }
  },
  watch: {
    selectedMonth() { this.currentPage = 1; },
    selectedYear() { this.currentPage = 1; },
    selectedDept() { this.currentPage = 1; }
  },
  mounted() {
    this.detailsModal = new Modal(document.getElementById('employeeDetailsModal'));
    this.fetchReport();
  },
  methods: {
    async fetchReport() {
      this.loading = true;
      try {
        const params = {
          month: this.selectedMonth,
          year: this.selectedYear,
          department: this.selectedDept !== 'all' ? this.selectedDept : null,
          page: this.currentPage,
          per_page: this.perPage
        };

        const response = await this.$axios.get('/attendances', { params });
        const payload = response?.data?.data ?? response?.data ?? [];
        const list = Array.isArray(payload) ? payload : [];

        // If backend returns aggregated records, use as-is; else default fields to 0
        this.attendanceReport = list.map((r) => ({
          id: r.id || r.userId || r.employeeId || Math.random().toString(36).slice(2),
          name: r.name || r.userName || r.employeeName || 'Unknown',
          department: r.department || r.dept || 'N/A',
          totalDays: Number(r.totalDays || r.days || 0),
          present: Number(r.present || r.totalPresent || 0),
          absent: Number(r.absent || r.totalAbsent || 0),
          leaves: Number(r.leaves || r.totalLeaves || 0)
        }));

        this.filteredReport = this.attendanceReport;
        // If meta exists, use it; otherwise compute from array length
        this.totalRecords = response?.data?.meta?.total ?? this.filteredReport.length;
        this.calculateStats();
        this.showNotification('Report generated successfully');
      } catch (error) {
        this.showNotification(error?.response?.data?.message || 'Failed to fetch report', 'error');
        this.resetStats();
        this.filteredReport = [];
        this.totalRecords = 0;
      } finally {
        this.loading = false;
      }
    },
    calculateStats() {
      if (!Array.isArray(this.filteredReport) || this.filteredReport.length === 0) {
        this.resetStats();
        return;
      }
      const list = this.filteredReport;
      this.stats.totalEmployees = list.length;
      this.stats.totalAbsent = list.reduce((sum, r) => sum + Number(r.absent || 0), 0);
      this.stats.totalLeaves = list.reduce((sum, r) => sum + Number(r.leaves || 0), 0);

      const totalPercentage = list.reduce((sum, r) => sum + Number(this.attendancePercentage(r)), 0);
      this.stats.avgAttendance = (totalPercentage / list.length).toFixed(1);
    },
    resetStats() {
      this.stats = {
        totalEmployees: 0,
        avgAttendance: 0,
        totalAbsent: 0,
        totalLeaves: 0
      };
    },
    resetFilters() {
      this.selectedMonth = new Date().getMonth() + 1;
      this.selectedYear = new Date().getFullYear();
      this.selectedDept = 'all';
      this.currentPage = 1;
      this.fetchReport();
    },
    attendancePercentage(record) {
      const total = Number(record.totalDays || 0);
      const present = Number(record.present || 0);
      if (total === 0) return 0;
      return ((present / total) * 100).toFixed(1);
    },
    getPercentageClass(record) {
      const percentage = Number(this.attendancePercentage(record));
      if (percentage >= 90) return 'bg-success';
      if (percentage >= 70) return 'bg-warning';
      return 'bg-danger';
    },
    async exportToExcel() {
      this.loadingExport = true;
      try {
        if (!Array.isArray(this.filteredReport) || this.filteredReport.length === 0) {
          this.showNotification('No data to export', 'warning');
          return;
        }

        const headers = ['Employee', 'Department', 'Total Days', 'Present', 'Absent', 'Leaves', 'Attendance %'];
        const csvContent = [
          headers.join(','),
          ...this.filteredReport.map(r => [
            r.name || 'N/A',
            r.department || 'N/A',
            Number(r.totalDays || 0),
            Number(r.present || 0),
            Number(r.absent || 0),
            Number(r.leaves || 0),
            this.attendancePercentage(r)
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `attendance_report_${this.selectedMonth}_${this.selectedYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Export completed');
      } catch (error) {
        this.showNotification(error?.response?.data?.message || 'Export failed', 'error');
      } finally {
        this.loadingExport = false;
      }
    },
    async viewDetails(employee) {
      try {
        this.selectedEmployee = null;
        this.detailsModal.show();

        const response = await this.$axios.get('/attendances', {
          params: {
            userId: employee.id,
            month: this.selectedMonth,
            year: this.selectedYear
          }
        });
        const payload = response?.data?.data ?? response?.data ?? [];
        const list = Array.isArray(payload) ? payload : [];

        // Build daily attendance list
        const dailyAttendance = list.map((it) => {
          const date = it.date || (it.checkIn || it.check_in) || it.created_at || '';
          const dateStr = date ? new Date(date).toISOString().slice(0, 10) : '';
          const checkIn = it.checkIn || it.check_in || it.checkin_time || it.check_in_time || null;
          const checkOut = it.checkOut || it.check_out || it.checkout_time || it.check_out_time || null;

          const hours = (() => {
            const parse = (v) => {
              if (!v) return null;
              const dt = new Date(v);
              if (!isNaN(dt)) return dt;
              return new Date(`1970-01-01T${v}`);
            };
            const inDt = parse(checkIn);
            const outDt = parse(checkOut);
            if (!inDt || !outDt || isNaN(inDt) || isNaN(outDt)) return '-';
            const diff = (outDt - inDt) / (1000 * 60 * 60);
            return diff > 0 ? diff.toFixed(2) : '-';
          })();

          const status = checkIn ? (checkOut ? 'present' : 'pending') : 'absent';

          return { date: dateStr, checkIn, checkOut, status, hours };
        });

        this.selectedEmployee = {
          id: employee.id,
          name: employee.name || 'Unknown',
          department: employee.department || 'N/A',
          dailyAttendance
        };
      } catch (error) {
        this.showNotification('Failed to load employee details', 'error');
        this.detailsModal.hide();
      }
    },
    getStatusClass(day) {
      if (day.status === 'present') return 'bg-success';
      if (day.status === 'leave') return 'bg-info';
      if (day.status === 'pending') return 'bg-warning';
      if (day.status === 'holiday') return 'bg-secondary';
      return 'bg-danger'; // absent
    },
    getStatusText(day) {
      return day.status ? day.status.charAt(0).toUpperCase() + day.status.slice(1) : 'Unknown';
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchReport();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchReport();
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchReport();
    },
    showNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
    }
  }
};
</script>

<style scoped>
.filter-card {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.stat-card {
  border: none;
  border-radius: 0.5rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-card-1 {
  background-color: #e3f2fd;
}

.stat-card-2 {
  background-color: #e8f5e9;
}

.stat-card-3 {
  background-color: #fff3e0;
}

.stat-card-4 {
  background-color: #f3e5f5;
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.7;
}

.progress {
  min-width: 100px;
  background-color: #e9ecef;
}

.table th {
  white-space: nowrap;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.btn-export {
  transition: all 0.3s;
}

.btn-export:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  border-bottom: none;
}

.modal-footer {
  border-top: none;
}
</style>