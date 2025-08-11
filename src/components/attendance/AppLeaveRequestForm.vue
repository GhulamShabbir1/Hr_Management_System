<template>
  <div class="container-fluid p-4">
    <h2 class="h2 text-primary mb-4">Leave Management</h2>

    <!-- Submit Form -->
    <div class="card p-4 mb-4 gradient-blue text-white">
      <h3 class="h5 mb-3">Submit New Leave Request</h3>
      <form @submit.prevent="submitRequest">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Start Date</label>
            <input type="date" v-model="form.startDate" class="form-control" required :min="today"
              @change="validateDates" />
          </div>
          <div class="col-md-3">
            <label class="form-label">End Date</label>
            <input type="date" v-model="form.endDate" class="form-control" required :min="form.startDate || today"
              @change="validateDates" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Type</label>
            <select v-model="form.type" class="form-select" required>
              <option v-for="t in leaveTypes" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Days</label>
            <input type="number" class="form-control" :value="calculatedDays" disabled />
          </div>
          <div class="col-12">
            <label class="form-label">Reason</label>
            <textarea v-model="form.reason" class="form-control" rows="3" required></textarea>
          </div>
          <div class="col-12">
            <button class="btn btn-gradient-primary" type="submit" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Lists -->
    <div class="row">
      <div class="col-lg-7">
        <div class="card p-3">
          <h3 class="h5">Your Leave History</h3>
          <div class="table-responsive">
            <table class="table table-hover align-middle table-modern">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Days</th>
                  <th v-if="canDelete">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in myRequests" :key="r.id || idx">
                  <td>{{ r.startDate }}</td>
                  <td>{{ r.endDate }}</td>
                  <td>{{ r.type }}</td>
                  <td class="text-truncate" style="max-width: 220px;">{{ r.reason }}</td>
                  <td><span class="badge badge-pill" :class="statusBadge(r.status)">{{ r.status }}</span></td>
                  <td>{{ r.days }}</td>
                  <td v-if="canDelete">
                    <button class="btn btn-sm btn-gradient-danger" @click="deleteRequest(r)">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr v-if="myRequests.length === 0">
                  <td colspan="7" class="text-center text-muted py-3">No requests</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="isApprover" class="col-lg-5">
        <div class="card p-3">
          <h3 class="h5">Requests Awaiting Action</h3>
          <div class="table-responsive">
            <table class="table align-middle">
              <thead class="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Period</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in pendingRequests" :key="r.id || idx">
                  <td>{{ employeeName(r.userId) }}</td>
                  <td>{{ r.startDate }} → {{ r.endDate }}</td>
                  <td>{{ r.type }}</td>
                  <td class="d-flex gap-2">
                    <button class="btn btn-sm btn-gradient-success"
                      @click="updateStatus(r, 'approved')">Approve</button>
                    <button class="btn btn-sm btn-gradient-danger" @click="updateStatus(r, 'rejected')">Reject</button>
                  </td>
                </tr>
                <tr v-if="pendingRequests.length === 0">
                  <td colspan="4" class="text-center text-muted py-3">No pending requests</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLeaveRequestForm',
  props: {
    userRole: { type: String, default: null }
  },
  data() {
    return {
      leaveTypes: [
        { value: 'Vacation', label: 'Vacation' },
        { value: 'Sick', label: 'Sick Leave' },
        { value: 'Personal', label: 'Personal' },
        { value: 'Other', label: 'Other' }
      ],
      form: { startDate: '', endDate: '', type: 'Vacation', reason: '' },
      employees: [],
      myRequests: [],
      pendingRequests: [],
      submitting: false,
      loading: false
    };
  },
  computed: {
    today() { return new Date().toISOString().slice(0, 10); },
    currentUserId() { return this.$store.getters['auth/userData']?.id || null; },
    role() { return this.userRole || this.$store.getters['auth/userRole'] || 'Employee'; },
    isApprover() { return ['Admin', 'HR', 'Manager'].includes(this.role); },
    canDelete() { return true; },
    calculatedDays() {
      if (!this.form.startDate || !this.form.endDate) return 0;
      const s = new Date(this.form.startDate), e = new Date(this.form.endDate);
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
      return isNaN(diff) || diff < 0 ? 0 : diff;
    }
  },
  methods: {
    extractErrorMessage(err) {
      const r = err?.response?.data ?? {};
      if (typeof r === 'string') return r;
      if (Array.isArray(r?.message)) return r.message.join(', ');
      if (typeof r?.message === 'string') return r.message;
      if (r?.errors && typeof r.errors === 'object') {
        const parts = [];
        for (const k of Object.keys(r.errors)) {
          const v = r.errors[k];
          parts.push(Array.isArray(v) ? `${k}: ${v.join(', ')}` : `${k}: ${String(v)}`);
        }
        if (parts.length) return parts.join(' | ');
      }
      return err?.message || 'Request failed';
    },
    normalizeEmployee(e) {
      return {
        id: e.id ?? e.user_id ?? e.userId ?? e.employee_id ?? e.employeeId ?? null,
        name: e.name ?? e.full_name ?? e.email ?? `User ${e.id ?? ''}`
      };
    },
    normalizeRequest(r) {
      return {
        id: r.id ?? r.request_id ?? r._id ?? null,
        userId: r.userId ?? r.user_id ?? r.employeeId ?? r.employee_id ?? null,
        startDate: r.start_date ?? r.startDate ?? r.from ?? '',
        endDate: r.end_date ?? r.endDate ?? r.to ?? '',
        type: r.type ?? r.leave_type ?? 'Other',
        reason: r.reason ?? r.message ?? r.description ?? '',
        status: r.status ?? r.approval_status ?? 'Pending',
        days: r.days ?? r.total_days ?? this.diffDays(
          r.start_date ?? r.startDate ?? r.from,
          r.end_date ?? r.endDate ?? r.to
        )
      };
    },
    diffDays(s, e) {
      if (!s || !e) return 0;
      const ds = new Date(s), de = new Date(e);
      const d = Math.round((de - ds) / (1000 * 60 * 60 * 24)) + 1;
      return isNaN(d) || d < 0 ? 0 : d;
    },
    async loadEmployees() {
      try {
        const res = await this.$axios.get('/list-users');
        const payload = res?.data?.data ?? res?.data?.items ?? res?.data ?? [];
        this.employees = (Array.isArray(payload) ? payload : [])
          .map(this.normalizeEmployee)
          .filter(e => e.id != null);
      } catch { this.employees = []; }
    },
    async loadMyRequests() {
      try {
        const res = await this.$axios.get('/leave/my');
        let payload = res?.data?.data ?? res?.data?.items ?? res?.data ?? [];
        let list = Array.isArray(payload) ? payload : [];
        if ((!list || list.length === 0) && this.currentUserId) {
          try {
            const resAll = await this.$axios.get('/list-leaves');
            const p2 = resAll?.data?.data ?? resAll?.data ?? [];
            const all = Array.isArray(p2) ? p2 : [];
            list = all.filter(x => {
              const uid = x.userId ?? x.user_id ?? x.employeeId ?? x.employee_id;
              return String(uid) === String(this.currentUserId);
            });
          } catch { /* ignore */ }
        }
        this.myRequests = (Array.isArray(list) ? list : []).map(this.normalizeRequest);
      } catch {
        this.myRequests = [];
      }
    },
    async loadPending() {
      if (!this.isApprover) { this.pendingRequests = []; return; }
      try {
        const res = await this.$axios.get('/leave/pending');
        let payload = res?.data?.data ?? res?.data?.items ?? res?.data ?? [];
        let list = Array.isArray(payload) ? payload : [];
        if (!list.length) {
          const res2 = await this.$axios.get('/list-leaves');
          const p2 = res2?.data?.data ?? res2?.data ?? [];
          const all = Array.isArray(p2) ? p2 : [];
          list = all.filter(r => String(r.status ?? r.approval_status ?? '').toLowerCase() === 'pending');
        }
        this.pendingRequests = (Array.isArray(list) ? list : []).map(this.normalizeRequest);
      } catch {
        try {
          const res2 = await this.$axios.get('/list-leaves');
          const p2 = res2?.data?.data ?? res2?.data ?? [];
          const all = Array.isArray(p2) ? p2 : [];
          this.pendingRequests = all
            .map(this.normalizeRequest)
            .filter(r => String(r.status).toLowerCase() === 'pending');
        } catch {
          this.pendingRequests = [];
        }
      }
    },
    employeeName(id) {
      const e = this.employees.find(x => String(x.id) === String(id));
      return e ? e.name : `ID ${id}`;
    },
    validateDates() {
      if (this.form.startDate && this.form.endDate && this.form.endDate < this.form.startDate) {
        this.form.endDate = this.form.startDate;
      }
    },
    statusBadge(status) {
      const s = String(status || '').toLowerCase();
      if (s === 'approved') return 'bg-success';
      if (s === 'rejected') return 'bg-danger';
      return 'bg-warning';
    },
    toast(text, type = 'success') {
      if (typeof this.$notify === 'function') this.$notify({ type, title: type === 'error' ? 'Error' : 'Success', text });
      else { if (type === 'error') alert(text); else console.log(text); }
    },
    async submitRequest() {
      this.submitting = true;
      try {
        if (!this.form.startDate || !this.form.endDate) throw new Error('Select dates');

        const start_date = this.form.startDate;
        const end_date = this.form.endDate;
        const reason = this.form.reason;
        const leave_type = this.form.type;
        const days = this.calculatedDays;

        // Try minimal JSON → JSON with leave_type → multipart (some backends are picky)
        const variants = [
          { kind: 'json', body: { start_date, end_date, reason } },
          { kind: 'json', body: { start_date, end_date, reason, leave_type, days } },
          { kind: 'form', body: { start_date, end_date, reason, leave_type, days } }
        ];

        let lastErr = null;
        for (const v of variants) {
          try {
            if (v.kind === 'form') {
              const fd = new FormData();
              Object.entries(v.body).forEach(([k, val]) => fd.append(k, val));
              await this.$axios.post('/leave/request', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
              await this.$axios.post('/leave/request', v.body);
            }
            await Promise.all([this.loadMyRequests(), this.loadPending()]);
            this.form = { startDate: '', endDate: '', type: 'Vacation', reason: '' };
            this.toast('Leave request submitted');
            return;
          } catch (e) {
            lastErr = e;
          }
        }

        const d = lastErr?.response?.data;
        const msg =
          (d?.errors && Object.values(d.errors).flat().join(', ')) ||
          d?.message ||
          lastErr?.message ||
          'Request failed';
        this.toast(msg, 'error');
      } finally {
        this.submitting = false;
      }
    },
    async updateStatus(r, status) {
      try {
        const body = status === 'rejected'
          ? { status, reason: 'Rejected by approver' }
          : { status };
        await this.$axios.put(`/leave/status/${r.id}`, body);
        await Promise.all([this.loadPending(), this.loadMyRequests()]);
        this.toast(`Request ${status}`);
      } catch (e) {
        this.toast(this.extractErrorMessage(e) || 'Action failed', 'error');
      }
    },
    async deleteRequest(r) {
      if (!r?.id) return;
      if (!confirm('Delete this leave request?')) return;
      try {
        await this.$axios.post(`/delete-leave-request/${r.id}`);
        await this.loadMyRequests();
        this.toast('Request deleted');
      } catch (e) {
        this.toast(this.extractErrorMessage(e) || 'Delete failed', 'error');
      }
    }
  },
  async mounted() {
    await Promise.all([this.loadEmployees(), this.loadMyRequests(), this.loadPending()]);
  }
};
</script>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: #fff;
}

/* Optional polish if you added custom.css from earlier */
.table-modern thead th {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: #fff;
  border: 0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.badge-pill {
  border-radius: 999px;
  padding: .45rem .7rem;
  font-weight: 600
}

.btn-gradient-primary {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: #fff;
  border: 0;
}

.btn-gradient-success {
  background: linear-gradient(135deg, #28a745, #38ef7d);
  color: #fff;
  border: 0;
}

.btn-gradient-danger {
  background: linear-gradient(135deg, #dc3545, #ff4b2b);
  color: #fff;
  border: 0;
}
</style>