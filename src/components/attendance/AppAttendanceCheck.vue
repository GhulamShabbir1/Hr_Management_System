<template>
  <div class="container-fluid p-4">
    <h2 class="mb-4">Attendance Management</h2>

    <!-- Real-time clock and date -->
    <div class="card mb-4 p-3 time-card gradient-blue">
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
        :disabled="hasCheckedIn || loading || !currentUserId"
        class="btn btn-success px-4 py-2"
      >
        <span v-if="loading && action==='in'" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi bi-box-arrow-in-right me-2"></i>
        Check In
      </button>
      <button
        @click="checkOut"
        :disabled="!hasCheckedIn || hasCheckedOut || loading || !currentUserId"
        class="btn btn-danger px-4 py-2"
      >
        <span v-if="loading && action==='out'" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi bi-box-arrow-left me-2"></i>
        Check Out
      </button>
      <button
        @click="exportToCsv"
        class="btn btn-primary ms-auto px-4 py-2"
        :disabled="!Array.isArray(records) || !records.length"
      >
        <i class="bi bi-file-earmark-excel me-2"></i>
        Export CSV
      </button>
    </div>

    <!-- Today's Attendance Summary -->
    <div class="card p-4 mb-4 summary-card gradient-green text-white">
      <h3 class="h4 mb-3">Today's Attendance</h3>
      <div class="row">
        <div class="col-md-6">
          <p class="mb-1"><strong>Check-in Time:</strong> {{ todayCheckIn || 'Not recorded' }}</p>
          <p class="mb-0">
            <strong>Status:</strong>
            <span class="badge ms-1" :class="hasCheckedIn ? 'bg-light text-dark' : 'bg-secondary'">
              {{ hasCheckedIn ? 'Checked In' : 'Not Checked In' }}
            </span>
          </p>
        </div>
        <div class="col-md-6">
          <p class="mb-1"><strong>Check-out Time:</strong> {{ todayCheckOut || 'Not recorded' }}</p>
          <p class="mb-0">
            <strong>Status:</strong>
            <span class="badge ms-1" :class="hasCheckedOut ? 'bg-light text-dark' : 'bg-secondary'">
              {{ hasCheckedOut ? 'Checked Out' : 'Not Checked Out' }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Attendance History Table -->
    <div class="card p-4 history-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="h4 mb-0">Attendance History</h3>
        <div class="input-group" style="width: 260px;">
          <input
            v-model="dateFilter"
            type="date"
            class="form-control"
            @change="applyDateFilter"
          />
          <button class="btn btn-outline-secondary" type="button">
            <i class="bi bi-calendar"></i>
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Date</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in filteredRecords" :key="r.id || idx">
              <td>{{ r.date }}</td>
              <td>{{ r.checkInTime || '-' }}</td>
              <td>{{ r.checkOutTime || '-' }}</td>
              <td>
                <span class="badge" :class="statusBadge(r.status)">{{ labelStatus(r) }}</span>
              </td>
            </tr>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="4" class="text-center text-muted py-3">
                No records for selected date
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'AppAttendanceCheck',
  data() {
    return {
      currentTime: '',
      currentDate: new Date().toISOString().slice(0, 10),
      timer: null,
      dateFilter: new Date().toISOString().slice(0, 10),
      loading: false,
      action: '' // 'in' | 'out'
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters['auth/userData'] || {};
    },
    currentUserId() {
      return this.currentUser?.id || null;
    },
    records() {
      return this.$store.getters['attendance/allAttendance'] || [];
    },
    todayRecord() {
      const today = this.currentDate;
      const byUser = this.records.filter(r => String(r.employeeId) === String(this.currentUserId));
      const todayList = byUser.filter(r => r.date === today);
      return todayList.length ? todayList[todayList.length - 1] : null;
    },
    todayCheckIn() {
      return this.todayRecord?.checkInTime || null;
    },
    todayCheckOut() {
      return this.todayRecord?.checkOutTime || null;
    },
    hasCheckedIn() {
      return !!this.todayCheckIn;
    },
    hasCheckedOut() {
      return !!this.todayCheckOut;
    },
    filteredRecords() {
      const userId = String(this.currentUserId || '');
      const df = this.dateFilter;
      return this.records
        .filter(r => String(r.employeeId) === userId)
        .filter(r => (df ? r.date === df : true))
        .sort((a, b) => (a.date > b.date ? -1 : 1));
    }
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
      this.currentDate = now.toISOString().slice(0, 10);
    },
    async refresh() {
      await this.$store.dispatch('attendance/fetchAttendance');
    },
    async checkIn() {
      if (!this.currentUserId) return;
      this.loading = true;
      this.action = 'in';
      const res = await this.$store.dispatch('attendance/markAttendance', {
        employeeId: this.currentUserId,
        status: 'check-in'
      });
      this.loading = false;
      this.action = '';
      if (!res?.success) {
        this.notify('error', res?.message || 'Check-in failed');
      } else {
        await this.refresh();
      }
    },
    async checkOut() {
      if (!this.currentUserId) return;
      this.loading = true;
      this.action = 'out';
      const res = await this.$store.dispatch('attendance/markAttendance', {
        employeeId: this.currentUserId,
        status: 'check-out'
      });
      this.loading = false;
      this.action = '';
      if (!res?.success) {
        this.notify('error', res?.message || 'Check-out failed');
      } else {
        await this.refresh();
      }
    },
    applyDateFilter() {},
    statusBadge(status) {
      const s = String(status || '').toLowerCase();
      if (s === 'check-in') return 'bg-success';
      if (s === 'check-out') return 'bg-danger';
      return 'bg-secondary';
    },
    labelStatus(r) {
      const s = String(r?.status || '').toLowerCase();
      if (s === 'check-in') return 'Checked In';
      if (s === 'check-out') return 'Checked Out';
      return 'Unknown';
    },
    exportToCsv() {
      const headers = ['Date', 'Check-in', 'Check-out', 'Status'];
      const rows = this.filteredRecords.map(r => [
        r.date,
        r.checkInTime || '',
        r.checkOutTime || '',
        this.labelStatus(r)
      ]);
      const csv = [headers.join(','), ...rows.map(row =>
        row.map(v => {
          const s = String(v ?? '');
          return s.includes(',') ? `"${s.replace(/"/g, '""')}"` : s;
        }).join(',')
      )].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `attendance-${this.currentUserId}-${this.dateFilter || 'all'}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    notify(type, text) {
      if (typeof this.$notify === 'function') {
        this.$notify({ type, title: type === 'error' ? 'Error' : 'Info', text });
      } else if (type === 'error') {
        alert(text);
      } else {
        console.log(text);
      }
    }
  },
  async mounted() {
    this.updateDateTime();
    this.timer = setInterval(this.updateDateTime, 1000);
    await this.refresh();
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
};
</script>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: #fff;
}
.gradient-green {
  background: linear-gradient(135deg, #11998e, #38ef7d);
  color: #fff;
}
.time-card .h5 { font-weight: 600; }
.summary-card .badge { font-size: 0.9rem; }
</style>