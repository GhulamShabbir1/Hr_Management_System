<template>
  <div class="container-fluid p-4 animate__animated animate__fadeIn">
    <div class="card-gradient p-4 mx-auto" style="max-width: 1200px;">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 text-primary mb-0">
          <i class="bi bi-clipboard2-data me-2" aria-hidden="true"></i>
          Performance Review Summary
        </h1>
        <div class="d-flex gap-2">
          <button 
            @click="exportToExcel" 
            class="btn btn-outline-secondary"
            aria-label="Export to Excel"
            :disabled="reviews.length === 0"
          >
            <i class="bi bi-file-earmark-excel me-2" aria-hidden="true"></i> Export
          </button>
          <button 
            @click="refreshData" 
            class="btn btn-outline-primary"
            aria-label="Refresh data"
          >
            <i class="bi bi-arrow-clockwise me-2" aria-hidden="true"></i> Refresh
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <label for="employeeFilter" class="form-label">Employee</label>
          <select 
            id="employeeFilter"
            v-model="employeeFilter" 
            class="form-select"
            aria-label="Filter by employee"
          >
            <option value="all">All Employees</option>
            <option 
              v-for="emp in employees" 
              :key="emp.id" 
              :value="emp.id"
            >
              {{ emp.name }} ({{ emp.department || 'N/A' }})
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="quarterFilter" class="form-label">Quarter</label>
          <select 
            id="quarterFilter"
            v-model="quarterFilter" 
            class="form-select"
            aria-label="Filter by quarter"
          >
            <option value="all">All Quarters</option>
            <option value="Q1">Q1 (Jan-Mar)</option>
            <option value="Q2">Q2 (Apr-Jun)</option>
            <option value="Q3">Q3 (Jul-Sep)</option>
            <option value="Q4">Q4 (Oct-Dec)</option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="ratingFilter" class="form-label">Rating</label>
          <select 
            id="ratingFilter"
            v-model="ratingFilter" 
            class="form-select"
            aria-label="Filter by rating"
          >
            <option value="all">All Ratings</option>
            <option value="5">Outstanding (5★)</option>
            <option value="4">Exceeds Expectations (4★)</option>
            <option value="3">Meets Expectations (3★)</option>
            <option value="2">Below Expectations (2★)</option>
            <option value="1">Needs Improvement (1★)</option>
          </select>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card stat-card-1">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="text-muted">Total Reviews</h6>
                <h4 class="mb-0">{{ stats.totalReviews }}</h4>
              </div>
              <div class="icon-gradient icon-gradient-1">
                <i class="bi bi-clipboard2-check" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-card-2">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="text-muted">Avg. Rating</h6>
                <h4 class="mb-0">{{ stats.avgRating.toFixed(1) }}★</h4>
              </div>
              <div class="icon-gradient icon-gradient-2">
                <i class="bi bi-star-fill" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-card-3">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="text-muted">Top Performers</h6>
                <h4 class="mb-0">{{ stats.topPerformers }}</h4>
              </div>
              <div class="icon-gradient icon-gradient-3">
                <i class="bi bi-award" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-card-4">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="text-muted">Needs Improvement</h6>
                <h4 class="mb-0">{{ stats.needsImprovement }}</h4>
              </div>
              <div class="icon-gradient icon-gradient-4">
                <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Table -->
      <div class="table-responsive">
        <table class="table table-hover table-gradient" aria-label="Performance reviews summary">
          <thead>
            <tr>
              <th scope="col">Employee</th>
              <th scope="col">Quarter</th>
              <th scope="col">Tasks Completed</th>
              <th scope="col">Rating</th>
              <th scope="col">Key Achievements</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in filteredReviews" :key="review.id">
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar me-2" aria-hidden="true">
                    {{ getInitials(employeeName(review.employeeId)) }}
                  </div>
                  <div>
                    <div class="fw-bold">{{ employeeName(review.employeeId) }}</div>
                    <small class="text-muted">{{ employeeDept(review.employeeId) }}</small>
                  </div>
                </div>
              </td>
              <td>{{ review.quarter }}</td>
              <td>
                <div class="task-list">
                  <span 
                    v-for="taskId in review.taskIds" 
                    :key="taskId" 
                    class="badge bg-light text-dark me-1 mb-1"
                  >
                    {{ taskName(taskId) }}
                  </span>
                </div>
              </td>
              <td>
                <div class="rating-display">
                  <span 
                    v-for="n in 5" 
                    :key="n" 
                    class="me-1"
                    :class="n <= review.rating ? 'text-warning' : 'text-muted'"
                    :aria-label="`${n <= review.rating ? 'Filled' : 'Empty'} star`"
                  >
                    <i class="bi bi-star-fill"></i>
                  </span>
                  <span class="badge ms-2" :class="ratingClass(review.rating)">
                    {{ ratingText(review.rating) }}
                  </span>
                </div>
              </td>
              <td>
                <div class="truncate-text" :title="review.achievements">
                  {{ review.achievements || 'N/A' }}
                </div>
              </td>
              <td>
                <button 
                  @click="viewDetails(review)" 
                  class="btn btn-sm btn-outline-primary"
                  aria-label="View review details"
                >
                  <i class="bi bi-eye me-1" aria-hidden="true"></i> View
                </button>
              </td>
            </tr>
            <tr v-if="filteredReviews.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                No reviews found matching your criteria
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-4" aria-label="Reviews pagination">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button 
              class="page-link" 
              @click="prevPage"
              :disabled="currentPage === 1"
              aria-label="Previous page"
            >
              &laquo;
            </button>
          </li>
          <li 
            v-for="page in totalPages" 
            :key="page" 
            class="page-item" 
            :class="{ active: currentPage === page }"
          >
            <button 
              class="page-link" 
              @click="goToPage(page)"
              :aria-label="`Go to page ${page}`"
              :aria-current="currentPage === page ? 'page' : null"
            >
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button 
              class="page-link" 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              aria-label="Next page"
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Review Details Modal -->
    <div 
      class="modal fade" 
      id="reviewModal" 
      tabindex="-1" 
      aria-labelledby="reviewModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-gradient-primary text-white">
            <h2 id="reviewModalLabel" class="modal-title h5">Performance Review Details</h2>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedReview">
            <div class="row mb-4">
              <div class="col-md-6">
                <h3 class="h6 text-muted">Employee Information</h3>
                <div class="d-flex align-items-center">
                  <div class="avatar-lg me-3" aria-hidden="true">
                    {{ getInitials(employeeName(selectedReview.employeeId)) }}
                  </div>
                  <div>
                    <h4 class="mb-0">{{ employeeName(selectedReview.employeeId) }}</h4>
                    <p class="text-muted mb-0">{{ employeeDept(selectedReview.employeeId) }}</p>
                    <p class="text-muted mb-0">Quarter: {{ selectedReview.quarter }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h3 class="h6 text-muted">Performance Rating</h3>
                <div class="rating-display mb-2">
                  <span 
                    v-for="n in 5" 
                    :key="n" 
                    class="me-1"
                    :class="n <= selectedReview.rating ? 'text-warning' : 'text-muted'"
                    :aria-label="`${n <= selectedReview.rating ? 'Filled' : 'Empty'} star`"
                  >
                    <i class="bi bi-star-fill fs-3"></i>
                  </span>
                  <span class="badge fs-6 ms-2" :class="ratingClass(selectedReview.rating)">
                    {{ ratingText(selectedReview.rating) }}
                  </span>
                </div>
                <div class="mb-2">
                  <span class="fw-bold">Reviewed by:</span> {{ selectedReview.reviewer || 'Manager' }}
                </div>
                <div>
                  <span class="fw-bold">Date:</span> {{ formatDate(selectedReview.date) }}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="card mb-4">
                  <div class="card-header bg-light">
                    <h3 class="h6 mb-0">Tasks Completed</h3>
                  </div>
                  <div class="card-body">
                    <ul class="list-group list-group-flush">
                      <li 
                        v-for="taskId in selectedReview.taskIds" 
                        :key="taskId" 
                        class="list-group-item"
                      >
                        {{ taskName(taskId) }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header bg-light">
                    <h3 class="h6 mb-0">Review Summary</h3>
                  </div>
                  <div class="card-body">
                    <h4 class="h6 fw-bold">Key Achievements:</h4>
                    <p>{{ selectedReview.achievements || 'N/A' }}</p>
                    <h4 class="h6 fw-bold mt-3">Areas for Improvement:</h4>
                    <p>{{ selectedReview.improvements || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-header bg-light">
                <h3 class="h6 mb-0">Overall Comments</h3>
              </div>
              <div class="card-body">
                <p>{{ selectedReview.comments }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
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
import { Modal } from 'bootstrap';
import AppNotificationToast from '../announcements/AppNotificationToast.vue';

export default {
  name: "AppReviewSummary",
  components: { AppNotificationToast },
  props: {
    reviews: {
      type: Array,
      default: () => [],
      validator: value => Array.isArray(value)
    }
  },
  data() {
    return {
      employees: [
        { id: 1, name: "Ali Khan", department: "IT" },
        { id: 2, name: "Sara Ahmed", department: "HR" },
        { id: 3, name: "Omar Malik", department: "Finance" }
      ],
      tasks: [
        { id: 1, name: "Project Alpha", description: "Complete project documentation" },
        { id: 2, name: "Website Redesign", description: "Implement new UI components" },
        { id: 3, name: "Client Support", description: "Handle tier 2 support tickets" },
        { id: 4, name: "Budget Planning", description: "Prepare quarterly budget report" }
      ],
      employeeFilter: "all",
      quarterFilter: "all",
      ratingFilter: "all",
      currentPage: 1,
      perPage: 10,
      selectedReview: null,
      reviewModal: null,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      stats: {
        totalReviews: 0,
        avgRating: 0,
        topPerformers: 0,
        needsImprovement: 0
      },
      isLoading: false
    };
  },
  computed: {
    filteredReviews() {
      let filtered = [...this.reviews];
      
      // Apply filters
      if (this.employeeFilter !== "all") {
        filtered = filtered.filter(r => r.employeeId == this.employeeFilter);
      }
      
      if (this.quarterFilter !== "all") {
        filtered = filtered.filter(r => r.quarter === this.quarterFilter);
      }
      
      if (this.ratingFilter !== "all") {
        filtered = filtered.filter(r => r.rating == this.ratingFilter);
      }
      
      // Update stats
      this.updateStats(filtered);
      
      // Pagination
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      
      return filtered.slice(start, end);
    },
    totalPages() {
      let filtered = [...this.reviews];
      
      if (this.employeeFilter !== "all") {
        filtered = filtered.filter(r => r.employeeId == this.employeeFilter);
      }
      
      if (this.quarterFilter !== "all") {
        filtered = filtered.filter(r => r.quarter === this.quarterFilter);
      }
      
      if (this.ratingFilter !== "all") {
        filtered = filtered.filter(r => r.rating == this.ratingFilter);
      }
      
      return Math.ceil(filtered.length / this.perPage) || 1;
    }
  },
  methods: {
    employeeName(id) {
      const emp = this.employees.find(e => e.id === id);
      return emp ? emp.name : "Unknown Employee";
    },
    employeeDept(id) {
      const emp = this.employees.find(e => e.id === id);
      return emp ? emp.department : "N/A";
    },
    taskName(id) {
      const task = this.tasks.find(t => t.id === id);
      return task ? task.name : "Unknown Task";
    },
    getInitials(name) {
      if (!name) return '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    ratingText(rating) {
      const texts = [
        "Needs Improvement",
        "Below Expectations",
        "Meets Expectations",
        "Exceeds Expectations",
        "Outstanding"
      ];
      return texts[rating - 1] || "Not rated";
    },
    ratingClass(rating) {
      const classes = [
        "bg-danger",
        "bg-warning",
        "bg-primary",
        "bg-info",
        "bg-success"
      ];
      return classes[rating - 1] || "bg-secondary";
    },
    formatDate(dateStr) {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
    },
    viewDetails(review) {
      this.selectedReview = review;
      this.reviewModal.show();
    },
    updateStats(reviews) {
      this.stats.totalReviews = reviews.length;
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        this.stats.avgRating = totalRating / reviews.length;
        this.stats.topPerformers = reviews.filter(r => r.rating >= 4).length;
        this.stats.needsImprovement = reviews.filter(r => r.rating <= 2).length;
      } else {
        this.stats.avgRating = 0;
        this.stats.topPerformers = 0;
        this.stats.needsImprovement = 0;
      }
    },
    async exportToExcel() {
      if (this.reviews.length === 0) return;
      
      this.isLoading = true;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.showNotification('Performance reviews exported to Excel');
      } catch (error) {
        console.error('Export error:', error);
        this.showNotification('Failed to export reviews', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    refreshData() {
      this.$emit('refresh');
      this.showNotification('Data refreshed');
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
    showNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
    }
  },
  mounted() {
    this.reviewModal = new Modal(document.getElementById('reviewModal'));
    this.updateStats(this.reviews);
  },
  watch: {
    reviews() {
      this.updateStats(this.reviews);
      this.currentPage = 1; // Reset to first page when reviews change
    },
    employeeFilter() {
      this.currentPage = 1;
    },
    quarterFilter() {
      this.currentPage = 1;
    },
    ratingFilter() {
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.avatar-lg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
}

.table-gradient thead th {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
  position: sticky;
  top: 0;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.task-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.rating-display {
  display: flex;
  align-items: center;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.icon-gradient {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-gradient-1 { background: linear-gradient(135deg, #3a7bd5, #00d2ff); }
.icon-gradient-2 { background: linear-gradient(135deg, #f46b45, #eea849); }
.icon-gradient-3 { background: linear-gradient(135deg, #11998e, #38ef7d); }
.icon-gradient-4 { background: linear-gradient(135deg, #ff416c, #ff4b2b); }

@media (max-width: 768px) {
  .truncate-text {
    max-width: 150px;
  }
  
  .stat-card {
    padding: 0.75rem;
  }
  
  .icon-gradient {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  border-color: #3a7bd5;
}

.page-link {
  color: #3a7bd5;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>