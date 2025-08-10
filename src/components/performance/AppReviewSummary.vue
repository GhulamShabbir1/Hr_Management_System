<template>
  <div class="container-fluid p-4 animate__animated animate__fadeIn">
    <div class="card-gradient p-4 mx-auto" style="max-width: 1200px;">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 text-primary mb-0">
          <i class="bi bi-clipboard2-data me-2" aria-hidden="true"></i>
          Performance Review Summary
        </h1>
        <div class="d-flex gap-2">
          <button @click="exportToExcel" class="btn btn-outline-secondary" aria-label="Export to Excel"
            :disabled="reviews.length === 0 || loading">
            <i class="bi bi-file-earmark-excel me-2" aria-hidden="true"></i> Export
          </button>
          <button @click="refreshData" class="btn btn-outline-primary" aria-label="Refresh data" :disabled="loading">
            <i class="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
            <span v-if="!loading">Refresh</span>
            <span v-else>Refreshing...</span>
          </button>
          <button @click="showTaskEvaluation = true" class="btn btn-success" aria-label="Evaluate Tasks">
            <i class="bi bi-check-circle me-2" aria-hidden="true"></i> Evaluate Tasks
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading performance data...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
        <button @click="loadInitialData" class="btn btn-sm btn-outline-danger ms-2">
          Retry
        </button>
      </div>

      <!-- Main -->
      <div v-else>
        <!-- Task Evaluation -->
        <div v-if="showTaskEvaluation" class="card mb-4 task-evaluation-card">
          <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h3 class="h5 mb-0">Task Evaluation</h3>
            <button @click="showTaskEvaluation = false" class="btn btn-sm btn-outline-light">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Employee</label>
                <select v-model="taskEvaluation.employeeId" class="form-select">
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Task</label>
                <select v-model="taskEvaluation.taskId" class="form-select">
                  <option v-for="task in tasks" :key="task.id" :value="task.id">
                    {{ task.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Rating (1-5)</label>
                <input v-model.number="taskEvaluation.rating" type="number" min="1" max="5" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label">Feedback</label>
                <textarea v-model="taskEvaluation.feedback" class="form-control" rows="3"></textarea>
              </div>
              <div class="col-12 d-flex justify-content-end gap-2">
                <button @click="showTaskEvaluation = false" class="btn btn-outline-secondary">Cancel</button>
                <button @click="submitTaskEvaluation" class="btn btn-success">
                  <i class="bi bi-check-circle me-2"></i> Submit Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <label for="employeeFilter" class="form-label">Employee</label>
            <select id="employeeFilter" v-model="employeeFilter" class="form-select" aria-label="Filter by employee">
              <option value="all">All Employees</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.name }} ({{ emp.department || 'N/A' }})
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="quarterFilter" class="form-label">Quarter</label>
            <select id="quarterFilter" v-model="quarterFilter" class="form-select" aria-label="Filter by quarter">
              <option value="all">All Quarters</option>
              <option value="Q1">Q1 (Jan-Mar)</option>
              <option value="Q2">Q2 (Apr-Jun)</option>
              <option value="Q3">Q3 (Jul-Sep)</option>
              <option value="Q4">Q4 (Oct-Dec)</option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="ratingFilter" class="form-label">Rating</label>
            <select id="ratingFilter" v-model="ratingFilter" class="form-select" aria-label="Filter by rating">
              <option value="all">All Ratings</option>
              <option value="5">Outstanding (5★)</option>
              <option value="4">Exceeds Expectations (4★)</option>
              <option value="3">Meets Expectations (3★)</option>
              <option value="2">Below Expectations (2★)</option>
              <option value="1">Needs Improvement (1★)</option>
            </select>
          </div>
        </div>

        <!-- Stats -->
        <div class="row mb-4">
          <div class="col-md-3" v-for="i in 4" :key="i">
            <div :class="`stat-card stat-card-${i}`">
              <div class="d-flex justify-content-between">
                <div v-if="i === 1">
                  <h6 class="text-muted">Total Reviews</h6>
                  <h4 class="mb-0">{{ stats.totalReviews }}</h4>
                </div>
                <div v-else-if="i === 2">
                  <h6 class="text-muted">Avg. Rating</h6>
                  <h4 class="mb-0">{{ stats.avgRating.toFixed(1) }}★</h4>
                </div>
                <div v-else-if="i === 3">
                  <h6 class="text-muted">Top Performers</h6>
                  <h4 class="mb-0">{{ stats.topPerformers }}</h4>
                </div>
                <div v-else>
                  <h6 class="text-muted">Needs Improvement</h6>
                  <h4 class="mb-0">{{ stats.needsImprovement }}</h4>
                </div>
                <div :class="`icon-gradient icon-gradient-${i}`">
                  <i :class="[
                    i === 1 ? 'bi bi-clipboard2-check' : '',
                    i === 2 ? 'bi bi-star-fill' : '',
                    i === 3 ? 'bi bi-award' : '',
                    i === 4 ? 'bi bi-exclamation-triangle' : ''
                  ]" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="table-responsive">
          <table class="table table-hover table-gradient" aria-label="Performance reviews summary">
            <thead>
              <tr>
                <th scope="col">Employee</th>
                <th scope="col">Rating</th>
                <th scope="col">Feedback</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(review, idx) in filteredReviews"
                :key="review.id || (review.userId + '-' + review.date) || idx">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar me-2" aria-hidden="true">
                      {{ getInitials(employeeName(review.userId)) }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ employeeName(review.userId) }}</div>
                      <small class="text-muted">{{ employeeDept(review.userId) }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="rating-display">
                    <span v-for="n in 5" :key="n" class="me-1"
                      :class="n <= review.rating ? 'text-warning' : 'text-muted'"
                      :aria-label="`${n <= review.rating ? 'Filled' : 'Empty'} star`">
                      <i class="bi bi-star-fill"></i>
                    </span>
                    <span class="badge ms-2" :class="ratingClass(review.rating)">
                      {{ ratingText(review.rating) }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="truncate-text" :title="review.feedback">
                    {{ review.feedback || 'No feedback provided' }}
                  </div>
                </td>
                <td>{{ formatDate(review.date) }}</td>
                <td>
                  <button @click="viewDetails(review)" class="btn btn-sm btn-outline-primary"
                    aria-label="View review details">
                    <i class="bi bi-eye me-1" aria-hidden="true"></i> View
                  </button>
                  <button @click="editReview(review)" class="btn btn-sm btn-outline-warning ms-2"
                    aria-label="Edit review">
                    <i class="bi bi-pencil me-1" aria-hidden="true"></i> Edit
                  </button>
                </td>
              </tr>
              <tr v-if="filteredReviews.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
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
              <button class="page-link" @click="prevPage" :disabled="currentPage === 1" aria-label="Previous page">
                &laquo;
              </button>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="goToPage(page)" :aria-label="`Go to page ${page}`"
                :aria-current="currentPage === page ? 'page' : null">
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages" aria-label="Next page">
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Review Modal -->
    <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true"
      ref="reviewModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-gradient-primary text-white">
            <h2 id="reviewModalLabel" class="modal-title h5">
              {{ isEditing ? 'Edit' : 'View' }} Performance Review
            </h2>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedReview">
            <div class="row mb-4">
              <div class="col-md-6">
                <h3 class="h6 text-muted">Employee Information</h3>
                <div class="d-flex align-items-center">
                  <div class="avatar-lg me-3" aria-hidden="true">
                    {{ getInitials(employeeName(selectedReview.userId)) }}
                  </div>
                  <div>
                    <h4 class="mb-0">{{ employeeName(selectedReview.userId) }}</h4>
                    <p class="text-muted mb-0">{{ employeeDept(selectedReview.userId) }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h3 class="h6 text-muted">Performance Rating</h3>
                <div class="rating-display mb-2">
                  <span v-for="n in 5" :key="n" class="me-1"
                    :class="n <= selectedReview.rating ? 'text-warning' : 'text-muted'"
                    :aria-label="`${n <= selectedReview.rating ? 'Filled' : 'Empty'} star`">
                    <i class="bi bi-star-fill fs-3"></i>
                  </span>
                  <span class="badge fs-6 ms-2" :class="ratingClass(selectedReview.rating)">
                    {{ ratingText(selectedReview.rating) }}
                  </span>
                </div>
                <div>
                  <span class="fw-bold">Date:</span> {{ formatDate(selectedReview.date) }}
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label">Feedback</label>
              <textarea v-model="selectedReview.feedback" class="form-control" rows="3"
                :readonly="!isEditing"></textarea>
            </div>

            <div v-if="isEditing" class="d-flex justify-content-end gap-2">
              <button @click="cancelEdit" class="btn btn-outline-secondary">
                Cancel
              </button>
              <button @click="saveReview" class="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
          <div class="modal-footer" v-if="!isEditing">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <AppNotificationToast :show="showToast" :message="toastMessage" :type="toastType" @close="showToast = false" />
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import AppNotificationToast from '../announcements/AppNotificationToast.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AppReviewSummary',
  components: { AppNotificationToast },
  data() {
    return {
      employees: [],
      tasks: [],
      employeeFilter: 'all',
      quarterFilter: 'all',
      ratingFilter: 'all',
      currentPage: 1,
      perPage: 10,
      selectedReview: null,
      reviewModal: null,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      isEditing: false,
      originalReview: null,
      showTaskEvaluation: false,
      taskEvaluation: {
        employeeId: null,
        taskId: null,
        rating: 3,
        feedback: ''
      },
      stats: {
        totalReviews: 0,
        avgRating: 0,
        topPerformers: 0,
        needsImprovement: 0
      }
    };
  },
  computed: {
    ...mapState('performance', {
      performanceReviews: (state) => state.reviews || [],
      loading: (state) => state.loading,
      error: (state) => state.error
    }),
    reviews() {
      return Array.isArray(this.performanceReviews) ? this.performanceReviews : [];
    },
    filteredReviews() {
      let filtered = [...this.reviews];

      if (this.employeeFilter !== 'all') {
        filtered = filtered.filter((r) => String(r.userId) === String(this.employeeFilter));
      }

      if (this.quarterFilter !== 'all') {
        filtered = filtered.filter((r) => {
          const date = new Date(r.date);
          const month = date.getMonth() + 1;
          if (this.quarterFilter === 'Q1') return month >= 1 && month <= 3;
          if (this.quarterFilter === 'Q2') return month >= 4 && month <= 6;
          if (this.quarterFilter === 'Q3') return month >= 7 && month <= 9;
          if (this.quarterFilter === 'Q4') return month >= 10 && month <= 12;
          return true;
        });
      }

      if (this.ratingFilter !== 'all') {
        filtered = filtered.filter((r) => String(r.rating) === String(this.ratingFilter));
      }

      this.updateStats(filtered);

      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;

      return filtered.slice(start, end);
    },
    totalPages() {
      let filtered = [...this.reviews];

      if (this.employeeFilter !== 'all') {
        filtered = filtered.filter((r) => String(r.userId) === String(this.employeeFilter));
      }

      if (this.quarterFilter !== 'all') {
        filtered = filtered.filter((r) => {
          const date = new Date(r.date);
          const month = date.getMonth() + 1;
          if (this.quarterFilter === 'Q1') return month >= 1 && month <= 3;
          if (this.quarterFilter === 'Q2') return month >= 4 && month <= 6;
          if (this.quarterFilter === 'Q3') return month >= 7 && month <= 9;
          if (this.quarterFilter === 'Q4') return month >= 10 && month <= 12;
          return true;
        });
      }

      if (this.ratingFilter !== 'all') {
        filtered = filtered.filter((r) => String(r.rating) === String(this.ratingFilter));
      }

      return Math.ceil(filtered.length / this.perPage) || 1;
    }
  },
  methods: {
    ...mapActions('performance', ['fetchReviews', 'addReview', 'updateReview', 'deleteReview']),
    async loadInitialData() {
      try {
        this.employeeFilter = 'all';
        this.quarterFilter = 'all';
        this.ratingFilter = 'all';

        const [reviewsResponse, employeesResponse, tasksResponse] = await Promise.all([
          this.fetchReviews(),
          this.$axios.get('/list-users'),
          this.$axios.get('/list-task')
        ]);

        if (!reviewsResponse?.success) {
          throw new Error(reviewsResponse?.message || 'Failed to fetch reviews');
        }

        const extract = (r) => r?.data?.data ?? r?.data?.items ?? r?.data ?? r ?? [];
        const employeesPayload = extract(employeesResponse);
        const tasksPayload = extract(tasksResponse);

        this.employees = (Array.isArray(employeesPayload) ? employeesPayload : [])
          .map(e => ({
            id: e.id ?? e.user_id ?? e.userId ?? e.employee_id ?? e.employeeId ?? null,
            name: e.name ?? e.full_name ?? e.email ?? `User ${e.id ?? ''}`,
            department: e.department ?? e.dept ?? ''
          }))
          .filter(e => e.id != null);

        this.tasks = (Array.isArray(tasksPayload) ? tasksPayload : [])
          .map(t => ({
            id: t.id ?? t.task_id ?? t.taskId ?? null,
            name: t.name ?? t.title ?? `Task ${t.id ?? ''}`
          }))
          .filter(t => t.id != null);

        if (!this.taskEvaluation.employeeId && this.employees.length > 0) {
          this.taskEvaluation.employeeId = this.employees[0].id;
        }
        if (!this.taskEvaluation.taskId && this.tasks.length > 0) {
          this.taskEvaluation.taskId = this.tasks[0].id;
        }
      } catch (error) {
        const errorMsg = error?.response?.data?.message || error.message || 'Failed to load initial data';
        this.showNotification(errorMsg, 'error');
      }
    },
    employeeName(id) {
      const emp = this.employees.find((e) => String(e.id) === String(id));
      return emp ? emp.name : 'Unknown Employee';
    },
    employeeDept(id) {
      const emp = this.employees.find((e) => String(e.id) === String(id));
      return emp ? emp.department || 'N/A' : 'N/A';
    },
    getInitials(name) {
      if (!name) return '';
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    },
    ratingText(rating) {
      const texts = ['Needs Improvement', 'Below Expectations', 'Meets Expectations', 'Exceeds Expectations', 'Outstanding'];
      return texts[rating - 1] || 'Not rated';
    },
    ratingClass(rating) {
      const classes = ['bg-danger', 'bg-warning', 'bg-primary', 'bg-info', 'bg-success'];
      return classes[rating - 1] || 'bg-secondary';
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      try {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
      } catch {
        return 'Invalid Date';
      }
    },
    viewDetails(review) {
      this.selectedReview = { ...review };
      this.isEditing = false;
      this.$nextTick(() => this.reviewModal.show());
    },
    editReview(review) {
      this.selectedReview = { ...review };
      this.originalReview = { ...review };
      this.isEditing = true;
      this.$nextTick(() => this.reviewModal.show());
    },
    cancelEdit() {
      this.selectedReview = { ...this.originalReview };
      this.isEditing = false;
      this.reviewModal.hide();
    },
    async saveReview() {
      try {
        const { id, ...reviewData } = this.selectedReview;
        const response = await this.updateReview({
          id,
          'User ID': reviewData.userId,
          'User Rating': reviewData.rating,
          'User Feedback': reviewData.feedback
        });
        if (response?.success) {
          this.showNotification('Review updated successfully');
          this.isEditing = false;
          this.reviewModal.hide();
        } else {
          throw new Error(response?.message || 'Failed to update review');
        }
      } catch (error) {
        this.showNotification(error.message || 'Failed to update review', 'error');
      }
    },
    async submitTaskEvaluation() {
      try {
        if (!this.taskEvaluation.employeeId || !this.taskEvaluation.taskId) {
          throw new Error('Please select both employee and task');
        }
        const response = await this.addReview({
          'User ID': this.taskEvaluation.employeeId,
          'User Rating': this.taskEvaluation.rating,
          'User Feedback': this.taskEvaluation.feedback
        });
        if (response?.success) {
          this.showNotification('Task evaluation submitted successfully');
          this.showTaskEvaluation = false;
          this.resetTaskEvaluation();
        } else {
          throw new Error(response?.message || 'Failed to submit evaluation');
        }
      } catch (error) {
        this.showNotification(error.message || 'Failed to submit evaluation', 'error');
      }
    },
    resetTaskEvaluation() {
      this.taskEvaluation = {
        employeeId: this.employees.length > 0 ? this.employees[0].id : null,
        taskId: this.tasks.length > 0 ? this.tasks[0].id : null,
        rating: 3,
        feedback: ''
      };
    },
    updateStats(reviews) {
      this.stats.totalReviews = reviews.length;
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        this.stats.avgRating = totalRating / reviews.length;
        this.stats.topPerformers = reviews.filter((r) => (r.rating || 0) >= 4).length;
        this.stats.needsImprovement = reviews.filter((r) => (r.rating || 0) <= 2).length;
      } else {
        this.stats.avgRating = 0;
        this.stats.topPerformers = 0;
        this.stats.needsImprovement = 0;
      }
    },
    async exportToExcel() {
      if (!Array.isArray(this.reviews) || this.reviews.length === 0) {
        this.showNotification('No reviews to export', 'warning');
        return;
      }
      try {
        const headers = ['Employee', 'Department', 'Rating', 'Feedback', 'Date'];
        const rows = this.reviews.map((r) => [
          this.employeeName(r.userId),
          this.employeeDept(r.userId),
          r.rating ?? '',
          (r.feedback || '').replace(/\n/g, ' '),
          this.formatDate(r.date)
        ]);
        const csvContent = [
          headers.join(','),
          ...rows.map((r) =>
            r
              .map((v) => (String(v).includes(',') ? `"${String(v).replace(/"/g, '""')}"` : v))
              .join(',')
          )
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `performance-reviews-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showNotification('Export completed');
      } catch (_) {
        this.showNotification('Failed to export reviews', 'error');
      }
    },
    async refreshData() {
      try {
        const response = await this.fetchReviews();
        if (response?.success) {
          this.showNotification('Data refreshed successfully');
        } else {
          const errorMsg = response?.message || 'Failed to refresh data';
          this.showNotification(errorMsg, 'error');
        }
      } catch (error) {
        const errorMsg = error?.response?.data?.message || 'Failed to refresh data';
        this.showNotification(errorMsg, 'error');
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    showNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      setTimeout(() => (this.showToast = false), 5000);
    }
  },
  async mounted() {
    try {
      await this.$nextTick();
      this.reviewModal = new Modal(this.$refs.reviewModal);
      await this.loadInitialData();
    } catch (_) {
      this.showNotification('Failed to initialize component', 'error');
    }
  },
  watch: {
    reviews() {
      this.updateStats(this.reviews);
      this.currentPage = Math.min(Math.max(1, this.currentPage), this.totalPages);
    },
    employeeFilter() {
      this.currentPage = 1;
    },
    quarterFilter() {
      this.currentPage = 1;
    },
    ratingFilter() {
      this.currentPage = 1;
    },
    '$route'() {
      this.loadInitialData();
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

.icon-gradient-1 {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
}

.icon-gradient-2 {
  background: linear-gradient(135deg, #f46b45, #eea849);
}

.icon-gradient-3 {
  background: linear-gradient(135deg, #11998e, #38ef7d);
}

.icon-gradient-4 {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
}

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

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.task-evaluation-card {
  border-left: 4px solid #28a745;
}

.task-evaluation-card .card-header {
  background-color: rgba(40, 167, 69, 0.1);
}
</style>