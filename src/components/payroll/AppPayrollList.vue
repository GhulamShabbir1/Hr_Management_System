<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h2 text-primary mb-0">Payroll Management</h2>
      <div class="d-flex gap-2">
        <button 
          @click="exportToExcel" 
          class="btn btn-outline-secondary"
        >
          <i class="bi bi-file-earmark-excel me-2"></i> Export
        </button>
        <button 
          @click="addPayroll" 
          class="btn btn-success"
        >
          <i class="bi bi-plus-circle me-2"></i> Add Payroll
        </button>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card p-4 mb-4 filter-card">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label">Employee</label>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control" 
            placeholder="Search by employee name"
          >
        </div>
        <div class="col-md-3">
          <label class="form-label">Pay Period</label>
          <select v-model="periodFilter" class="form-select">
            <option value="all">All Periods</option>
            <option value="Monthly">Monthly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Month</label>
          <select v-model="monthFilter" class="form-select">
            <option value="all">All Months</option>
            <option v-for="(month, index) in months" :key="index" :value="index + 1">
              {{ month }}
            </option>
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
                <h6 class="text-muted">Total Payrolls</h6>
                <h4 class="mb-0">{{ stats.totalPayrolls }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-cash-stack"></i>
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
                <h6 class="text-muted">Total Paid</h6>
                <h4 class="mb-0">${{ stats.totalAmount.toLocaleString() }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-currency-dollar"></i>
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
                <h6 class="text-muted">Avg. Salary</h6>
                <h4 class="mb-0">${{ stats.avgSalary.toLocaleString() }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-graph-up"></i>
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
                <h6 class="text-muted">This Month</h6>
                <h4 class="mb-0">${{ stats.thisMonth.toLocaleString() }}</h4>
              </div>
              <div class="stat-icon">
                <i class="bi bi-calendar-month"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payroll Table -->
    <div class="card p-4">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-primary">
            <tr>
              <th>Employee</th>
              <th>Period</th>
              <th>Basic</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payroll in filteredPayrolls" :key="payroll.id">
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar me-2">
                    {{ getInitials(payroll.name) }}
                  </div>
                  <div>
                    <div class="fw-bold">{{ payroll.name }}</div>
                    <small class="text-muted">{{ payroll.department }}</small>
                  </div>
                </div>
              </td>
              <td>{{ payroll.period }}</td>
              <td>${{ payroll.basic.toLocaleString() }}</td>
              <td>${{ payroll.bonus.toLocaleString() }}</td>
              <td class="text-danger">-${{ (payroll.deduction + payroll.tax).toLocaleString() }}</td>
              <td class="fw-bold">${{ calculateNetPay(payroll).toLocaleString() }}</td>
              <td>{{ formatDate(payroll.paymentDate) }}</td>
              <td>
                <span class="badge" :class="payroll.status === 'Paid' ? 'bg-success' : 'bg-warning'">
                  {{ payroll.status }}
                </span>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <button 
                    @click="viewPayslip(payroll)" 
                    class="btn btn-sm btn-outline-primary"
                    title="View Payslip"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    @click="editPayroll(payroll)" 
                    class="btn btn-sm btn-primary"
                    title="Edit"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPayrolls.length === 0">
              <td colspan="9" class="text-center py-4 text-muted">
                <i class="bi bi-cash-coin fs-4"></i>
                <p class="mt-2 mb-0">No payroll records found</p>
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

    <!-- Payroll Form Modal -->
    <AppPayrollForm
      v-if="showForm"
      :employee="selectedPayroll"
      :mode="formMode"
      @save="savePayroll"
      @close="closeForm"
      @error="showError"
    />

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
import AppPayrollForm from "./AppPayrollForm.vue";
import AppNotificationToast from "../announcements/AppNotificationToast.vue";

export default {
  components: { AppPayrollForm, AppNotificationToast },
  data() {
    return {
      payrolls: [
        { 
          id: 1, 
          name: "John Doe", 
          department: "IT",
          basic: 5000, 
          bonus: 500, 
          deduction: 200,
          tax: 300,
          allowance: 200,
          overtime: 150,
          period: "Monthly",
          paymentDate: "2023-05-15",
          status: "Paid"
        },
        { 
          id: 2, 
          name: "Jane Smith", 
          department: "HR",
          basic: 6000, 
          bonus: 700, 
          deduction: 300,
          tax: 450,
          allowance: 300,
          overtime: 200,
          period: "Monthly",
          paymentDate: "2023-05-15",
          status: "Paid"
        },
      ],
      selectedPayroll: null,
      showForm: false,
      formMode: "add",
      searchQuery: '',
      periodFilter: 'all',
      monthFilter: 'all',
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      currentPage: 1,
      perPage: 10,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      stats: {
        totalPayrolls: 0,
        totalAmount: 0,
        avgSalary: 0,
        thisMonth: 0
      }
    };
  },
  computed: {
    filteredPayrolls() {
      let filtered = this.payrolls;
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.department.toLowerCase().includes(query)
        );
      }
      
      // Apply period filter
      if (this.periodFilter !== 'all') {
        filtered = filtered.filter(p => p.period === this.periodFilter);
      }
      
      // Apply month filter
      if (this.monthFilter !== 'all') {
        filtered = filtered.filter(p => {
          const date = new Date(p.paymentDate);
          return date.getMonth() + 1 === parseInt(this.monthFilter);
        });
      }
      
      // Update stats
      this.updateStats(filtered);
      
      // Pagination
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      
      return filtered.slice(start, end);
    },
    totalPages() {
      let filtered = this.payrolls;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.department.toLowerCase().includes(query)
        );
      }
      
      if (this.periodFilter !== 'all') {
        filtered = filtered.filter(p => p.period === this.periodFilter);
      }
      
      if (this.monthFilter !== 'all') {
        filtered = filtered.filter(p => {
          const date = new Date(p.paymentDate);
          return date.getMonth() + 1 === parseInt(this.monthFilter);
        });
      }
      
      return Math.ceil(filtered.length / this.perPage);
    }
  },
  methods: {
    addPayroll() {
      this.formMode = "add";
      this.selectedPayroll = { 
        name: "", 
        basic: 0, 
        bonus: 0, 
        deduction: 0,
        tax: 0,
        allowance: 0,
        overtime: 0,
        period: "Monthly",
        paymentDate: new Date().toISOString().split('T')[0],
        status: "Pending"
      };
      this.showForm = true;
    },
    editPayroll(payroll) {
      this.formMode = "edit";
      this.selectedPayroll = { ...payroll };
      this.showForm = true;
    },
    viewPayslip(payroll) {
      // In a real app, this would open a payslip view or PDF
      alert(`Viewing payslip for ${payroll.name}`);
    },
    savePayroll(data) {
      if (this.formMode === "add") {
        data.id = Date.now();
        data.status = "Pending";
        this.payrolls.unshift(data);
        this.showNotification('Payroll added successfully');
      } else {
        const index = this.payrolls.findIndex(p => p.id === data.id);
        if (index !== -1) {
          this.payrolls.splice(index, 1, data);
          this.showNotification('Payroll updated successfully');
        }
      }
      this.closeForm();
    },
    closeForm() {
      this.showForm = false;
      this.selectedPayroll = null;
    },
    showError(message) {
      this.showNotification(message, 'error');
    },
    showNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
    },
    calculateNetPay(payroll) {
      return payroll.basic + payroll.bonus + payroll.allowance + payroll.overtime - payroll.deduction - payroll.tax;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    updateStats(payrolls) {
      this.stats.totalPayrolls = payrolls.length;
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      this.stats.totalAmount = payrolls.reduce((sum, p) => sum + this.calculateNetPay(p), 0);
      this.stats.avgSalary = payrolls.length > 0 
        ? (this.stats.totalAmount / payrolls.length).toFixed(2)
        : 0;
      
      this.stats.thisMonth = payrolls
        .filter(p => {
          const date = new Date(p.paymentDate);
          return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + this.calculateNetPay(p), 0);
    },
    resetFilters() {
      this.searchQuery = '';
      this.periodFilter = 'all';
      this.monthFilter = 'all';
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
    exportToExcel() {
      // In a real app, this would call an API endpoint to generate Excel
      alert("Exporting payroll data to Excel...");
    }
  },
  created() {
    this.updateStats(this.payrolls);
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

.btn-success {
  background-color: #198754;
  border-color: #198754;
}

.btn-success:hover {
  background-color: #157347;
  border-color: #146c43;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.btn-outline-primary {
  border-color: #0d6efd;
  color: #0d6efd;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
}

.bg-success {
  background-color: #198754 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
  color: #212529;
}

.text-primary {
  color: #0d6efd !important;
}

.text-muted {
  color: #6c757d !important;
}

.text-danger {
  color: #dc3545 !important;
}

.fw-bold {
  font-weight: 600 !important;
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
</style>