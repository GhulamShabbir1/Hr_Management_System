<template>
  <div class="container-fluid p-4">
    <h2 class="mb-4">Attendance Management</h2>

    <div class="card mb-4 p-3 time-card gradient-blue">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <span class="fw-bold me-2">Current Time:</span>
          <span class="h5">{{ currentTime }}</span>
        </div>
        <div>
          <span class="fw-bold me-2">Today's Date:</span>
          <span class="h5">{{ localToday }}</span>
        </div>
      </div>
    </div>

    <div class="d-flex gap-3 mb-4">
      <button @click="checkIn" :disabled="loading || !isAuthenticated" class="btn btn-success px-4 py-2">
        <span v-if="loading && action === 'in'" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi bi-box-arrow-in-right me-2"></i> Check In
      </button>
      <button @click="checkOut" :disabled="loading || !isAuthenticated" class="btn btn-danger px-4 py-2">
        <span v-if="loading && action === 'out'" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi bi-box-arrow-left me-2"></i> Check Out
      </button>
      <button @click="exportToCsv" class="btn btn-primary ms-auto px-4 py-2" :disabled="!filteredRecords.length">
        <i class="bi bi-file-earmark-excel me-2"></i> Export CSV
      </button>
    </div>

    <div class="card p-4 mb-4 summary-card gradient-green text-white">
      <h3 class="h4 mb-3">Today's Attendance</h3>
      <div class="row">
        <div class="col-md-6">
          <p class="mb-1"><strong>Check-in Time:</strong> {{ todayCheckIn || 'Not recorded' }}</p>
          <p class="mb-0">
            <strong>Status:</strong>
            <span class="badge ms-1" :class="todayCheckIn ? 'bg-light text-dark' : 'bg-secondary'">
              {{ todayCheckIn ? 'Checked In' : 'Not Checked In' }}
            </span>
          </p>
        </div>
        <div class="col-md-6">
          <p class="mb-1"><strong>Check-out Time:</strong> {{ todayCheckOut || 'Not recorded' }}</p>
          <p class="mb-0">
            <strong>Status:</strong>
            <span class="badge ms-1" :class="todayCheckOut ? 'bg-light text-dark' : 'bg-secondary'">
              {{ todayCheckOut ? 'Checked Out' : 'Not Checked Out' }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="card p-4 history-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="h4 mb-0">Attendance History</h3>
        <div class="input-group" style="width: 260px;">
          <input v-model="dateFilter" type="date" class="form-control" />
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
            <tr v-for="(r, idx) in filteredRecords"
              :key="`${r.employeeId}-${r.date}-${r.checkInTime || ''}-${r.checkOutTime || ''}-${idx}`">
              <td>{{ r.date }}</td>
              <td>{{ r.checkInTime || '-' }}</td>
              <td>{{ r.checkOutTime || '-' }}</td>
              <td><span class="badge" :class="statusBadge(r.status)">{{ labelStatus(r) }}</span></td>
            </tr>

            <tr v-if="filteredRecords.length === 0">
              <td colspan="4" class="text-center text-muted py-3">No records for selected date</td>
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
      timer: null,
      dateFilter: '',
      loading: false,
      action: ''
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    currentUserId() {
      return this.$store.getters['auth/userData']?.id || null;
    },
    localToday() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    },
    records() {
      return this.$store.getters['attendance/allAttendance'] || [];
    },
    effectiveUserId() {
      // Fallback to the last record’s employeeId if currentUserId is missing
      return this.currentUserId || (this.records.length ? this.records[this.records.length - 1].employeeId : null);
    },
    todayCheckIn() {
      const uid = String(this.effectiveUserId || '');
      const today = this.localToday;
      const todayList = this.records.filter(r => String(r.employeeId) === uid && r.date === today);
      return todayList.length ? (todayList[todayList.length - 1].checkInTime || null) : null;
    },
    todayCheckOut() {
      const uid = String(this.effectiveUserId || '');
      const today = this.localToday;
      const todayList = this.records.filter(r => String(r.employeeId) === uid && r.date === today);
      return todayList.length ? (todayList[todayList.length - 1].checkOutTime || null) : null;
    },
    filteredRecords() {
      const uid = String(this.effectiveUserId || '');
      const base = uid ? this.records.filter(r => String(r.employeeId) === uid) : this.records;
      if (!this.dateFilter) return [...base].sort((a, b) => (a.date > b.date ? -1 : 1));
      return base.filter(r => r.date === this.dateFilter).sort((a, b) => (a.date > b.date ? -1 : 1));
    }
  },
  methods: {
    updateClock() {
      this.currentTime = new Date().toLocaleTimeString();
    },
    async refresh() {
      await this.$store.dispatch('attendance/fetchAttendance');
    },
    async checkIn() {
      this.loading = true; this.action = 'in';
      const res = await this.$store.dispatch('attendance/markAttendance', { employeeId: this.currentUserId, status: 'check-in' });
      this.loading = false; this.action = '';
      await this.refresh();
      if (!res?.success) this.alert('error', res?.message || 'Check-in failed');
    },
    async checkOut() {
      this.loading = true; this.action = 'out';
      const res = await this.$store.dispatch('attendance/markAttendance', { employeeId: this.currentUserId, status: 'check-out' });
      this.loading = false; this.action = '';
      await this.refresh();
      if (!res?.success) this.alert('error', res?.message || 'Check-out failed');
    },
    statusBadge(s) {
      const k = String(s || '').toLowerCase();
      if (k === 'check-in') return 'bg-success';
      if (k === 'check-out') return 'bg-danger';
      return 'bg-secondary';
    },
    labelStatus(r) {
      const k = String(r?.status || '').toLowerCase();
      if (k === 'check-in') return 'Checked In';
      if (k === 'check-out') return 'Checked Out';
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
      a.setAttribute('download', `attendance-${this.effectiveUserId || 'all'}-${this.dateFilter || 'all'}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    alert(type, text) {
      if (typeof this.$notify === 'function') this.$notify({ type, title: type === 'error' ? 'Error' : 'Info', text });
      else if (type === 'error') alert(text); else console.log(text);
    }
  },
  async mounted() {
    this.updateClock();
    this.timer = setInterval(this.updateClock, 1000);
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

.time-card .h5 {
  font-weight: 600;
}

.summary-card .badge {
  font-size: 0.9rem;
}
</style>