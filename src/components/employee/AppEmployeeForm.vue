<template>
  <div class="modal-backdrop">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h3 class="modal-title">
          <i class="bi" :class="employee.id ? 'bi-person-gear' : 'bi-person-plus'"></i>
          {{ employee.id ? 'Edit Employee' : 'Add New Employee' }}
        </h3>
        <button 
          type="button" 
          class="btn-close btn-close-white" 
          @click="$emit('close')"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="form-label">Full Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="form-control" 
              required
              placeholder="Enter employee's full name"
            >
          </div>
          
          <div class="mb-3">
            <label class="form-label">Email Address</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="form-control" 
              required
              placeholder="employee@company.com"
            >
            <div class="form-text">Must be a valid email address</div>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Department</label>
            <select v-model="form.department" class="form-select" required>
              <option value="" disabled>Select Department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Position</label>
            <input 
              v-model="form.position" 
              type="text" 
              class="form-control" 
              required
              placeholder="Employee's job title"
            >
          </div>
          
          <div class="mb-3">
            <label class="form-label">Role</label>
            <select v-model="form.role" class="form-select" required>
              <option value="" disabled>Select Role</option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR Personnel</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Join Date</label>
            <input 
              v-model="form.joinDate" 
              type="date" 
              class="form-control" 
              required
              :max="today"
            >
          </div>
          
          <div class="mb-4">
            <div class="form-check form-switch">
              <input 
                v-model="form.active" 
                class="form-check-input" 
                type="checkbox" 
                id="activeSwitch"
              >
              <label class="form-check-label" for="activeSwitch">
                Active Employee
              </label>
            </div>
          </div>
          
          <div class="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ employee.id ? 'Update' : 'Create' }} Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppEmployeeForm",
  props: {
    employee: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const today = new Date().toISOString().split('T')[0];
    return {
      today,
      loading: false,
      departments: [
        { id: 1, name: 'Human Resources' },
        { id: 2, name: 'Information Technology' },
        { id: 3, name: 'Finance' },
        { id: 4, name: 'Operations' },
        { id: 5, name: 'Marketing' }
      ],
      form: {
        id: this.employee.id || null,
        name: this.employee.name || "",
        email: this.employee.email || "",
        department: this.employee.department || "",
        position: this.employee.position || "",
        role: this.employee.role || "Employee",
        joinDate: this.employee.joinDate || today,
        active: this.employee.active ?? true
      }
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      try {
        // Validate email format
        if (!this.validateEmail(this.form.email)) {
          throw new Error('Please enter a valid email address');
        }

        // Validate join date
        if (new Date(this.form.joinDate) > new Date()) {
          throw new Error('Join date cannot be in the future');
        }

        // Emit the form data to parent
        this.$emit("save", this.form);
      } catch (error) {
        this.$emit("error", error.message);
      } finally {
        this.loading = false;
      }
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
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
  max-width: 500px;
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

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-switch .form-check-input {
  width: 2.5em;
  margin-left: -2.5em;
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

.btn-primary:disabled {
  background-color: #0d6efd;
  border-color: #0d6efd;
  opacity: 0.65;
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
</style>