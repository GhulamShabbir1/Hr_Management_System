<template>
  <form @submit.prevent="handleSubmit">
    <!-- Error display -->
    <div v-if="errors.length" class="alert alert-danger mb-3">
      <ul class="mb-0">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Payroll ID (visible in edit mode only) -->
    <div class="mb-3" v-if="mode === 'edit'">
      <label class="form-label">Payroll ID</label>
      <input
        v-model="formData.id"
        type="text"
        class="form-control"
        readonly
        disabled
      >
    </div>

    <div class="mb-3">
      <label class="form-label required-field">Employee ID</label>
      <input
        v-model.number="formData.user_id"
        type="number"
        class="form-control"
        :class="{ 'is-invalid': fieldErrors.user_id }"
        required
        min="1"
      >
      <div v-if="fieldErrors.user_id" class="invalid-feedback">
        {{ fieldErrors.user_id[0] }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label required-field">Basic Pay</label>
      <input 
        v-model.number="formData.basic_pay" 
        type="number" 
        class="form-control"
        :class="{ 'is-invalid': fieldErrors.basic_pay }" 
        required 
        min="0" 
        step="0.01"
      >
      <div v-if="fieldErrors.basic_pay" class="invalid-feedback">
        {{ fieldErrors.basic_pay[0] }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Bonuses</label>
      <input 
        v-model.number="formData.bonuses" 
        type="number" 
        class="form-control" 
        min="0" 
        step="0.01"
      >
    </div>

    <div class="mb-3">
      <label class="form-label required-field">Net Salary</label>
      <input 
        v-model.number="formData.net_salary" 
        type="number" 
        class="form-control" 
        required 
        min="0" 
        step="0.01"
      >
    </div>

    <div class="mb-3">
      <label class="form-label required-field">Pay Date</label>
      <input 
        v-model="formData.pay_date" 
        type="date" 
        class="form-control"
        :class="{ 'is-invalid': fieldErrors.pay_date }" 
        required
      >
      <div v-if="fieldErrors.pay_date" class="invalid-feedback">
        {{ fieldErrors.pay_date[0] }}
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
        {{ mode === 'add' ? 'Add' : 'Update' }} Payroll
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    payroll: Object,
    mode: String,
    apiErrors: Object
  },
  data() {
    return {
      formData: {
        id: null,
        user_id: "",
        basic_pay: 0,
        bonuses: 0,
        net_salary: 0,
        pay_date: new Date().toISOString().split('T')[0]
      },
      errors: [],
      fieldErrors: {},
      loading: false
    };
  },
  watch: {
    payroll: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = {
            id: newVal.id || null,
            user_id: newVal.user_id || newVal['User ID'] || "",
            basic_pay: parseFloat(newVal.basic_pay || newVal['Basic Pay'] || 0),
            bonuses: parseFloat(newVal.bonuses || newVal['Bonuses'] || 0),
            net_salary: parseFloat(newVal.net_salary || newVal['Net Salary'] || 0),
            pay_date: newVal.pay_date || newVal['Pay Date'] || new Date().toISOString().split('T')[0]
          };
        } else {
          this.resetForm();
        }
      }
    },
    apiErrors: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.errors) {
          this.fieldErrors = newVal.errors;
          this.errors = ['Please fix the validation errors'];
        } else {
          this.fieldErrors = {};
          this.errors = [];
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        id: null,
        user_id: "",
        basic_pay: 0,
        bonuses: 0,
        net_salary: 0,
        pay_date: new Date().toISOString().split('T')[0]
      };
      this.errors = [];
      this.fieldErrors = {};
    },
    validateForm() {
      const requiredFields = ['user_id', 'basic_pay', 'net_salary', 'pay_date'];
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!this.formData[field]) {
          this.fieldErrors = {
            ...this.fieldErrors,
            [field]: [`The ${field.replace('_', ' ')} field is required.`]
          };
          isValid = false;
        }
      });

      if (!isValid) {
        this.errors = ['Please fill all required fields'];
      }

      return isValid;
    },
    async handleSubmit() {
      this.loading = true;
      this.errors = [];
      this.fieldErrors = {};

      if (!this.validateForm()) {
        this.loading = false;
        return;
      }

      try {
        const payload = {
          user_id: this.formData.user_id.toString(),
          basic_pay: this.formData.basic_pay.toString(),
          bonuses: this.formData.bonuses.toString(),
          net_salary: this.formData.net_salary.toString(),
          pay_date: this.formData.pay_date
        };

        if (this.mode === 'edit' && this.formData.id) {
          payload.id = this.formData.id.toString();
        }

        this.$emit('save', payload);
      } catch (error) {
        this.errors = ['Failed to prepare form data'];
        console.error('Form submission error:', error);
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

/* Style for readonly Payroll ID field */
input[readonly] {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.8;
}
</style>