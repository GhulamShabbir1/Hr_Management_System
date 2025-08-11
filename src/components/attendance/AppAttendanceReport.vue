<template>
  <div class="container-fluid p-4">
    <h2 class="h2 text-primary mb-4">Attendance Report</h2>

    <!-- Filters -->
    <div class="card p-4 mb-4 gradient-blue text-white">
      <div class="row g-3 align-items-end">
        <div class="col-md-3">
          <label class="form-label">Select Month</label>
          <select v-model.number="selectedMonth" class="form-select">
            <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Select Year</label>
          <select v-model.number="selectedYear" class="form-select">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Employee</label>
          <select v-model="selectedEmployee" class="form-select">
            <option value="">All Employees</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.name }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <button @click="generate" class="btn btn-light w-100" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Generate
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="row mb-4">
      <div class="col-md-3" v-for="i in 4" :key="i">
        <div :class="`stat-card gradient-${i}`">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6 class="text-white-50 mb-1">
                {{ i===1?'Total Records': i===2?'Days Present': i===3?'Days Absent':'Avg. Check-in' }}
              </h6>
              <h4 class="mb-0 text-white">
                {{ i===1? stats.total : i===2? stats.present : i===3? stats.absent : stats.avgCheckIn }}
              </h4>
            </div>
            <div class="stat-icon text-white">
              <i :class="i===1?'bi bi-list':''"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card p-3">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in sortedRows" :key="r.id || idx">
              <td>{{ r.date }}</td>
              <td>{{ employeeName(r.employeeId) }}</td>
              <td>{{ r.checkInTime || '-' }}</td>
              <td>{{ r.checkOutTime || '-' }}</td>
              <td>
                <span class="badge" :class="statusBadge(r.status)">{{ labelStatus(r) }}</span>
              </td>
            </tr>
            <tr v-if="sortedRows.length === 0">
              <td colspan="5" class="text-center text-muted py-3">No data</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-primary" @click="exportCsv" :disabled="!sortedRows.length">
          <i class="bi bi-file-earmark-excel me-2"></i>
          Export CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppAttendanceReport',
  data() {
    const now = new Date();
    return {
      months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      years: Array.from({ length: 6 }, (_, i) => now.getFullYear() - i),
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      selectedEmployee: '',
      employees: [],
      loading: false,
      sortedRows: []
    };
  },
  computed: {
    records() {
      return this.$store.getters['attendance/allAttendance'] || [];
    },
    filtered() {
      const m = this.selectedMonth, y = this.selectedYear;
      return this.records.filter(r => {
        if (!r?.date) return false;
        const d = new Date(r.date);
        return (d.getMonth() + 1) === m && d.getFullYear() === y &&
          (this.selectedEmployee ? String(r.employeeId) === String(this.selectedEmployee) : true);
      });
    },
    stats() {
      const total = this.filtered.length;
      const present = this.filtered.filter(r => String(r.status).toLowerCase() === 'check-in').length;
      const absent = 0;
      const checkInTimes = this.filtered.map(r => r.checkInTime).filter(Boolean);
      const avgCheckIn = checkInTimes.length ? this.averageTime(checkInTimes) : '-';
      return { total, present, absent, avgCheckIn };
    }
  },
  watch: {
    filtered: {
      immediate: true,
      handler(list) {
        this.sortedRows = [...list].sort((a, b) => (a.date > b.date ? -1 : 1));
      }
    },
    selectedMonth() { this.sortedRows = [...this.filtered].sort((a,b)=> (a.date > b.date ? -1 : 1)); },
    selectedYear() { this.sortedRows = [...this.filtered].sort((a,b)=> (a.date > b.date ? -1 : 1)); },
    selectedEmployee() { this.sortedRows = [...this.filtered].sort((a,b)=> (a.date > b.date ? -1 : 1)); }
  },
  methods: {
    async loadEmployees() {
      const res = await this.$axios.get('/list-users');
      const payload = res?.data?.data ?? res?.data?.items ?? res?.data ?? [];
      this.employees = (Array.isArray(payload) ? payload : []).map(e => ({
        id: e.id ?? e.user_id ?? e.userId ?? e.employee_id ?? e.employeeId ?? null,
        name: e.name ?? e.full_name ?? e.email ?? `User ${e.id ?? ''}`
      })).filter(e => e.id != null);
    },
    employeeName(id) {
      const e = this.employees.find(x => String(x.id) === String(id));
      return e ? e.name : `ID ${id}`;
    },
    async generate() {
      this.loading = true;
      try {
        await this.$store.dispatch('attendance/fetchAttendance');
        if (!this.employees.length) await this.loadEmployees();
        this.sortedRows = [...this.filtered].sort((a, b) => (a.date > b.date ? -1 : 1));
      } finally {
        this.loading = false;
      }
    },
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
    exportCsv() {
      const headers = ['Date', 'Employee', 'Check-in', 'Check-out', 'Status'];
      const rows = this.sortedRows.map(r => [
        r.date,
        this.employeeName(r.employeeId),
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
      a.setAttribute('download', `attendance-report-${this.selectedYear}-${String(this.selectedMonth).padStart(2,'0')}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    averageTime(times) {
      const toSeconds = t => {
        const [h, m, s] = String(t).split(':').map(Number);
        return ((h || 0) * 3600) + ((m || 0) * 60) + (s || 0);
      };
      const sec = times.map(toSeconds);
      const avg = Math.round(sec.reduce((a,b)=>a+b,0) / sec.length);
      const h = Math.floor(avg / 3600), m = Math.floor((avg % 3600) / 60), s = avg % 60;
      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
  },
  async mounted() {
    await Promise.all([
      this.$store.dispatch('attendance/fetchAttendance'),
      this.loadEmployees()
    ]);
    this.sortedRows = [...this.filtered].sort((a, b) => (a.date > b.date ? -1 : 1));
  }
};
</script>

<style scoped>
.gradient-blue { background: linear-gradient(135deg, #3a7bd5, #00d2ff); color: #fff; }
.stat-card { border-radius: 10px; }
.gradient-1 { background: linear-gradient(135deg, #3a7bd5, #00d2ff); }
.gradient-2 { background: linear-gradient(135deg, #11998e, #38ef7d); }
.gradient-3 { background: linear-gradient(135deg, #f46b45, #eea849); }
.gradient-4 { background: linear-gradient(135deg, #ff416c, #ff4b2b); }
</style>