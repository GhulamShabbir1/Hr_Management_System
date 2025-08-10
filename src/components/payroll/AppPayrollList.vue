<template>
  <div class="container-fluid p-4">
    <!-- Header section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h2 text-primary mb-0">Payroll Management</h2>
      <div class="d-flex gap-2">
        <button @click="exportToExcel" class="btn btn-outline-secondary">
          <i class="bi bi-file-earmark-excel me-2"></i> Export
        </button>
        <button @click="showAddForm" class="btn btn-success">
          <i class="bi bi-plus-circle me-2"></i> Add Payroll
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-4 filter-card">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label">Employee</label>
          <input v-model="searchQuery" type="text" class="form-control" placeholder="Search by employee name" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Month</label>
          <select v-model="monthFilter" class="form-select">
            <option value="all">All Months</option>
            <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
          </select>
        </div>
        <div class="col-md-2">
          <button @click="resetFilters" class="btn btn-outline-secondary w-100">Reset</button>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="row mb-4">
      <div class="col-md-3" v-for="(stat, index) in statCards" :key="index">
        <div :class="['card', 'stat-card', stat.class, 'h-100']">
          <div class="card-body d-flex justify-content-between">
            <div>
              <h6 class="text-muted">{{ stat.label }}</h6>
              <h4 class="mb-0">{{ stat.value }}</h4>
            </div>
            <div class="stat-icon"><i :class="stat.icon"></i></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card p-4">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-primary">
            <tr>
              <th>Employee</th>
              <th>Payroll ID</th>
              <th>Basic Pay</th>
              <th>Bonuses</th>
              <th>Net Salary</th>
              <th>Pay Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payroll in filteredPayrolls" :key="payroll.id">
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar me-2">{{ getInitials(payroll.employeeName) }}</div>
                  <div>
                    <div class="fw-bold">{{ formatName(payroll.employeeName) }}</div>
                    <small class="text-muted">{{ formatName(payroll.department) }}</small>
                  </div>
                </div>
              </td>
              <td>{{ payroll.id || 'N/A' }}</td>
              <td>${{ (payroll.basic || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
              <td>${{ (payroll.bonus || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
              <td class="fw-bold">${{ (payroll.netSalary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
              <td>{{ formatDate(payroll.payDate) }}</td>
              <td>
                <div class="d-flex gap-2">
                  <button @click="viewPayslip(payroll)" class="btn btn-sm btn-outline-primary" title="View Payslip">
                    <i class="bi bi-eye"></i> View
                  </button>
                  <button @click="editPayroll(payroll)" class="btn btn-sm btn-primary" title="Edit">
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button @click="confirmDelete(payroll)" class="btn btn-sm btn-outline-danger" title="Delete">
                    <i class="bi bi-trash"></i> Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPayrolls.length === 0 && !loading">
              <td colspan="7" class="text-center py-4 text-muted">
                <i class="bi bi-cash-coin fs-4"></i>
                <p class="mt-2 mb-0">No payroll records found</p>
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav v-if="totalPages > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">&laquo;</button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage">&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="modal-backdrop fade show" @click.self="closeForm"></div>
    <div v-if="showForm" class="modal fade show d-block">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ formMode === 'add' ? 'Add New Payroll' : 'Edit Payroll' }}</h5>
            <button type="button" class="btn-close" @click="closeForm"></button>
          </div>
          <div class="modal-body">
            <AppPayrollForm 
              :payroll="selectedPayroll" 
              :mode="formMode" 
              @save="handleSave" 
              @cancel="closeForm"
              ref="payrollForm"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete payroll record #{{ payrollToDelete?.id || 'N/A' }}?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deletePayrollRecord">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div v-if="showToast" :class="['toast', 'show', toastType === 'success' ? 'bg-success' : 'bg-danger']" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body text-white">
            <i :class="toastType === 'success' ? 'bi bi-check-circle-fill me-2' : 'bi bi-exclamation-triangle-fill me-2'"></i>
            {{ toastMessage }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="showToast = false" aria-label="Close"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import AppPayrollForm from "./AppPayrollForm.vue";

export default {
  components: { AppPayrollForm },

  data() {
    return {
      selectedPayroll: null,
      payrollToDelete: null,
      showForm: false,
      showDeleteModal: false,
      formMode: "add",
      searchQuery: "",
      monthFilter: "all",
      currentPage: 1,
      perPage: 10,
      showToast: false,
      toastMessage: "",
      toastType: "success",
      loading: false,
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      stats: {
        totalPayrolls: 0,
        totalAmount: 0,
        avgSalary: 0,
        thisMonth: 0,
      },
    };
  },

  computed: {
    ...mapState("payroll", ["payrolls"]),
    ...mapGetters("payroll", ["getPayrollWithEmployees"]),
    ...mapState("employees", ["employees"]),

    filteredPayrolls() {
      let filtered = this.getPayrollWithEmployees;

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          (this.formatName(p.employeeName).toLowerCase().includes(q) ||
          (this.formatName(p.department).toLowerCase().includes(q)
        )));
      }

      if (this.monthFilter !== "all") {
        filtered = filtered.filter(p => {
          try {
            const date = new Date(p.payDate);
            return date.getMonth() + 1 === parseInt(this.monthFilter);
          } catch {
            return false;
          }
        });
      }

      this.updateStats(filtered);
      const start = (this.currentPage - 1) * this.perPage;
      return filtered.slice(start, start + this.perPage);
    },

    totalPages() {
      const total = this.getPayrollWithEmployees.length;
      return Math.ceil(total / this.perPage);
    },

    statCards() {
      return [
        { 
          label: "Total Payrolls", 
          value: this.stats.totalPayrolls, 
          icon: "bi bi-cash-stack", 
          class: "stat-card-1" 
        },
        { 
          label: "Total Paid", 
          value: `$${(this.stats.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
          icon: "bi bi-currency-dollar", 
          class: "stat-card-2" 
        },
        { 
          label: "Avg. Salary", 
          value: `$${(this.stats.avgSalary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
          icon: "bi bi-graph-up", 
          class: "stat-card-3" 
        },
        { 
          label: "This Month", 
          value: `$${(this.stats.thisMonth || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
          icon: "bi bi-calendar-month", 
          class: "stat-card-4" 
        }
      ];
    }
  },

  methods: {
    ...mapActions("payroll", ["fetchPayrolls", "generatePayroll", "updatePayroll", "deletePayroll"]),
    ...mapActions("employees", ["fetchEmployees"]),

    formatName(value) {
      if (!value || value === 'Unknown' || value === 'Unknown Employee') return 'N/A';
      return value;
    },

    async showAddForm() {
      try {
        this.loading = true;
        await this.fetchEmployees();
        
        this.formMode = "add";
        this.selectedPayroll = {
          id: null,
          user_id: "",
          basic_pay: 0,
          bonuses: 0,
          net_salary: 0,
          pay_date: new Date().toISOString().split('T')[0]
        };
        this.showForm = true;
      } catch (error) {
        this.showNotification("Failed to load employee data", "danger");
      } finally {
        this.loading = false;
      }
    },

    async handleSave(payrollData) {
      try {
        this.loading = true;
        
        // Prepare payload with correct field names
        const payload = {
          user_id: payrollData.user_id.toString(),
          basic_pay: payrollData.basic_pay.toString(),
          bonuses: payrollData.bonuses.toString(),
          net_salary: payrollData.net_salary.toString(),
          pay_date: payrollData.pay_date
        };

        // Include ID for edit mode
        if (this.formMode === 'edit' && payrollData.id) {
          payload.id = payrollData.id.toString();
        }

        if (this.formMode === "add") {
          const result = await this.generatePayroll(payload);
          if (result.success) {
            this.showNotification("Payroll created successfully", "success");
            this.closeForm();
            await this.fetchPayrolls();
          } else {
            throw new Error(result.message || "Failed to create payroll");
          }
        } else {
          const result = await this.updatePayroll(payload);
          if (result.success) {
            this.showNotification("Payroll updated successfully", "success");
            this.closeForm();
            await this.fetchPayrolls();
          } else {
            throw new Error(result.message || "Failed to update payroll");
          }
        }
      } catch (error) {
        this.showNotification(error.message, "danger");
      } finally {
        this.loading = false;
      }
    },

    async deletePayrollRecord() {
      try {
        this.loading = true;
        const result = await this.deletePayroll(this.payrollToDelete.id);
        
        if (result.success) {
          this.showNotification("Payroll deleted successfully", "success");
          await this.fetchPayrolls();
        } else {
          throw new Error(result.message || "Failed to delete payroll");
        }
      } catch (error) {
        this.showNotification(error.message, "danger");
      } finally {
        this.loading = false;
        this.showDeleteModal = false;
      }
    },

    confirmDelete(payroll) {
      this.payrollToDelete = payroll;
      this.showDeleteModal = true;
    },

    editPayroll(payroll) {
      this.formMode = "edit";
      this.selectedPayroll = { 
        id: payroll.id,
        user_id: payroll.employeeId,
        basic_pay: payroll.basic,
        bonuses: payroll.bonus,
        net_salary: payroll.netSalary,
        pay_date: payroll.payDate
      };
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
      this.selectedPayroll = null;
    },

    showNotification(msg, type) {
      this.toastMessage = msg;
      this.toastType = type;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },

    viewPayslip(payroll) {
      if (payroll && payroll.id) {
        this.$router.push({ 
          name: 'Payslip', 
          params: { id: payroll.id },
          query: { from: this.$route.path }
        });
      } else {
        this.showNotification("Invalid payroll record", "danger");
      }
    },

    resetFilters() {
      this.searchQuery = "";
      this.monthFilter = "all";
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

    formatDate(dateString) {
      try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
      } catch {
        return 'N/A';
      }
    },

    getInitials(name) {
      const formattedName = this.formatName(name);
      if (formattedName === 'N/A') return 'N/A';
      return formattedName.split(' ')
        .filter(n => n.length > 0)
        .map(n => n[0])
        .join('')
        .toUpperCase();
    },

    updateStats(payrolls) {
      const total = payrolls.length;
      const amount = payrolls.reduce((sum, p) => sum + (parseFloat(p.netSalary) || 0), 0);
      const avg = total > 0 ? amount / total : 0;
      
      const currentMonth = new Date().getMonth();
      const thisMonth = payrolls
        .filter(p => {
          try {
            return new Date(p.payDate).getMonth() === currentMonth;
          } catch {
            return false;
          }
        })
        .reduce((sum, p) => sum + (parseFloat(p.netSalary) || 0), 0);

      this.stats = { 
        totalPayrolls: total, 
        totalAmount: amount, 
        avgSalary: avg, 
        thisMonth 
      };
    },

    exportToExcel() {
      this.showNotification("Export feature coming soon!", "info");
    },

    async loadData() {
      try {
        this.loading = true;
        await this.fetchPayrolls();
      } catch (error) {
        this.showNotification("Failed to load payroll data", "danger");
      } finally {
        this.loading = false;
      }
    }
  },

  async created() {
    await this.loadData();
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
  font-weight: 500;
}

.btn-sm i {
  font-size: 0.875rem;
}

.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
  overflow-y: auto;
}

.modal-dialog-scrollable .modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.toast {
  opacity: 1;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>