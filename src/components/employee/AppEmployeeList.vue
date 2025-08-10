<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h2 text-primary mb-0">Employee Management</h2>
      <button @click="openForm()" class="btn btn-success">
        <i class="bi bi-person-plus me-2"></i> Add Employee
      </button>
    </div>

    <!-- Employee Form Modal -->
    <div v-if="showForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            {{ selectedEmployee ? 'Edit Employee' : 'Add New Employee' }}
          </h5>
          <button @click="closeForm" class="btn-close btn-close-white"></button>
        </div>
        <div class="modal-body">
          <AppEmployeeForm :employee="selectedEmployee" @save="saveEmployee" @close="closeForm" @error="showError" />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">Confirm Delete</h5>
          <button @click="closeDeleteModal" class="btn-close btn-close-white"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ employeeToDelete?.name }}</strong> (ID: {{ employeeToDelete?.id
            }})?</p>
          <p class="text-danger">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="deleteEmployeeConfirm" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card p-4 mb-4 filter-card">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label">Search</label>
          <input v-model="searchQuery" type="text" class="form-control" placeholder="Search by name, email or role">
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
          <button @click="resetFilters" class="btn btn-outline-secondary w-100">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3" v-for="(value, key) in stats" :key="key">
        <div class="card stat-card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="text-muted">{{ statLabels[key] }}</h6>
                <h4 class="mb-0">{{ value }}</h4>
              </div>
              <div class="stat-icon">
                <i :class="statIcons[key]"></i>
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
                  <div class="avatar me-2">{{ getInitials(employee.name) }}</div>
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
                  {{ employee.active ? 'active' : 'inactive' }}
                </span>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <button @click="editEmployee(employee)" class="btn btn-sm btn-primary" title="Edit">
                    <i class="bi bi-pencil">Edit</i>
                  </button>
                  <button @click="viewEmployee(employee)" class="btn btn-sm btn-info" title="View">
                    <i class="bi bi-eye">View</i>
                  </button>
                  <button @click="confirmDelete(employee)" class="btn btn-sm btn-danger" title="Delete">
                    <i class="bi bi-trash">Delete</i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredEmployees.length === 0">
              <td colspan="7" class="text-center py-3 text-muted">
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
            <button class="page-link" @click="prevPage" :disabled="currentPage === 1">&laquo;</button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Export Button -->
    <div class="d-flex justify-content-end mt-3">
      <button @click="exportToExcel" class="btn btn-primary"
        :disabled="loadingExport || filteredEmployees.length === 0">
        <span v-if="loadingExport" class="spinner-border spinner-border-sm me-2"></span>
        <i class="bi bi-file-earmark-excel me-2"></i> Export to Excel
      </button>
    </div>

    <!-- Toast Notification -->
    <AppNotificationToast :show="showToast" :message="toastMessage" :type="toastType" @close="showToast = false" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import * as XLSX from "xlsx";
import AppNotificationToast from "../announcements/AppNotificationToast.vue";
import AppEmployeeForm from "./AppEmployeeForm.vue";

