<template>
  <div class="task-evaluator-container animate__animated animate__fadeIn">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="evaluator-title">
        <i class="bi bi-star me-2" aria-hidden="true"></i>
        Performance & Task Management
      </h2>
      <div class="d-flex gap-2">
        <button @click="refreshAll" class="btn btn-sm btn-outline-secondary" :disabled="loading" aria-label="Refresh">
          <i class="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
        <button @click="openNewTask" class="btn btn-sm btn-gradient-primary" aria-label="Assign new task">
          <i class="bi bi-plus-lg me-1"></i> Assign Task
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab==='assignments' }" @click="activeTab='assignments'">
          Assignments
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab==='evaluate' }" @click="activeTab='evaluate'">
          Evaluate Tasks
        </button>
      </li>
    </ul>

    <!-- Assignments -->
    <div v-if="activeTab==='assignments'">
      <!-- Stats -->
      <div class="task-stats-container mb-4">
        <div class="row">
          <div class="col-md-3" v-for="i in 4" :key="i">
            <div :class="`stat-card gradient-${i}`">
              <div class="stat-icon">
                <i :class="[
                  i===1?'bi bi-list-task':'',
                  i===2?'bi bi-check-circle':'',
                  i===3?'bi bi-clock':'',
                  i===4?'bi bi-graph-up':''
                ]"></i>
              </div>
              <div class="stat-content">
                <h3 v-if="i===1">{{ tasks.length }}</h3>
                <h3 v-else-if="i===2">{{ completedCount }}</h3>
                <h3 v-else-if="i===3">{{ pendingCount }}</h3>
                <h3 v-else>{{ completionRate }}%</h3>
                <p v-if="i===1">Total Tasks</p>
                <p v-else-if="i===2">Completed</p>
                <p v-else-if="i===3">Pending</p>
                <p v-else>Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="task-filters mb-3 card-elevated p-3">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Employee</label>
            <select v-model="employeeFilter" class="form-select">
              <option value="">All Employees</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Status</label>
            <select v-model="statusFilter" class="form-select">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Priority</label>
            <select v-model="priorityFilter" class="form-select">
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Search</label>
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Search tasks...">
          </div>
        </div>
      </div>

      <!-- Task List -->
      <div class="card card-elevated p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle table-modern">
            <thead>
              <tr>
                <th>Title</th>
                <th>Employee</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due</th>
                <th>Completed</th>
                <th style="width: 160px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, index) in filteredTasks" :key="task.id || (task.title + '-' + index)">
                <td class="fw-semibold">{{ task.title || task.name }}</td>
                <td>{{ task.assigneeName || getEmployeeName(task.employeeId) || 'Unassigned' }}</td>
                <td><span class="badge badge-pill" :class="getStatusBadgeClass(task.status)">{{ task.status }}</span></td>
                <td><span class="badge badge-pill" :class="getPriorityBadgeClass(task.priority)">{{ task.priority }}</span></td>
                <td>{{ task.dueDate ? formatDate(task.dueDate) : '-' }}</td>
                <td>{{ task.completedDate ? formatDate(task.completedDate) : '-' }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button @click="toggleStatus(task)" class="btn btn-outline-primary" title="Toggle status">
                      <i class="bi" :class="task.status==='Completed' ? 'bi-arrow-counterclockwise' : 'bi-check2-circle'"></i>
                    </button>
                    <button @click="editTask(task)" class="btn btn-outline-secondary" title="Edit">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button @click="removeTask(task.id)" class="btn btn-outline-danger" title="Delete">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredTasks.length === 0">
                <td colspan="7" class="text-center text-muted py-4">No tasks found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Evaluate -->
    <div v-else>
      <div class="card card-elevated p-3">
        <h3 class="h5 mb-3">Task Evaluation</h3>
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Employee</label>
            <select v-model="evaluation.employeeId" class="form-select">
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Task</label>
            <select v-model="evaluation.taskId" class="form-select">
              <option v-for="t in tasks" :key="t.id" :value="t.id">{{ t.title || t.name }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Rating (1-5)</label>
            <input v-model.number="evaluation.rating" type="number" min="1" max="5" class="form-control" />
          </div>
          <div class="col-12">
            <label class="form-label">Feedback</label>
            <textarea v-model="evaluation.feedback" class="form-control" rows="3" placeholder="Feedback about the task"></textarea>
          </div>
          <div class="col-12 d-flex justify-content-end">
            <button @click="submitEvaluation" class="btn btn-gradient-success">
              <i class="bi bi-check-circle me-2"></i> Submit Evaluation
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-gradient-primary text-white">
            <h2 id="taskModalLabel" class="modal-title h5">{{ editMode ? 'Edit Task' : 'Assign New Task' }}</h2>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input v-model="newTask.title" type="text" class="form-control" placeholder="Task title" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Assign to</label>
              <select v-model="newTask.employeeId" class="form-select">
                <option value="">Unassigned</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
              </select>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Priority</label>
                <select v-model="newTask.priority" class="form-select">
                  <option value="Low">Low</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Due date</label>
                <input v-model="newTask.dueDate" type="date" class="form-control" />
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label">Description</label>
              <textarea v-model="newTask.description" rows="3" class="form-control" placeholder="Task description"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-gradient-primary" @click="confirmSaveTask" :disabled="!newTask.title || !newTask.title.trim()">
              {{ editMode ? 'Update Task' : 'Assign Task' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'AppTaskEvaluation',
  data() {
    return {
      activeTab: 'assignments',
      tasks: [],
      employees: [],
      loading: false,

      employeeFilter: '',
      statusFilter: '',
      priorityFilter: '',
      searchQuery: '',

      taskModal: null,
      editMode: false,
      editingTask: null,

      newTask: {
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        status: 'Pending',
        employeeId: ''
      },

      evaluation: {
        employeeId: null,
        taskId: null,
        rating: 3,
        feedback: ''
      }
    };
  },
  computed: {
    completedCount() { return this.tasks.filter(t => t.status === 'Completed').length; },
    pendingCount() { return this.tasks.filter(t => t.status === 'Pending').length; },
    completionRate() {
      if (!this.tasks.length) return 0;
      return Math.round((this.completedCount / this.tasks.length) * 100);
    },
    filteredTasks() {
      let list = [...this.tasks];
      if (this.employeeFilter) list = list.filter(t => String(t.employeeId || '') === String(this.employeeFilter));
      if (this.statusFilter) list = list.filter(t => t.status === this.statusFilter);
      if (this.priorityFilter) list = list.filter(t => t.priority === this.priorityFilter);
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(t =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.name && t.name.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
        );
      }
      const priorityRank = { High: 3, Medium: 2, Low: 1 };
      return list.sort((a, b) => {
        const pa = priorityRank[a.priority] || 1, pb = priorityRank[b.priority] || 1;
        if (pa !== pb) return pb - pa;
        if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
        const so = { Pending: 1, 'In Progress': 2, Completed: 3 };
        return (so[a.status] || 1) - (so[b.status] || 1);
      });
    }
  },
  methods: {
    notify({ type = 'info', title = '', text = '' }) {
      if (typeof this.$notify === 'function') this.$notify({ type, title, text });
      else if (type === 'error') alert(`${title || 'Error'}: ${text}`);
      else console.log(`[${type}] ${title}: ${text}`);
    },
    normalizeEmployee(e) {
      return {
        id: e.id ?? e.user_id ?? e.userId ?? e.employee_id ?? e.employeeId ?? null,
        name: e.name ?? e.full_name ?? e.email ?? `User ${e.id ?? ''}`
      };
    },
    normalizeTask(t) {
      const id = t.id ?? t.task_id ?? t.taskId ?? null;
      const title = t.title ?? t.name ?? `Task ${id ?? ''}`;
      const employeeId =
        t.employeeId ?? t.user_id ?? t.userId ?? t.assignee_id ?? t.assigned_to ?? '';
      const assigneeName =
        t.assigneeName ?? t.user?.name ?? t.assignee?.name ?? t.employee_name ?? null;

      return {
        id,
        title,
        name: title,
        description: t.description ?? t.details ?? '',
        status: t.status ?? 'Pending',
        priority: t.priority ?? 'Medium',
        employeeId,
        assigneeName,
        dueDate: t.dueDate ?? t.due_date ?? null,
        completedDate: t.completedDate ?? t.completed_at ?? null
      };
    },
    async loadEmployees() {
      const res = await this.$axios.get('/list-users');
      const nested = res?.data?.data?.data; // handle {data:{data:[...]}}
      const payload = nested ?? res?.data?.data ?? res?.data?.items ?? res?.data ?? [];
      this.employees = (Array.isArray(payload) ? payload : []).map(this.normalizeEmployee).filter(e => e.id != null);
      if (!this.evaluation.employeeId && this.employees.length) this.evaluation.employeeId = this.employees[0].id;
    },
    async loadTasks() {
      const res = await this.$axios.get('/list-task');
      const nested = res?.data?.data?.data;
      const payload = nested ?? res?.data?.data ?? res?.data?.items ?? res?.data ?? [];
      this.tasks = (Array.isArray(payload) ? payload : []).map(this.normalizeTask);
      if (!this.evaluation.taskId && this.tasks.length) this.evaluation.taskId = this.tasks[0].id;
    },
    async refreshAll() {
      this.loading = true;
      try {
        await Promise.all([this.loadEmployees(), this.loadTasks()]);
        this.notify({ type: 'success', title: 'Success', text: 'Data refreshed' });
      } catch {
        this.notify({ type: 'error', title: 'Error', text: 'Failed to refresh data' });
      } finally {
        this.loading = false;
      }
    },
    getEmployeeName(id) {
      const e = this.employees.find(x => String(x.id) === String(id));
      return e ? e.name : null;
    },
    formatDate(dateStr) {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
    },
    getStatusBadgeClass(status) {
      const classes = { 'Pending': 'bg-warning', 'In Progress': 'bg-info', 'Completed': 'bg-success' };
      return `badge-pill ${classes[status] || 'bg-secondary'}`;
    },
    getPriorityBadgeClass(priority) {
      const classes = { 'High': 'bg-danger', 'Medium': 'bg-warning', 'Low': 'bg-success' };
      return `badge-pill ${classes[priority] || 'bg-secondary'}`;
    },
    toggleStatus(task) {
      task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
      task.completedDate = task.status === 'Completed' ? new Date().toISOString() : null;
      this.notify({ type: 'info', title: 'Note', text: 'Status updated locally (no update endpoint)' });
    },
    openNewTask() {
      this.editMode = false;
      this.editingTask = null;
      this.newTask = { title: '', description: '', priority: 'Medium', dueDate: '', status: 'Pending', employeeId: '' };
      this.taskModal.show();
    },
    editTask(task) {
      this.editMode = true;
      this.editingTask = task;
      this.newTask = {
        title: task.title || task.name || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : '',
        status: task.status || 'Pending',
        employeeId: task.employeeId || ''
      };
      this.taskModal.show();
    },
    async confirmSaveTask() {
      try {
        if (this.editMode && this.editingTask?.id != null) {
          // No official update/delete endpoints in your list → local update
          const idx = this.tasks.findIndex(t => String(t.id) === String(this.editingTask.id));
          if (idx !== -1) this.$set(this.tasks, idx, this.normalizeTask({ ...this.tasks[idx], ...this.newTask }));
          this.notify({ type: 'info', title: 'Note', text: 'Task updated locally' });
        } else {
          // Create task: send user_id and due_date to match backend conventions
          await this.$axios.post('/create-task', {
            title: this.newTask.title,
            description: this.newTask.description,
            priority: this.newTask.priority,
            status: this.newTask.status,
            user_id: this.newTask.employeeId || null,
            due_date: this.newTask.dueDate || null
          });
          await this.loadTasks();
          this.notify({ type: 'success', title: 'Success', text: 'Task assigned' });
        }
        this.taskModal.hide();
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || 'Failed to save task';
        this.notify({ type: 'error', title: 'Error', text: msg });
      }
    },
    removeTask(id) {
      if (!id) return;
      if (!confirm('Delete this task?')) return;
      // No delete endpoint provided → local remove
      this.tasks = this.tasks.filter(t => String(t.id) !== String(id));
      this.notify({ type: 'info', title: 'Note', text: 'Task removed locally' });
    },
    async submitEvaluation() {
      try {
        if (!this.evaluation.employeeId || !this.evaluation.taskId) throw new Error('Select employee and task');
        const task = this.tasks.find(t => String(t.id) === String(this.evaluation.taskId));
        const note = task ? `Task: ${task.title || task.name}` : '';
        await this.$axios.post('/create-performance-review', {
          user_id: this.evaluation.employeeId,
          rating: Number(this.evaluation.rating),
          feedback: `${note}\n${this.evaluation.feedback || ''}`.trim()
        });
        this.notify({ type: 'success', title: 'Success', text: 'Evaluation submitted' });
      } catch (e) {
        this.notify({ type: 'error', title: 'Error', text: e?.response?.data?.message || e?.message || 'Failed to submit evaluation' });
      }
    }
  },
  async mounted() {
    this.taskModal = new Modal(document.getElementById('taskModal'));
    this.loading = true;
    try {
      // Load employees first so names resolve
      await this.loadEmployees();
      await this.loadTasks();
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.task-evaluator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.evaluator-title { font-size: 1.5rem; font-weight: 600; color: #2c3e50; margin: 0; }

/* Gradients / Cards */
.gradient-1 { background: linear-gradient(135deg, #3a7bd5, #00d2ff); color:#fff; }
.gradient-2 { background: linear-gradient(135deg, #11998e, #38ef7d); color:#fff; }
.gradient-3 { background: linear-gradient(135deg, #f46b45, #eea849); color:#fff; }
.gradient-4 { background: linear-gradient(135deg, #ff416c, #ff4b2b); color:#fff; }
.card-elevated { border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border:0; }

/* Stats */
.task-stats-container { margin-bottom: 2rem; }
.stat-card {
  border-radius: 10px; padding: 1.25rem; display: flex;
  align-items: center; justify-content: space-between; margin-bottom: 1rem;
}
.stat-icon { font-size: 2rem; opacity: 0.9; }
.stat-content h3 { font-size: 2rem; font-weight: bold; margin: 0; }
.stat-content p { margin: 0; opacity: 0.9; }

/* Filters */
.task-filters { background: #f8f9fa; border-radius: 8px; }

/* Table */
.table-modern thead th {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: #fff; border: 0; position: sticky; top: 0; z-index: 1;
}

/* Badges */
.badge-pill { border-radius: 999px; padding: .45rem .7rem; font-weight: 600; }
.bg-info { background-color: #17a2b8 !important; }

/* Buttons */
.btn-gradient-primary { background:linear-gradient(135deg,#3a7bd5,#00d2ff);color:#fff;border:0; }
.btn-gradient-success { background:linear-gradient(135deg,#28a745,#38ef7d);color:#fff;border:0; }
.btn-gradient-danger  { background:linear-gradient(135deg,#dc3545,#ff4b2b);color:#fff;border:0; }

/* Responsive */
@media (max-width: 768px) {
  .stat-card { margin-bottom: 1rem; }
}
</style>