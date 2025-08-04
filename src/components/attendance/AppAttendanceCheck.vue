<template>
  <div class="container-fluid p-4">
    <h2 class="mb-4">Attendance Management</h2>

    <!-- Real-time clock and date -->
    <div class="card mb-4 p-3 time-card">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <span class="fw-bold me-2">Current Time:</span>
          <span class="h5">{{ currentTime }}</span>
        </div>
        <div>
          <span class="fw-bold me-2">Today's Date:</span>
          <span class="h5">{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- Check-in / Check-out Buttons -->
    <div class="d-flex gap-3 mb-4">
      <button
        @click="checkIn"
        :disabled="attendance.checkedIn || loading"
        class="btn btn-success px-4 py-2"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi bi-box-arrow-in-right me-2"></i>
        Check In
      </button>
      <button
        @click="checkOut"
        :disabled="!attendance.checkedIn || attendance.checkedOut || loading"
        class="btn btn-danger px-4 py-2"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi bi-box-arrow-left me-2"></i>
        Check Out
      </button>
      <button
        @click="exportToExcel"
        class="btn btn-primary ms-auto px-4 py-2"
      >
        <i class="bi bi-file-earmark-excel me-2"></i>
        Export to Excel
      </button>
    </div>

    <!-- Today's Attendance Summary -->
    <div class="card p-4 mb-4 summary-card">
      <h3 class="h4 mb-3">Today's Attendance Record</h3>
      <div class="row">
        <div class="col-md-6">
          <p><strong>Check-in Time:</strong> {{ attendance.checkInTime || 'Not recorded' }}</p>
          <p><strong>Status:</strong> 
            <span class="badge" :class="attendance.checkedIn ? 'bg-success' : 'bg-secondary'">
              {{ attendance.checkedIn ? 'Checked In' : 'Not Checked In' }}
            </span>
          </p>
        </div>
        <div class="col-md-6">
          <p><strong>Check-out Time:</strong> {{ attendance.checkOutTime || 'Not recorded' }}</p>
          <p><strong>Status:</strong> 
            <span class="badge" :class="attendance.checkedOut ? 'bg-danger' : 'bg-secondary'">
              {{ attendance.checkedOut ? 'Checked Out' : 'Not Checked Out' }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Attendance History Table -->
    <div class="card p-4 history-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="h4 mb-0">Attendance History</h3>
        <div class="input-group" style="width: 250px;">
          <input 
            v-model="dateFilter" 
            type="date" 
            class="form-control"
            @change="fetchAttendanceHistory"
          >
          <button class="btn btn-outline-secondary" type="button">
            <i class="bi bi-calendar"></i>
          </button>
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-primary">
            <tr>
              <th>Date</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in attendanceHistory" :key="index">
              <td>{{ formatDate(record.date) }}</td>
              <td>{{ record.checkInTime || '-' }}</td>
              <td>{{ record.checkOutTime || '-' }}</td>
              <td>
                <span class="badge" :class="getStatusClass(record)">
                  {{ getStatusText(record) }}
                </span>
              </td>
              <td>{{ calculateHours(record) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Success/Error Toast Notification -->
    <AppNotificationToast 
      :show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      @close="showToast = false"
    />
  </div>
</template>

<script>
import axios from 'axios';
import AppNotificationToast from '../announcements/AppNotificationToast.vue';

export default {
  name: "AppAttendanceCheck",
  components: { AppNotificationToast },
  data() {
    return {
      currentTime: "",
      currentDate: "",
      dateFilter: new Date().toISOString().split('T')[0],
      loading: false,
      showToast: false,
      toastMessage: "",
      toastType: "success",
      attendance: {
        checkedIn: false,
        checkedOut: false,
        checkInTime: null,
        checkOutTime: null,
        date: null
      },
      attendanceHistory: []
    };
  },
  created() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
    this.fetchTodayAttendance();
    this.fetchAttendanceHistory();
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
      this.currentDate = now.toLocaleDateString();
    },
    async fetchTodayAttendance() {
      try {
        const response = await axios.get('/api/attendance/today');
        this.attendance = response.data.data || this.attendance;
      } catch (error) {
        this.showNotification('Failed to fetch attendance data', 'error');
      }
    },
    async fetchAttendanceHistory() {
      try {
        const response = await axios.get(`/api/attendance/history?date=${this.dateFilter}`);
        this.attendanceHistory = response.data.data;
      } catch (error) {
        this.showNotification('Failed to fetch attendance history', 'error');
      }
    },
    async checkIn() {
      this.loading = true;
      try {
        const response = await axios.post('/api/attendance/check-in');
        this.attendance = response.data.data;
        this.showNotification('Checked in successfully!');
        this.fetchAttendanceHistory();
      } catch (error) {
        this.showNotification(error.response?.data?.message || 'Check-in failed', 'error');
      } finally {
        this.loading = false;
      }
    },
    async checkOut() {
      this.loading = true;
      try {
        const response = await axios.post('/api/attendance/check-out');
        this.attendance = response.data.data;
        this.showNotification('Checked out successfully!');
        this.fetchAttendanceHistory();
      } catch (error) {
        this.showNotification(error.response?.data?.message || 'Check-out failed', 'error');
      } finally {
        this.loading = false;
      }
    },
    async exportToExcel() {
      try {
        const response = await axios.get('/api/attendance/export', {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `attendance_${this.dateFilter}.xlsx`);
        document.body.appendChild(link);
        link.click();
        this.showNotification('Export started successfully');
      } catch (error) {
        this.showNotification('Export failed', 'error');
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    calculateHours(record) {
      if (!record.checkInTime || !record.checkOutTime) return '-';
      // Implement hours calculation logic
      return '8.5'; // Placeholder
    },
    getStatusClass(record) {
      if (!record.checkInTime) return 'bg-secondary';
      if (!record.checkOutTime) return 'bg-warning';
      return 'bg-success';
    },
    getStatusText(record) {
      if (!record.checkInTime) return 'Absent';
      if (!record.checkOutTime) return 'Pending Check-out';
      return 'Completed';
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
.time-card {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}

.summary-card {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}

.history-card {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.badge {
  padding: 0.5em 0.75em;
}
</style>