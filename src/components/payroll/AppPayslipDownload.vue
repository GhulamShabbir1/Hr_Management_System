<template>
  <div class="container-fluid p-4 animate__animated animate__fadeIn">
    <div class="card-gradient p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 text-primary mb-0">
          <i class="bi bi-file-earmark-text me-2" aria-hidden="true"></i>
          Payslip for {{ employee.name }}
        </h1>
        <button 
          @click="$router.go(-1)" 
          class="btn btn-outline-secondary"
          aria-label="Go back to previous page"
        >
          <i class="bi bi-arrow-left me-2" aria-hidden="true"></i> Back
        </button>
      </div>

      <div class="row">
        <!-- Employee Information -->
        <section class="col-md-4">
          <div class="card mb-4">
            <div class="card-header bg-gradient-primary text-white">
              <h2 class="h5 mb-0">Employee Details</h2>
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-lg me-3" aria-hidden="true">
                  {{ getInitials(employee.name) }}
                </div>
                <div>
                  <h3 class="h4 mb-0">{{ employee.name }}</h3>
                  <p class="text-muted mb-0">{{ employee.department || 'N/A' }}</p>
                  <p class="text-muted mb-0">{{ employee.position || 'N/A' }}</p>
                </div>
              </div>
              <dl class="mb-0">
                <div class="mb-2">
                  <dt class="fw-bold d-inline">Employee ID:</dt>
                  <dd class="d-inline ms-1">{{ employee.id }}</dd>
                </div>
                <div class="mb-2">
                  <dt class="fw-bold d-inline">Pay Period:</dt>
                  <dd class="d-inline ms-1">{{ employee.period || 'Monthly' }}</dd>
                </div>
                <div>
                  <dt class="fw-bold d-inline">Payment Date:</dt>
                  <dd class="d-inline ms-1">{{ formatDate(employee.paymentDate) }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <!-- Payslip Details -->
        <section class="col-md-8">
          <div class="card mb-4">
            <div class="card-header bg-gradient-primary text-white">
              <h2 class="h5 mb-0">Salary Breakdown</h2>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Description</th>
                      <th scope="col" class="text-end">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Basic Salary</td>
                      <td class="text-end">{{ formatCurrency(employee.basic) }}</td>
                    </tr>
                    <tr>
                      <td>Overtime Pay</td>
                      <td class="text-end">{{ formatCurrency(employee.overtime || 0) }}</td>
                    </tr>
                    <tr>
                      <td>Performance Bonus</td>
                      <td class="text-end">{{ formatCurrency(employee.bonus || 0) }}</td>
                    </tr>
                    <tr>
                      <td>Allowances</td>
                      <td class="text-end">{{ formatCurrency(employee.allowance || 0) }}</td>
                    </tr>
                    <tr class="table-active">
                      <td class="fw-bold">Gross Salary</td>
                      <td class="text-end fw-bold">{{ formatCurrency(grossSalary) }}</td>
                    </tr>
                    <tr>
                      <td>Tax Deductions</td>
                      <td class="text-end text-danger">-{{ formatCurrency(employee.tax || 0) }}</td>
                    </tr>
                    <tr>
                      <td>Other Deductions</td>
                      <td class="text-end text-danger">-{{ formatCurrency(employee.deduction || 0) }}</td>
                    </tr>
                    <tr class="table-active">
                      <td class="fw-bold">Net Pay</td>
                      <td class="text-end fw-bold">{{ formatCurrency(netPay) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Bank Details -->
          <div class="card">
            <div class="card-header bg-light">
              <h2 class="h5 mb-0">Bank Transfer Information</h2>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <dl>
                    <div class="mb-2">
                      <dt class="fw-bold d-inline">Bank Name:</dt>
                      <dd class="d-inline ms-1">{{ employee.bankName || 'N/A' }}</dd>
                    </div>
                    <div class="mb-2">
                      <dt class="fw-bold d-inline">Account Title:</dt>
                      <dd class="d-inline ms-1">{{ employee.accountTitle || 'N/A' }}</dd>
                    </div>
                  </dl>
                </div>
                <div class="col-md-6">
                  <dl>
                    <div class="mb-2">
                      <dt class="fw-bold d-inline">Account Number:</dt>
                      <dd class="d-inline ms-1">{{ employee.accountNumber || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="fw-bold d-inline">IBAN:</dt>
                      <dd class="d-inline ms-1">{{ employee.iban || 'N/A' }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-end gap-3 mt-4 no-print">
        <button 
          @click="printPayslip" 
          class="btn btn-outline-primary"
          aria-label="Print payslip"
          data-bs-toggle="tooltip" 
          title="Print this payslip"
        >
          <i class="bi bi-printer me-2" aria-hidden="true"></i> Print
        </button>
        <button 
          @click="downloadPayslip" 
          class="btn btn-gradient-primary"
          aria-label="Download payslip as PDF"
          data-bs-toggle="tooltip" 
          title="Download PDF"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing...
          </template>
          <template v-else>
            <i class="bi bi-download me-2" aria-hidden="true"></i> Download PDF
          </template>
        </button>
        <button 
          @click="emailPayslip" 
          class="btn btn-gradient-success"
          aria-label="Email payslip"
          data-bs-toggle="tooltip" 
          title="Send via email"
          v-if="employee.email"
          :disabled="isLoading"
        >
          <i class="bi bi-envelope me-2" aria-hidden="true"></i> Email
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <AppToast 
      :show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      @close="showToast = false"
    />
  </div>
</template>

<script>
import AppToast from './AppToast.vue';

export default {
  name: "AppPayslipDownload",
  components: { AppToast },
  props: {
    employee: {
      type: Object,
      required: true,
      validator: (value) => {
        return 'id' in value && 'name' in value && 'basic' in value;
      }
    }
  },
  data() {
    return {
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      isLoading: false
    };
  },
  computed: {
    grossSalary() {
      return (this.employee.basic || 0) + 
             (this.employee.bonus || 0) + 
             (this.employee.allowance || 0) + 
             (this.employee.overtime || 0);
    },
    netPay() {
      return this.grossSalary - 
             (this.employee.deduction || 0) - 
             (this.employee.tax || 0);
    }
  },
  methods: {
    formatCurrency(amount) {
      if (isNaN(amount)) return '0.00';
      return amount.toLocaleString('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    },
    getInitials(name) {
      if (!name) return '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    async downloadPayslip() {
      this.isLoading = true;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.showNotification('Payslip downloaded successfully');
      } catch (error) {
        this.showNotification('Failed to download payslip', 'error');
        console.error('Download error:', error);
      } finally {
        this.isLoading = false;
      }
    },
    printPayslip() {
      this.showNotification('Preparing for printing...', 'info');
      setTimeout(() => {
        window.print();
      }, 300);
    },
    async emailPayslip() {
      if (!this.employee.email) return;
      
      this.isLoading = true;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.showNotification(`Payslip sent to ${this.employee.email}`);
      } catch (error) {
        this.showNotification('Failed to send email', 'error');
        console.error('Email error:', error);
      } finally {
        this.isLoading = false;
      }
    },
    showNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
    }
  },
  mounted() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(this.$el.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
};
</script>

<style scoped>
.avatar-lg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
}

.card-gradient {
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-gradient-primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
}

.btn-gradient-primary:hover {
  opacity: 0.9;
  color: white;
}

.btn-gradient-success {
  background: var(--gradient-success);
  color: white;
  border: none;
}

.btn-gradient-success:hover {
  opacity: 0.9;
  color: white;
}

@media (max-width: 768px) {
  .avatar-lg {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .card-gradient {
    padding: 1.5rem !important;
  }
}

@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
  }
  
  .card-gradient {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
  
  .card-header {
    background: white !important;
    color: black !important;
    border-bottom: 2px solid #dee2e6 !important;
  }
}
</style>