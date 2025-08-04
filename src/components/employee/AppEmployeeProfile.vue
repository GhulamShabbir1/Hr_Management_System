<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h2 text-primary mb-0">Employee Profile</h2>
      <button 
        @click="$router.push('/employees')" 
        class="btn btn-outline-secondary"
      >
        <i class="bi bi-arrow-left me-2"></i> Back to List
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading employee data...</p>
    </div>

    <div v-else-if="employee" class="card p-4 profile-card">
      <div class="row">
        <!-- Employee Photo and Basic Info -->
        <div class="col-md-4 text-center">
          <div class="avatar-profile mb-3">
            {{ getInitials(employee.name) }}
          </div>
          <h3 class="h4">{{ employee.name }}</h3>
          <p class="text-muted">{{ employee.position }}</p>
          <div class="mb-3">
            <span class="badge" :class="employee.active ? 'bg-success' : 'bg-secondary'">
              {{ employee.active ? 'Active' : 'Inactive' }}
            </span>
            <span class="badge ms-2" :class="roleClass(employee.role)">
              {{ employee.role }}
            </span>
          </div>
          <hr class="d-md-none">
        </div>

        <!-- Employee Details -->
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <h5 class="text-muted mb-1">Employee ID</h5>
                <p>{{ employee.id }}</p>
              </div>
              <div class="mb-3">
                <h5 class="text-muted mb-1">Department</h5>
                <p>{{ employee.department || 'Not specified' }}</p>
              </div>
              <div class="mb-3">
                <h5 class="text-muted mb-1">Join Date</h5>
                <p>{{ formatDate(employee.joinDate) }}</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <h5 class="text-muted mb-1">Email</h5>
                <p>
                  <a :href="`mailto:${employee.email}`">{{ employee.email }}</a>
                </p>
              </div>
              <div class="mb-3">
                <h5 class="text-muted mb-1">Phone</h5>
                <p>{{ employee.phone || 'Not specified' }}</p>
              </div>
              <div class="mb-3">
                <h5 class="text-muted mb-1">Address</h5>
                <p>{{ employee.address || 'Not specified' }}</p>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="mt-4">
            <h4 class="h5 text-primary mb-3">Additional Information</h4>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <h5 class="text-muted mb-1">Emergency Contact</h5>
                  <p>{{ employee.emergencyContact || 'Not specified' }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <h5 class="text-muted mb-1">Employment Type</h5>
                  <p>{{ employee.employmentType || 'Not specified' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button 
          @click="editEmployee(employee)" 
          class="btn btn-primary"
          v-if="canEdit"
        >
          <i class="bi bi-pencil me-2"></i> Edit Profile
        </button>
        <button 
          @click="toggleStatus(employee.id)" 
          class="btn"
          :class="employee.active ? 'btn-warning' : 'btn-success'"
          v-if="canEdit"
        >
          <i class="bi me-2" :class="employee.active ? 'bi-person-x' : 'bi-person-check'"></i>
          {{ employee.active ? 'Deactivate' : 'Activate' }}
        </button>
      </div>
    </div>

    <div v-else class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>
      Employee not found or data could not be loaded.
    </div>

    <!-- Employee Edit Modal -->
    <AppEmployeeForm
      v-if="showEditForm"
      :employee="employeeToEdit"
      @save="handleUpdate"
      @close="closeEditForm"
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
import { mapGetters, mapActions } from "vuex";
import AppEmployeeForm from "./AppEmployeeForm.vue";
import AppNotificationToast from "../announcements/AppNotificationToast.vue";

export default {
  name: "AppEmployeeProfile",
  components: { AppEmployeeForm, AppNotificationToast },
  data() {
    return {
      loading: false,
      showEditForm: false,
      employeeToEdit: null,
      showToast: false,
      toastMessage: '',
      toastType: 'success'
    };
  },
  computed: {
    ...mapGetters("employees", ["getEmployeeById"]),
    ...mapGetters("auth", ["userRole"]),
    employee() {
      return this.getEmployeeById(this.$route.params.id);
    },
    canEdit() {
      return this.userRole === 'HR' || this.userRole === 'Admin';
    }
  },
  methods: {
    ...mapActions("employees", ["fetchEmployee", "toggleStatus", "updateEmployee"]),
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
    formatDate(dateStr) {
      if (!dateStr) return 'Not specified';
      return new Date(dateStr).toLocaleDateString();
    },
    editEmployee(employee) {
      this.employeeToEdit = { ...employee };
      this.showEditForm = true;
    },
    closeEditForm() {
      this.showEditForm = false;
      this.employeeToEdit = null;
    },
    async handleUpdate(employee) {
      try {
        await this.updateEmployee({ id: employee.id, data: employee });
        this.showNotification('Employee updated successfully');
        this.closeEditForm();
        await this.fetchEmployee(this.$route.params.id);
      } catch (error) {
        this.showNotification(error.response?.data?.message || 'Failed to update employee', 'error');
      }
    },
    showNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
    }
  },
  async created() {
    this.loading = true;
    try {
      if (!this.employee) {
        await this.fetchEmployee(this.$route.params.id);
      }
    } catch (error) {
      this.showNotification('Failed to load employee data', 'error');
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.profile-card {
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.avatar-profile {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 auto;
}

hr {
  margin: 1.5rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
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
}

.bg-secondary {
  background-color: #6c757d !important;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #ffca2c;
  border-color: #ffc720;
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

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
}

.badge {
  padding: 0.5em 0.75em;
  font-weight: 500;
}

a {
  color: #0d6efd;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>