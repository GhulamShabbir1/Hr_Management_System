<template>
  <div class="modal-backdrop">
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header bg-primary text-white">
        <h3 class="modal-title">
          <i class="bi" :class="mode === 'edit' ? 'bi-cash-stack' : 'bi-cash-coin'"></i>
          {{ mode === 'edit' ? 'Edit Payroll Record' : 'Create New Payroll' }}
        </h3>
        <button type="button" class="btn-close btn-close-white" @click="$emit('close')" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="save">
          <div class="mb-3">
            <label class="form-label">Employee</label>
            <input type="text" v-model="localData.name" class="form-control" :disabled="mode === 'edit'"
              placeholder="Select employee">
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Pay Period</label>
              <select v-model="localData.period" class="form-select" required>
                <option value="" disabled>Select Pay Period</option>
                <option value="Monthly">Monthly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Payment Date</label>
              <input type="date" v-model="localData.paymentDate" class="form-control" required :max="today">
            </div>
          </div>

          <div class="card mt-4 mb-3">
            <div class="card-header bg-light">
              <h6 class="mb-0">Salary Details</h6>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Basic Salary</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" v-model.number="localData.basic" class="form-control" min="0" step="0.01"
                      required>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Overtime</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" v-model.number="localData.overtime" class="form-control" min="0" step="0.01">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-header bg-light">
              <h6 class="mb-0">Bonuses & Allowances</h6>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Performance Bonus</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" v-model.number="localData.bonus" class="form-control" min="0" step="0.01">
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Allowances</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" v-model.number="localData.allowance" class="form-control" min="0" step="0.01">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header bg-light">
              <h6 class="mb-0">Deductions</h6>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Tax</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" v-model.number="localData.tax" class="form-control" min="0" step="0.01">
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Other Deductions</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" v-model.number="localData.deduction" class="form-control" min="0" step="0.01">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="alert alert-info">
            <div class="d-flex justify-content-between">
              <span class="fw-bold">Net Salary:</span>
              <span class="fw-bold">${{ calculateNetSalary }}</span>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" @click="$emit('close')" class="btn btn-outline-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ mode === 'edit' ? 'Update' : 'Create' }} Payroll
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppPayrollForm",
  props: {
    employee: {
      type: Object,
      default: () => ({
        name: "",
        basic: 0,
        bonus: 0,
        deduction: 0,
        overtime: 0,
        allowance: 0,
        tax: 0,
        period: "Monthly",
        paymentDate: new Date().toISOString().split('T')[0]
      })
    },
    mode: { type: String, default: "add" } // add or edit
  },
  data() {
    const today = new Date().toISOString().split('T')[0];
    return {
      today,
      loading: false,
      localData: {
        ...this.employee,
        overtime: this.employee.overtime || 0,
        allowance: this.employee.allowance || 0,
        tax: this.employee.tax || 0,
        period: this.employee.period || "Monthly",
        paymentDate: this.employee.paymentDate || today
      }
    };
  },
  computed: {
    calculateNetSalary() {
      const basic = parseFloat(this.localData.basic) || 0;
      const bonus = parseFloat(this.localData.bonus) || 0;
      const overtime = parseFloat(this.localData.overtime) || 0;
      const allowance = parseFloat(this.localData.allowance) || 0;
      const deduction = parseFloat(this.localData.deduction) || 0;
      const tax = parseFloat(this.localData.tax) || 0;

      return (basic + bonus + overtime + allowance - deduction - tax).toFixed(2);
    }
  },
  methods: {
    save() {
      this.loading = true;
      try {
        // Validate payment date
        if (new Date(this.localData.paymentDate) > new Date()) {
          throw new Error('Payment date cannot be in the future');
        }

        // Validate basic salary
        if (this.localData.basic <= 0) {
          throw new Error('Basic salary must be greater than 0');
        }

        // Emit the form data to parent
        this.$emit("save", {
          ...this.localData,
          netSalary: this.calculateNetSalary
        });
      } catch (error) {
        this.$emit("error", error.message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 1.5rem;
}

.btn-close {
  font-size: 0.75rem;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
  transform: rotate(90deg);
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-weight: 500;
}

.input-group-text {
  background-color: #f8f9fa;
  color: #495057;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.bg-primary {
  background-color: #0d6efd !important;
}

.text-white {
  color: white !important;
}

.bi {
  margin-right: 0.5rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}
</style>