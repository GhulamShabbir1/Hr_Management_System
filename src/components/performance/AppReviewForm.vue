<template>
  <div class="container-fluid p-4 animate__animated animate__fadeIn">
    <div class="card-gradient p-4 mx-auto" style="max-width: 800px;">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 text-primary mb-0">
          <i class="bi bi-clipboard2-check me-2" aria-hidden="true"></i>
          Quarterly Performance Review
        </h1>
        <button 
          @click="$router.go(-1)" 
          class="btn btn-outline-secondary"
          aria-label="Go back to previous page"
        >
          <i class="bi bi-arrow-left me-2" aria-hidden="true"></i> Back
        </button>
      </div>

      <form @submit.prevent="submitReview" novalidate>
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label for="employeeSelect" class="form-label">Employee <span class="text-danger">*</span></label>
            <select 
              id="employeeSelect"
              v-model="review.employeeId" 
              required 
              class="form-select"
              @change="loadEmployeeTasks"
              :disabled="loading"
            >
              <option disabled value="">Select Employee</option>
              <option 
                v-for="emp in employees" 
                :key="emp.id" 
                :value="emp.id"
              >
                {{ emp.name }} ({{ emp.department || 'N/A' }})
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="quarterSelect" class="form-label">Quarter <span class="text-danger">*</span></label>
            <select 
              id="quarterSelect"
              v-model="review.quarter" 
              class="form-select" 
              required
              :disabled="loading"
            >
              <option value="Q1">Q1 (Jan-Mar)</option>
              <option value="Q2">Q2 (Apr-Jun)</option>
              <option value="Q3">Q3 (Jul-Sep)</option>
              <option value="Q4">Q4 (Oct-Dec)</option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label">Tasks Completed <span class="text-danger">*</span></label>
          <div class="card">
            <div class="card-body">
              <div v-if="filteredTasks.length > 0" class="mb-3">
                <div 
                  v-for="task in filteredTasks" 
                  :key="task.id" 
                  class="form-check mb-2"
                >
                  <input 
                    type="checkbox" 
                    v-model="review.taskIds" 
                    :value="task.id" 
                    :id="`task-${task.id}`" 
                    class="form-check-input"
                    :disabled="loading"
                  >
                  <label :for="`task-${task.id}`" class="form-check-label">
                    {{ task.name }}
                    <small class="text-muted d-block">{{ task.description || 'No description' }}</small>
                  </label>
                </div>
              </div>
              <div v-else class="text-muted">
                No tasks available for selected employee
              </div>
              <button 
                type="button" 
                @click="showTaskModal = true" 
                class="btn btn-sm btn-outline-primary"
                :disabled="!review.employeeId || loading"
              >
                <i class="bi bi-plus me-1" aria-hidden="true"></i> Add New Task
              </button>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label">Performance Rating <span class="text-danger">*</span></label>
          <div class="card">
            <div class="card-body">
              <div class="rating-container text-center mb-3">
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  @click="review.rating = n"
                  class="btn btn-rating"
                  :class="{
                    'active': n <= review.rating,
                    'text-warning': n <= review.rating,
                    'text-muted': n > review.rating
                  }"
                  :aria-label="`Rate ${n} out of 5`"
                  :disabled="loading"
                >
                  <i class="bi bi-star-fill fs-2"></i>
                </button>
              </div>
              <div class="text-center">
                <span class="badge bg-primary">
                  {{ ratingText }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label for="achievements" class="form-label">Key Achievements</label>
          <textarea 
            id="achievements"
            v-model="review.achievements" 
            rows="3" 
            class="form-control" 
            placeholder="List the employee's key achievements this quarter"
            :disabled="loading"
          ></textarea>
        </div>

        <div class="mb-4">
          <label for="improvements" class="form-label">Areas for Improvement</label>
          <textarea 
            id="improvements"
            v-model="review.improvements" 
            rows="3" 
            class="form-control" 
            placeholder="Suggest areas for professional development"
            :disabled="loading"
          ></textarea>
        </div>

        <div class="mb-4">
          <label for="comments" class="form-label">Overall Comments <span class="text-danger">*</span></label>
          <textarea 
            id="comments"
            v-model="review.comments" 
            rows="3" 
            class="form-control" 
            placeholder="Provide overall feedback"
            required
            :disabled="loading"
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button 
            type="button" 
            @click="resetForm" 
            class="btn btn-outline-secondary"
            :disabled="loading"
          >
            Reset Form
          </button>
          <button 
            type="submit" 
            class="btn btn-gradient-primary"
            :disabled="loading || !isFormValid"
          >
            <template v-if="loading">
              <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              Processing...
            </template>
            <template v-else>
              Submit Review
            </template>
          </button>
        </div>
      </form>
    </div>

    <!-- Task Modal -->
    <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true" v-if="showTaskModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-gradient-primary text-white">
            <h2 class="modal-title h5" id="taskModalLabel">Add New Task</h2>
            <button type="button" class="btn-close btn-close-white" @click="showTaskModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="taskName" class="form-label">Task Name <span class="text-danger">*</span></label>
              <input id="taskName" v-model="newTask.name" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="taskDescription" class="form-label">Description</label>
              <textarea id="taskDescription" v-model="newTask.description" class="form-control" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showTaskModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="addTask" :disabled="!newTask.name">
              Add Task
            </button>
          </div>
        </div>
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
import { Modal } from 'bootstrap';
import AppToast from './AppToast.vue';

export default {
  name: "AppReviewForm",
  components: { AppToast },
  data() {
    return {
      employees: [
        { id: 1, name: "Ali Khan", department: "IT" },
        { id: 2, name: "Sara Ahmed", department: "HR" },
        { id: 3, name: "Omar Malik", department: "Finance" },
      ],
      allTasks: [
        { id: 1, name: "Project Alpha", description: "Complete project documentation", employeeId: 1 },
        { id: 2, name: "Website Redesign", description: "Implement new UI components", employeeId: 1 },
        { id: 3, name: "Client Support", description: "Handle tier 2 support tickets", employeeId: 2 },
        { id: 4, name: "Budget Planning", description: "Prepare quarterly budget report", employeeId: 3 },
      ],
      review: {
        employeeId: "",
        quarter: "Q" + (Math.floor(new Date().getMonth() / 3) + 1),
        taskIds: [],
        rating: 0,
        achievements: "",
        improvements: "",
        comments: "",
        reviewer: "Manager Name"
      },
      newTask: {
        name: "",
        description: "",
        employeeId: null
      },
      filteredTasks: [],
      showTaskModal: false,
      loading: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      taskModal: null
    };
  },
  computed: {
    ratingText() {
      const ratings = [
        "Needs Improvement",
        "Below Expectations",
        "Meets Expectations",
        "Exceeds Expectations",
        "Outstanding"
      ];
      return this.review.rating > 0 ? ratings[this.review.rating - 1] : "Not rated";
    },
    isFormValid() {
      return (
        this.review.employeeId &&
        this.review.quarter &&
        this.review.rating > 0 &&
        this.review.taskIds.length > 0 &&
        this.review.comments.trim()
      );
    }
  },
  methods: {
    loadEmployeeTasks() {
      if (!this.review.employeeId) {
        this.filteredTasks = [];
        return;
      }
      this.filteredTasks = this.allTasks.filter(
        task => task.employeeId == this.review.employeeId
      );
      this.newTask.employeeId = this.review.employeeId;
      this.review.taskIds = [];
    },
    async submitReview() {
      if (!this.isFormValid) {
        this.showNotification('Please complete all required fields', 'error');
        return;
      }

      this.loading = true;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const reviewData = {
          ...this.review,
          id: Date.now(),
          date: new Date().toISOString(),
          tasks: this.filteredTasks.filter(t => this.review.taskIds.includes(t.id))
        };

        // Save to local storage for demo
        const savedReviews = JSON.parse(localStorage.getItem('performanceReviews')) || [];
        savedReviews.push(reviewData);
        localStorage.setItem('performanceReviews', JSON.stringify(savedReviews));

        this.showNotification('Performance review submitted successfully!');
        this.resetForm();
        this.$emit('review-submitted', reviewData);
      } catch (error) {
        console.error('Review submission error:', error);
        this.showNotification('Failed to submit review. Please try again.', 'error');
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.review = {
        employeeId: "",
        quarter: "Q" + (Math.floor(new Date().getMonth() / 3) + 1),
        taskIds: [],
        rating: 0,
        achievements: "",
        improvements: "",
        comments: "",
        reviewer: "Manager Name"
      };
      this.filteredTasks = [];
    },
    addTask() {
      if (!this.newTask.name.trim()) {
        this.showNotification('Task name is required', 'error');
        return;
      }

      const newTask = {
        id: Date.now(),
        ...this.newTask,
        employeeId: this.review.employeeId
      };

      this.allTasks.push(newTask);
      this.filteredTasks.push(newTask);
      this.review.taskIds.push(newTask.id);
      this.showTaskModal = false;
      this.newTask = { name: "", description: "", employeeId: this.review.employeeId };
      this.showNotification('Task added successfully');
    },
    showNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
    }
  },
  mounted() {
    this.taskModal = new Modal(document.getElementById('taskModal'));
    this.$watch('showTaskModal', (val) => {
      if (val) {
        this.taskModal.show();
      } else {
        this.taskModal.hide();
        this.newTask = { name: "", description: "", employeeId: this.review.employeeId };
      }
    });
  }
};
</script>

<style scoped>
.rating-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.btn-rating {
  background: none;
  border: none;
  padding: 0;
  transition: transform 0.2s;
}

.btn-rating:hover:not(:disabled) {
  transform: scale(1.2);
}

.btn-rating.active {
  transform: scale(1.3);
}

.card-gradient {
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background: white;
}

.btn-gradient-primary {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
  border: none;
}

.btn-gradient-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.65;
}

.form-control:disabled, .form-select:disabled {
  background-color: #f8f9fa;
  opacity: 1;
}
</style>