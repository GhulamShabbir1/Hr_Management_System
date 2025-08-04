<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h2 text-primary mb-0">Employee Management</h2>
      <button 
        @click="openForm()" 
        class="btn btn-success"
      >
        <i class="bi bi-person-plus me-2"></i> Add Employee
      </button>
    </div>

    <!-- Employee Form Modal -->
    <AppEmployeeForm
      v-if="showForm"
      :employee="selectedEmployee"
      @save="saveEmployee"
      @close="closeForm"
      @error="showError"
    />

    <!-- Filters Card -->
    <div class="card p-4 mb-4 filter-card">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label">Search</label>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control" 
            placeholder="Search by name, email or role"
          >
        </div>
        <div class="col-md-3">
          <label class="form-label">Role</label>
          <select v-model="roleFilter" class="form-select">
            <option value="all">All Roles</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="HR">HR</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Status</label>
          <select v-model="statusFilter" class="form-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="col-md-2">
          <button 
            @click="resetFilters" 
            class="btn btn-outline-secondary w-100"
          >
            Reset
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
                <h6 class="text-muted">Active</h6>
                <h4 class="mb-0">{{ stats.activeEmployees }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-person-check"></i>
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
                <h6 class="text-muted">Managers</h6>
                <h4 class="mb-0">{{ stats.managers }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-person-badge"></i>
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
                <h6 class="text-muted">HR Staff</h6>
                <h4 class="mb-0">{{ stats.hrStaff }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-person-vcard"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Table -->
    <div class="card p-4">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-primary">
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in filteredEmployees" :key="employee.id">
              <td>{{ employee.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar me-2">
                    {{ getInitials(employee.name) }}
                  </div>
                  <div>
                    <div class="fw-bold">{{ employee.name }}</div>
                    <small class="text-muted">{{ employee.position }}</small>
                  </div>
                </div>
              </td>
              <td>
                <div>{{ employee.email }}</div>
                <small class="text-muted">{{ employee.phone || 'N/A' }}</small>
              </td>
              <td>{{ employee.department || 'N/A' }}</td>
              <td>
                <span class="badge" :class="roleClass(employee.role)">
                  {{ employee.role }}
                </span>
              </td>
              <td>
                <span class="badge" :class="employee.active ? 'bg-success' : 'bg-secondary'">
                  {{ employee.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <button 
                    @click="toggleStatus(employee.id)" 
                    class="btn btn-sm"
                    :class="employee.active ? 'btn-warning' : 'btn-success'"
                    :title="employee.active ? 'Deactivate' : 'Activate'"
                  >
                    <i class="bi" :class="employee.active ? 'bi-person-x' : 'bi-person-check'"></i>
                  </button>
                  <button 
                    @click="editEmployee(employee)" 
                    class="btn btn-sm btn-primary"
                    title="Edit"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    @click="viewEmployee(employee.id)" 
                    class="btn btn-sm btn-info"
                    title="View"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredEmployees.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">
                <i class="bi bi-people fs-4"></i>
                <p class="mt-2 mb-0">No employees found matching your criteria</p>
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
        class="btn btn-primary"
        :disabled="loadingExport || filteredEmployees.length === 0"
      >
        <span v-if="loadingExport" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi bi-file-earmark-excel me-2"></i> Export to Excel
      </button>
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
import { mapActions, mapGetters } from "vuex";
import axios from 'axios';
import AppEmployeeForm from "./AppEmployeeForm.vue";
import AppNotificationToast from "../announcements/AppNotificationToast.vue";

export default {
  name: "EmployeeList",
  components: { AppEmployeeForm, AppNotificationToast },
  data() {
    return {
      showForm: false,
      selectedEmployee: null,
      searchQuery: '',
      roleFilter: 'all',
      statusFilter: 'all',
      currentPage: 1,
      perPage: 10,
      loadingExport: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      stats: {
        totalEmployees: 0,
        activeEmployees: 0,
        managers: 0,
        hrStaff: 0
      }
    };
  },
  computed: {
    ...mapGetters("employees", ["employees"]),
    filteredEmployees() {
      let filtered = this.employees;
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(emp => 
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.role.toLowerCase().includes(query)
        );
      }
      
      // Apply role filter
      if (this.roleFilter !== 'all') {
        filtered = filtered.filter(emp => emp.role === this.roleFilter);
      }
      
      // Apply status filter
      if (this.statusFilter !== 'all') {
        const activeFilter = this.statusFilter === 'active';
        filtered = filtered.filter(emp => emp.active === activeFilter);
      }
      
      // Update stats
      this.updateStats(filtered);
      
      // Pagination
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      
      return filtered.slice(start, end);
    },
    totalPages() {
      let filtered = this.employees;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(emp => 
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.role.toLowerCase().includes(query)
        );
      }
      
      if (this.roleFilter !== 'all') {
        filtered = filtered.filter(emp => emp.role === this.roleFilter);
      }
      
      if (this.statusFilter !== 'all') {
        const activeFilter = this.statusFilter === 'active';
        filtered = filtered.filter(emp => emp.active === activeFilter);
      }
      
      return Math.ceil(filtered.length / this.perPage);
    }
  },
  methods: {
    ...mapActions("employees", ["fetchEmployees", "toggleStatus", "addEmployee", "updateEmployee"]),
    openForm(employee = null) {
      this.selectedEmployee = employee;
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.selectedEmployee = null;
    },
    async saveEmployee(employee) {
      try {
        if (employee.id) {
          await this.updateEmployee({ id: employee.id, data: employee });
          this.showNotification('Employee updated successfully');
        } else {
          await this.addEmployee(employee);
          this.showNotification('Employee added successfully');
        }
        this.closeForm();
        await this.fetchEmployees();
      } catch (error) {
        this.showNotification(error.response?.data?.message || 'Operation failed', 'error');
      }
    },
    editEmployee(employee) {
      this.openForm({ ...employee });
    },
    viewEmployee(id) {
      this.$router.push(`/employees/${id}`);
    },
    showError(message) {
      this.showNotification(message, 'error');
    },
    showNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
    },
    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    roleClass(role) {
      switch (role) {
        case 'Admin': return 'bg-danger';
        case 'HR': return 'bg-primary';
        case 'Manager': return 'bg-warning text-dark';
        default: return 'bg-secondary';
      }
    },
    updateStats(employees) {
      this.stats.totalEmployees = employees.length;
      this.stats.activeEmployees = employees.filter(e => e.active).length;
      this.stats.managers = employees.filter(e => e.role === 'Manager').length;
      this.stats.hrStaff = employees.filter(e => e.role === 'HR').length;
    },
    resetFilters() {
      this.searchQuery = '';
      this.roleFilter = 'all';
      this.statusFilter = 'all';
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
    },
    async exportToExcel() {
      this.loadingExport = true;
      try {
        const params = {
          search: this.searchQuery,
          role: this.roleFilter !== 'all' ? this.roleFilter : null,
          status: this.statusFilter !== 'all' ? this.statusFilter : null
        };

        const response = await axios.get('/api/employees/export', {
          params,
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `employees_export_${new Date().toISOString()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        this.showNotification('Export started successfully');
      } catch (error) {
        console.error('Export error:', error);
        this.showNotification('Export failed', 'error');
      } finally {
        this.loadingExport = false;
      }
    }
  },
  async created() {
    await this.fetchEmployees();
    this.updateStats(this.employees);
  }
};
</script>

<style scoped>
.filter-card {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
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

.table th {
  white-space: nowrap;
}

.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.05);
}

.badge {
  padding: 0.5em 0.75em;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-success {
  background-color: #198754;
  border-color: #198754;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-info {
  background-color: #0dcaf0;
  border-color: #0dcaf0;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

.text-primary {
  color: #0d6efd !important;
}

.text-muted {
  color: #6c757d !important;
}

.bg-primary {
  background-color: #0d6efd !important;
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

.bg-secondary {
  background-color: #6c757d !important;
}

.table-primary {
  background-color: #0d6efd;
  color: white;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.page-link {
  color: #0d6efd;
}

.empty-state {
  color: #6c757d;
}

.empty-state i {
  font-size: 2.5rem;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}
</style>