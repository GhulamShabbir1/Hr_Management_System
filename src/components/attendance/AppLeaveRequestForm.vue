<template>
  <div class="container-fluid p-4">
    <h2 class="h2 text-primary mb-4">Leave Management</h2>

    <!-- Employee View: Submit Leave Request -->
    <div v-if="isEmployee">
      <div class="card p-4 mb-4 employee-card">
        <h3 class="h4 mb-3">Submit New Leave Request</h3>
        <form @submit.prevent="submitRequest">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Start Date</label>
              <input
                type="date"
                v-model="newRequest.startDate"
                required
                :min="today"
                class="form-control"
                @change="validateDates"
              >
            </div>
            <div class="col-md-6">
              <label class="form-label">End Date</label>
              <input
                type="date"
                v-model="newRequest.endDate"
                required
                :min="newRequest.startDate || today"
                class="form-control"
                @change="validateDates"
              >
            </div>
            <div class="col-12">
              <label class="form-label">Leave Type</label>
              <select v-model="newRequest.type" class="form-select" required>
                <option value="Vacation">Vacation</option>
                <option value="Sick">Sick Leave</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Reason</label>
              <textarea
                v-model="newRequest.reason"
                required
                class="form-control"
                rows="3"
                placeholder="Please provide details for your leave request"
              ></textarea>
            </div>
            <div class="col-12">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Submit Request
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="card p-4 employee-history">
        <h3 class="h4 mb-3">Your Leave History</h3>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-primary">
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Days</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in employeeRequests" :key="req.id">
                <td>{{ formatDate(req.startDate) }}</td>
                <td>{{ formatDate(req.endDate) }}</td>
                <td>{{ req.type }}</td>
                <td>{{ req.reason }}</td>
                <td>
                  <span class="badge" :class="statusClass(req)">
                    {{ req.status }}
                  </span>
                </td>
                <td>{{ calculateDays(req.startDate, req.endDate) }}</td>
              </tr>
              <tr v-if="employeeRequests.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  <i class="bi bi-calendar-x fs-4"></i>
                  <p class="mt-2 mb-0">No leave requests found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- HR/Admin/Manager View: Approve/Reject Requests -->
    <div v-if="isHR">
      <div class="card p-4 mb-4 hr-pending">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="h4 mb-0">Pending Approval</h3>
          <div class="input-group" style="width: 250px;">
            <input
              type="text"
              v-model="searchQuery"
              class="form-control"
              placeholder="Search employee..."
            >
            <button class="btn btn-outline-secondary" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-primary">
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in filteredPendingRequests" :key="req.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar me-2">
                      {{ getInitials(req.employeeName) }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ req.employeeName }}</div>
                      <small class="text-muted">{{ req.employeeDept }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ req.type }}</td>
                <td>
                  {{ formatDate(req.startDate) }}<br>
                  to<br>
                  {{ formatDate(req.endDate) }}
                </td>
                <td>{{ calculateDays(req.startDate, req.endDate) }}</td>
                <td>{{ truncateText(req.reason, 30) }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <button
                      @click="showDetailsModal(req)"
                      class="btn btn-sm btn-outline-primary"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      @click="updateRequestStatus(req.id, 'Approved')"
                      class="btn btn-sm btn-success"
                    >
                      Approve
                    </button>
                    <button
                      @click="updateRequestStatus(req.id, 'Rejected')"
                      class="btn btn-sm btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPendingRequests.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  <i class="bi bi-check-circle fs-4"></i>
                  <p class="mt-2 mb-0">No pending requests found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card p-4 hr-all">
        <h3 class="h4 mb-3">All Leave Requests</h3>
        <div class="mb-3 d-flex justify-content-between align-items-center">
          <div class="d-flex gap-2">
            <select v-model="statusFilter" class="form-select" style="width: 150px;">
              <option value="all">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select v-model="typeFilter" class="form-select" style="width: 150px;">
              <option value="all">All Types</option>
              <option value="Vacation">Vacation</option>
              <option value="Sick">Sick</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            @click="exportLeaveReport"
            class="btn btn-outline-primary"
            :disabled="filteredLeaveRequests.length === 0"
          >
            <i class="bi bi-download me-2"></i> Export
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-primary">
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in filteredLeaveRequests" :key="req.id">
                <td>{{ req.employeeName }}</td>
                <td>{{ req.type }}</td>
                <td>
                  {{ formatDate(req.startDate) }}<br>
                  to<br>
                  {{ formatDate(req.endDate) }}
                </td>
                <td>{{ calculateDays(req.startDate, req.endDate) }}</td>
                <td>
                  <span class="badge" :class="statusClass(req)">
                    {{ req.status }}
                  </span>
                </td>
                <td>
                  <button
                    @click="showDetailsModal(req)"
                    class="btn btn-sm btn-outline-primary"
                  >
                    View
                  </button>
                </td>
              </tr>
              <tr v-if="filteredLeaveRequests.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  <i class="bi bi-database fs-4"></i>
                  <p class="mt-2 mb-0">No leave requests found</p>
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
    </div>

    <!-- Leave Request Details Modal -->
    <div class="modal fade" id="leaveDetailsModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Leave Request Details</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedRequest">
            <div class="row mb-4">
              <div class="col-md-6">
                <h6 class="text-muted">Employee Information</h6>
                <div class="d-flex align-items-center mb-3">
                  <div class="avatar-lg me-3">
                    {{ getInitials(selectedRequest.employeeName) }}
                  </div>
                  <div>
                    <h4 class="mb-0">{{ selectedRequest.employeeName }}</h4>
                    <p class="text-muted mb-0">{{ selectedRequest.employeeDept }}</p>
                    <p class="text-muted mb-0">{{ selectedRequest.employeeEmail }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted">Leave Details</h6>
                <div class="mb-2">
                  <span class="fw-bold">Type:</span>
                  {{ selectedRequest.type }}
                </div>
                <div class="mb-2">
                  <span class="fw-bold">Status:</span>
                  <span class="badge" :class="statusClass(selectedRequest)">
                    {{ selectedRequest.status }}
                  </span>
                </div>
                <div class="mb-2">
                  <span class="fw-bold">Duration:</span>
                  {{ calculateDays(selectedRequest.startDate, selectedRequest.endDate) }} days
                </div>
                <div>
                  <span class="fw-bold">Submitted:</span>
                  {{ formatDateTime(selectedRequest.createdAt) }}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="card mb-4">
                  <div class="card-header bg-light">
                    <h6 class="mb-0">Dates</h6>
                  </div>
                  <div class="card-body">
                    <div class="mb-2">
                      <span class="fw-bold">Start Date:</span>
                      {{ formatDate(selectedRequest.startDate) }}
                    </div>
                    <div>
                      <span class="fw-bold">End Date:</span>
                      {{ formatDate(selectedRequest.endDate) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header bg-light">
                    <h6 class="mb-0">Approval</h6>
                  </div>
                  <div class="card-body">
                    <div v-if="selectedRequest.status !== 'Pending'" class="mb-2">
                      <span class="fw-bold">Status:</span>
                      {{ selectedRequest.status }} by {{ selectedRequest.approvedBy || 'HR' }}
                    </div>
                    <div v-if="selectedRequest.status !== 'Pending'">
                      <span class="fw-bold">Date:</span>
                      {{ formatDateTime(selectedRequest.updatedAt) }}
                    </div>
                    <div v-if="selectedRequest.status === 'Pending'" class="d-flex gap-2">
                      <button
                        @click="updateRequestStatus(selectedRequest.id, 'Approved')"
                        class="btn btn-success"
                      >
                        Approve
                      </button>
                      <button
                        @click="updateRequestStatus(selectedRequest.id, 'Rejected')"
                        class="btn btn-danger"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-header bg-light">
                <h6 class="mb-0">Reason</h6>
              </div>
              <div class="card-body">
                <p>{{ selectedRequest.reason }}</p>
              </div>
            </div>

            <div v-if="selectedRequest.notes" class="card mt-4">
              <div class="card-header bg-light">
                <h6 class="mb-0">HR Notes</h6>
              </div>
              <div class="card-body">
                <p>{{ selectedRequest.notes }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
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
import AppNotificationToast from '../announcements/AppNotificationToast.vue';

function normalizeLeave(raw) {
  const startDate = raw.start_date || raw.startDate || raw.start || raw.from_date || raw.fromDate || raw.from || null;
  const endDate = raw.end_date || raw.endDate || raw.end || raw.to_date || raw.toDate || raw.to || null;
  return {
    id: raw.id || raw.leaveId || raw._id || Math.random().toString(36).slice(2),
    startDate,
    endDate,
    type: raw.type || raw.leave_type || raw.category || 'Vacation',
    reason: raw.reason || raw.description || '',
    status: raw.status || 'Pending',
    employeeName: raw.employeeName || raw.employee_name || raw.user?.name || raw.name || 'Unknown',
    employeeEmail: raw.employeeEmail || raw.employee_email || raw.user?.email || raw.email || '',
    employeeDept: raw.employeeDept || raw.employee_dept || raw.user?.department || raw.department || '',
    approvedBy: raw.approved_by || raw.approvedBy || '',
    notes: raw.notes || '',
    createdAt: raw.created_at || raw.createdAt || null,
    updatedAt: raw.updated_at || raw.updatedAt || null
  };
}

export default {
  name: "AppLeaveRequestForm",
  components: { AppNotificationToast },
  props: {
    userRole: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: false,
      default: "Employee"
    },
    userDept: {
      type: String,
      required: false,
      default: ""
    },
    userEmail: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    const today = new Date().toISOString().split('T')[0];
    return {
      today,
      loading: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      newRequest: {
        startDate: today,
        endDate: today,
        type: 'Vacation',
        reason: ''
      },
      leaveRequests: [],
      selectedRequest: null,
      searchQuery: '',
      statusFilter: 'all',
      typeFilter: 'all',
      currentPage: 1,
      perPage: 10,
      totalRecords: 0,
      detailsModal: null
    };
  },
  computed: {
    isHR() {
      // HR/Admin/Manager can approve
      return this.userRole === "HR" || this.userRole === "Admin" || this.userRole === "Manager";
    },
    isEmployee() {
      return !this.isHR;
    },
    currentUser() {
      return this.$store.getters['auth/currentUser'] || this.$store.state.auth.user || {};
    },
    effectiveEmail() {
      // prefer prop, fallback to store user email
      return this.userEmail || this.currentUser.email || '';
    },
    employeeRequests() {
      // filter by current user's email
      return this.leaveRequests.filter(req => (req.employeeEmail || '').toLowerCase() === (this.effectiveEmail || '').toLowerCase());
    },
    pendingRequests() {
      return this.leaveRequests.filter(req => (req.status || '').toLowerCase() === "pending");
    },
    filteredPendingRequests() {
      return this.pendingRequests.filter(req =>
        (req.employeeName || '').toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredLeaveRequests() {
      let filtered = [...this.leaveRequests];

      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(req => req.status === this.statusFilter);
      }

      if (this.typeFilter !== 'all') {
        filtered = filtered.filter(req => req.type === this.typeFilter);
      }

      return filtered.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
    totalPages() {
      let filtered = [...this.leaveRequests];

      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(req => req.status === this.statusFilter);
      }

      if (this.typeFilter !== 'all') {
        filtered = filtered.filter(req => req.type === this.typeFilter);
      }

      return Math.max(1, Math.ceil(filtered.length / this.perPage));
    }
  },
  watch: {
    statusFilter() {
      this.currentPage = 1;
    },
    typeFilter() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.detailsModal = new Modal(document.getElementById('leaveDetailsModal'));
    this.fetchLeaveRequests();
  },
  methods: {
    async fetchLeaveRequests() {
      try {
        let response;
        if (this.isEmployee) {
          response = await this.$axios.get('/leave/my');
        } else {
          // HR/Admin/Manager can see all
          response = await this.$axios.get('/list-leaves');
        }

        const payload = response?.data?.data ?? response?.data ?? [];
        const list = Array.isArray(payload) ? payload : [];
        this.leaveRequests = list.map(normalizeLeave);
        this.totalRecords = this.leaveRequests.length;
      } catch (error) {
        this.showNotification(error?.response?.data?.message || 'Failed to fetch leave requests', 'error');
        this.leaveRequests = [];
        this.totalRecords = 0;
      }
    },
    validateDates() {
      if (this.newRequest.startDate && this.newRequest.endDate) {
        if (this.newRequest.endDate < this.newRequest.startDate) {
          this.newRequest.endDate = this.newRequest.startDate;
          this.showNotification('End date adjusted to match start date', 'warning');
        }
      }
    },
    async submitRequest() {
      if (!this.newRequest.startDate || !this.newRequest.endDate || !this.newRequest.reason) {
        this.showNotification('Please fill all required fields', 'error');
        return;
      }
      if (this.newRequest.endDate < this.newRequest.startDate) {
        this.showNotification('End date cannot be before start date', 'error');
        return;
      }

      this.loading = true;
      try {
        const payload = {
          startDate: this.newRequest.startDate,
          endDate: this.newRequest.endDate,
          type: this.newRequest.type,
          reason: this.newRequest.reason
        };
        const res = await this.$axios.post('/leave/request', payload);
        const createdRaw = res?.data?.data ?? res?.data ?? null;
        const created = createdRaw ? normalizeLeave(createdRaw) : {
          id: Math.random().toString(36).slice(2),
          ...payload,
          status: 'Pending',
          employeeName: this.userName || this.currentUser.name || 'You',
          employeeEmail: this.effectiveEmail,
          employeeDept: this.userDept || this.currentUser.department || ''
        };
        this.leaveRequests.unshift(created);
        this.resetForm();
        this.showNotification('Leave request submitted successfully');
      } catch (error) {
        this.showNotification(error?.response?.data?.message || 'Submission failed', 'error');
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.newRequest = {
        startDate: this.today,
        endDate: this.today,
        type: 'Vacation',
        reason: ''
      };
    },
    async updateRequestStatus(id, status) {
      try {
        const res = await this.$axios.put(`/leave/status/${id}`, { status });
        const updatedRaw = res?.data?.data ?? res?.data ?? null;
        const updated = updatedRaw ? normalizeLeave(updatedRaw) : null;

        const index = this.leaveRequests.findIndex(req => req.id === id);
        if (index !== -1) {
          if (updated) {
            this.leaveRequests.splice(index, 1, updated);
          } else {
            this.leaveRequests[index].status = status;
            this.leaveRequests[index].updatedAt = new Date().toISOString();
          }
        }

        this.detailsModal.hide();
        this.showNotification(`Request ${status.toLowerCase()} successfully`);
      } catch (error) {
        this.showNotification(error?.response?.data?.message || 'Update failed', 'error');
      }
    },
    showDetailsModal(request) {
      this.selectedRequest = request;
      this.detailsModal.show();
    },
    statusClass(request) {
      switch ((request.status || '').toLowerCase()) {
        case 'approved': return 'bg-success';
        case 'rejected': return 'bg-danger';
        case 'pending': return 'bg-warning';
        default: return 'bg-secondary';
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '-';
      try {
        return new Date(dateStr).toLocaleDateString();
      } catch {
        return dateStr;
      }
    },
    formatDateTime(dateStr) {
      if (!dateStr) return '-';
      try {
        return new Date(dateStr).toLocaleString();
      } catch {
        return dateStr;
      }
    },
    calculateDays(startDate, endDate) {
      if (!startDate || !endDate) return '-';
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = end.getTime() - start.getTime();
      const days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
      return isNaN(days) ? '-' : days;
    },
    getInitials(name) {
      return (name || '').split(' ').map(n => n[0]).join('').toUpperCase();
    },
    truncateText(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    async exportLeaveReport() {
      try {
        if (this.filteredLeaveRequests.length === 0) {
          this.showNotification('No data to export', 'warning');
          return;
        }

        const headers = ['Employee', 'Type', 'Start Date', 'End Date', 'Days', 'Status'];
        const rows = this.filteredLeaveRequests.map(req => ([
          req.employeeName,
          req.type,
          this.formatDate(req.startDate),
          this.formatDate(req.endDate),
          this.calculateDays(req.startDate, req.endDate),
          req.status
        ]));

        const csvContent = [
          headers.join(','),
          ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `leave_report_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Export completed');
      } catch (_) {
        this.showNotification('Export failed', 'error');
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
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
.employee-card {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.employee-history {
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.hr-pending {
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.hr-all {
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.avatar-lg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
}

.table th {
  white-space: nowrap;
}

.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.05);
}

.modal-header {
  border-bottom: none;
}

.modal-footer {
  border-top: none;
}

.badge {
  padding: 0.5em 0.75em;
}

.empty-state {
  color: #6c757d;
}

.empty-state i {
  font-size: 2.5rem;
}

.card {
  margin-bottom: 1rem;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
}

.btn-success {
  background-color: #198754;
  border-color: #198754;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.text-primary {
  color: #0d6efd !important;
}

.text-muted {
  color: #6c757d !important;
}

.bg-success {
  background-color: #198754 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
  color: #212529;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.table-primary {
  background-color: #0d6efd;
  color: white;
}

.progress {
  background-color: #e9ecef;
}

.progress-bar {
  background-color: #0d6efd;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.page-link {
  color: #0d6efd;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}
</style>