export default {
  name: "EmployeeList",
  components: { AppEmployeeForm, AppNotificationToast },
  data() {
    return {
      showForm: false,
      showDeleteModal: false,
      selectedEmployee: null,
      employeeToDelete: null,
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
      },
      statLabels: {
        totalEmployees: "Total Employees",
        activeEmployees: "Active",
        managers: "Managers",
        hrStaff: "HR Staff"
      },
      statIcons: {
        totalEmployees: "bi bi-people-fill",
        activeEmployees: "bi bi-person-check",
        managers: "bi bi-person-badge",
        hrStaff: "bi bi-person-vcard"
      }
    };
  },
  computed: {
    ...mapGetters("employees", ["employees"]),

    filteredEmployees() {
      let filtered = [...this.employees];

      // Search
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(emp =>
          emp.name?.toLowerCase().includes(query) ||
          emp.email?.toLowerCase().includes(query) ||
          emp.role?.toLowerCase().includes(query)
        );
      }

      // Role filter
      if (this.roleFilter !== 'all') filtered = filtered.filter(emp => emp.role === this.roleFilter);
      // Status filter
      if (this.statusFilter !== 'all') filtered = filtered.filter(emp => emp.active === (this.statusFilter === 'active'));

      // Update stats dynamically
      this.updateStats(filtered);

      // Pagination
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return filtered.slice(start, end);
    },

    totalPages() {
      let filtered = [...this.employees];

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(emp =>
          emp.name?.toLowerCase().includes(query) ||
          emp.email?.toLowerCase().includes(query) ||
          emp.role?.toLowerCase().includes(query)
        );
      }

      if (this.roleFilter !== 'all') filtered = filtered.filter(emp => emp.role === this.roleFilter);
      if (this.statusFilter !== 'all') filtered = filtered.filter(emp => emp.active === (this.statusFilter === 'active'));

      return Math.ceil(filtered.length / this.perPage) || 1;
    }
  },
  methods: {
    ...mapActions("employees", ["fetchEmployees", "deleteEmployee", "addEmployee", "updateEmployee"]),

    openForm(employee = null) {
      this.selectedEmployee = employee ? { ...employee } : null;
      this.showForm = true;
      document.body.classList.add('modal-open');
    },

    closeForm() {
      this.showForm = false;
      this.selectedEmployee = null;
      document.body.classList.remove('modal-open');
    },

    async saveEmployee(employee) {
      try {
        if (employee.id) {
          await this.updateEmployee(employee);
          this.toastMessage = "Employee updated successfully!";
        } else {
          await this.addEmployee(employee);
          this.toastMessage = "Employee added successfully!";
        }
        this.toastType = "success";
        await this.fetchEmployees(); // Refresh the list
      } catch (error) {
        this.toastMessage = error.message || "Failed to save employee!";
        this.toastType = "danger";
      } finally {
        this.showToast = true;
        this.closeForm();
      }
    },

    showError(message) {
      this.toastMessage = message;
      this.toastType = "danger";
      this.showToast = true;
    },

    editEmployee(employee) {
      this.openForm(employee);
    },

    viewEmployee(employee) {
      alert(`Viewing Employee:\n\nName: ${employee.name}\nEmail: ${employee.email}\nRole: ${employee.role}\nStatus: ${employee.active ? 'Active' : 'Inactive'}`);
    },

    confirmDelete(employee) {
      this.employeeToDelete = employee;
      this.showDeleteModal = true;
      document.body.classList.add('modal-open');
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.employeeToDelete = null;
      document.body.classList.remove('modal-open');
    },

    async deleteEmployeeConfirm() {
      if (!this.employeeToDelete) return;

      try {
        await this.deleteEmployee(this.employeeToDelete.id);
        this.toastMessage = `${this.employeeToDelete.name} deleted successfully!`;
        this.toastType = "success";
        await this.fetchEmployees(); // Refresh the list
      } catch (error) {
        this.toastMessage = `Failed to delete ${this.employeeToDelete.name}!`;
        this.toastType = "danger";
      } finally {
        this.showToast = true;
        this.closeDeleteModal();
      }
    },

    resetFilters() {
      this.searchQuery = '';
      this.roleFilter = 'all';
      this.statusFilter = 'all';
      this.currentPage = 1;
    },

    updateStats(list) {
      const employeeList = Array.isArray(list) ? list : [];
      this.stats = {
        totalEmployees: employeeList.length,
        activeEmployees: employeeList.filter(e => e.active).length,
        managers: employeeList.filter(e => e.role === 'Manager').length,
        hrStaff: employeeList.filter(e => e.role === 'HR').length
      };
    },

    roleClass(role) {
      return {
        Employee: 'bg-secondary',
        Manager: 'bg-primary',
        HR: 'bg-info',
        Admin: 'bg-dark'
      }[role] || 'bg-light';
    },

    getInitials(name) {
      return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
    },

    prevPage() { if (this.currentPage > 1) this.currentPage--; },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },
    goToPage(page) { this.currentPage = page; },

    async exportToExcel() {
      try {
        this.loadingExport = true;
        const data = (Array.isArray(this.employees) ? this.employees : []).map(emp => ({
          ID: emp.id,
          Name: emp.name,
          Email: emp.email,
          Phone: emp.phone || 'N/A',
          Department: emp.department || 'N/A',
          Role: emp.role,
          Position: emp.position || 'N/A',
          Status: emp.active ? 'Active' : 'Inactive',
          HireDate: emp.hireDate || 'N/A'
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
        XLSX.writeFile(workbook, `Employees_${new Date().toISOString().slice(0, 10)}.xlsx`);
        this.toastMessage = "Export successful!";
        this.toastType = "success";
      } catch (error) {
        this.toastMessage = "Failed to export data!";
        this.toastType = "danger";
      } finally {
        this.showToast = true;
        this.loadingExport = false;
      }
    }
  },

  async mounted() {
    try {
      await this.fetchEmployees();
      this.updateStats(this.employees);
    } catch (error) {
      this.showError(error.message || "Failed to load employees!");
    }
  }
};
</script>

<style scoped>
.avatar {
  background: #0d6efd;
  color: #fff;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.stat-card {
  border-left: 5px solid #0d6efd;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  color: #0d6efd;
  opacity: 0.7;
}

.filter-card {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  padding: 20px;
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: #ffffff;
  border-radius: 12px;
  width: 95%;
  max-width: 900px;
  min-height: 200px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: visible;
  max-height: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Table Styles */
.table th {
  white-space: nowrap;
  position: relative;
}

.table td {
  vertical-align: middle;
}

/* Action buttons */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {

  .filter-card .col-md-4,
  .filter-card .col-md-3,
  .filter-card .col-md-2 {
    margin-bottom: 1rem;
  }

  .stat-card {
    margin-bottom: 1rem;
  }

  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Body scroll lock when modal is open */
.modal-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
</style>