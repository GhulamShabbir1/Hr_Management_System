<template>
  <div class="task-evaluator-container animate__animated animate__fadeIn">
    <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="evaluator-title">
      <i class="bi bi-check-circle me-2" aria-hidden="true"></i>
        Task Management & Evaluation
    </h2>
      <div class="d-flex gap-2">
        <button 
          @click="refreshTasks" 
          class="btn btn-sm btn-outline-secondary"
          :disabled="loading"
          aria-label="Refresh tasks"
        >
          <i class="bi bi-arrow-clockwise me-1" aria-hidden="true"></i> Refresh
        </button>
      <button 
        @click="addNewTask" 
          class="btn btn-sm btn-primary"
        aria-label="Add new task"
      >
        <i class="bi bi-plus-lg me-1" aria-hidden="true"></i> Add Task
      </button>
      </div>
    </div>

    <!-- Task Statistics -->
    <div class="task-stats-container mb-4">
      <div class="row">
        <div class="col-md-3">
          <div class="stat-card stat-card-1">
            <div class="stat-icon">
              <i class="bi bi-list-task"></i>
            </div>
            <div class="stat-content">
              <h3>{{ tasks.length }}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-card-2">
            <div class="stat-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-content">
              <h3>{{ completedCount }}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-card-3">
            <div class="stat-icon">
              <i class="bi bi-clock"></i>
            </div>
            <div class="stat-content">
              <h3>{{ pendingCount }}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-card-4">
            <div class="stat-icon">
              <i class="bi bi-graph-up"></i>
            </div>
            <div class="stat-content">
              <h3>{{ completionRate }}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Filter -->
    <div class="task-filters mb-3">
      <div class="row">
        <div class="col-md-4">
          <label class="form-label">Filter by Employee</label>
          <select v-model="employeeFilter" class="form-select">
            <option value="">All Employees</option>
            <option v-for="employee in allEmployees" :key="employee.id" :value="employee.id">
              {{ employee.name }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Filter by Status</label>
          <select v-model="statusFilter" class="form-select">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Filter by Priority</label>
          <select v-model="priorityFilter" class="form-select">
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-12">
          <label class="form-label">Search Tasks</label>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control" 
            placeholder="Search tasks..."
          >
        </div>
      </div>
    </div>

    <!-- Task List -->
    <div class="task-list-container" v-if="filteredTasks.length > 0">
      <div class="task-grid">
        <div 
        v-for="task in filteredTasks" 
        :key="task.id" 
          class="task-card"
          :class="{ 
            'completed-task': task.status === 'Completed',
            'high-priority': task.priority === 'High',
            'medium-priority': task.priority === 'Medium',
            'low-priority': task.priority === 'Low'
          }"
        >
          <div class="task-header">
            <div class="task-checkbox">
            <input
              type="checkbox"
              :id="`task-${task.id}`"
              :checked="task.status === 'Completed'"
              @change="toggleStatus(task)"
                class="form-check-input"
              aria-label="Toggle task completion status"
              >
            </div>
            <div class="task-title">
              <h5>{{ task.title || task.name }}</h5>
              <div class="task-meta">
                <span class="badge" :class="getStatusBadgeClass(task.status)">
                  {{ task.status }}
                </span>
                <span class="badge" :class="getPriorityBadgeClass(task.priority)">
                  {{ task.priority }}
                </span>
                <span v-if="task.employeeId" class="badge bg-info">
                  {{ getEmployeeName(task.employeeId) }}
                </span>
              </div>
          </div>
          <div class="task-actions">
            <button 
                @click="editTask(task)" 
                class="btn btn-sm btn-outline-primary"
                title="Edit task"
              >
                <i class="bi bi-pencil"></i>
            </button>
            <button 
              @click="removeTask(task.id)" 
                class="btn btn-sm btn-outline-danger"
                title="Delete task"
            >
                <i class="bi bi-trash"></i>
            </button>
            </div>
          </div>
          
          <div class="task-body">
            <p class="task-description">{{ task.description || 'No description provided' }}</p>
            <div class="task-details">
              <div class="task-due-date" v-if="task.dueDate">
                <i class="bi bi-calendar"></i>
                <span>Due: {{ formatDate(task.dueDate) }}</span>
              </div>
              <div class="task-completed-date" v-if="task.completedDate">
                <i class="bi bi-check-circle"></i>
                <span>Completed: {{ formatDate(task.completedDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state text-center py-4">
      <i class="bi bi-check2-circle fs-1 text-muted" aria-hidden="true"></i>
      <p class="mt-2">No tasks available. Add your first task!</p>
    </div>

    <!-- Task Modal -->
    <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-gradient-primary text-white">
            <h2 id="taskModalLabel" class="modal-title h5">
              {{ editMode ? 'Edit Task' : 'Add New Task' }}
            </h2>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-8">
            <div class="mb-3">
                  <label for="newTaskTitle" class="form-label">Task Title *</label>
              <input 
                type="text" 
                class="form-control" 
                    id="newTaskTitle" 
                    v-model="newTask.title"
                    placeholder="Enter task title"
                required
              >
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="newTaskPriority" class="form-label">Priority</label>
                  <select class="form-select" id="newTaskPriority" v-model="newTask.priority">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="newTaskStatus" class="form-label">Status</label>
                  <select class="form-select" id="newTaskStatus" v-model="newTask.status">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="newTaskEmployee" class="form-label">Assign to Employee</label>
                  <select class="form-select" id="newTaskEmployee" v-model="newTask.employeeId">
                    <option value="">Unassigned</option>
                    <option v-for="employee in allEmployees" :key="employee.id" :value="employee.id">
                      {{ employee.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="newTaskDueDate" class="form-label">Due Date</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="newTaskDueDate" 
                    v-model="newTask.dueDate"
                  >
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="newTaskDescription" class="form-label">Description</label>
              <textarea 
                class="form-control" 
                id="newTaskDescription" 
                v-model="newTask.description"
                rows="4"
                placeholder="Enter task description"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="confirmAddTask"
              :disabled="!newTask.title.trim()"
            >
              {{ editMode ? 'Update Task' : 'Add Task' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: "AppTaskEvaluation",
  data() {
    return {
      newTask: {
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        status: "Pending",
        employeeId: ""
      },
      employeeFilter: "",
      statusFilter: "",
      priorityFilter: "",
      searchQuery: "",
      taskModal: null,
      editMode: false,
      editingTask: null
    };
  },
  computed: {
    ...mapState('performance', ['tasks', 'employees', 'loading', 'error']),
    ...mapGetters('performance', ['allEmployees', 'getTasksByEmployee']),
    
    completedCount() {
      return this.tasks.filter(task => task.status === 'Completed').length;
    },
    
    pendingCount() {
      return this.tasks.filter(task => task.status === 'Pending').length;
    },
    
    completionRate() {
      if (this.tasks.length === 0) return 0;
      return Math.round((this.completedCount / this.tasks.length) * 100);
    },
    
    filteredTasks() {
      let filtered = [...this.tasks];
      
      // Filter by employee
      if (this.employeeFilter) {
        filtered = filtered.filter(task => task.employeeId === this.employeeFilter);
      }
      
      // Filter by status
      if (this.statusFilter) {
        filtered = filtered.filter(task => task.status === this.statusFilter);
      }
      
      // Filter by priority
      if (this.priorityFilter) {
        filtered = filtered.filter(task => task.priority === this.priorityFilter);
      }
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(task => 
          (task.title && task.title.toLowerCase().includes(query)) ||
          (task.description && task.description.toLowerCase().includes(query))
        );
      }
      
      // Sort tasks: High priority first, then by due date, then by status
      return filtered.sort((a, b) => {
        // Priority sorting
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const aPriority = priorityOrder[a.priority] || 1;
        const bPriority = priorityOrder[b.priority] || 1;
        if (aPriority !== bPriority) return bPriority - aPriority;
        
        // Due date sorting
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        
        // Status sorting (Pending first, then In Progress, then Completed)
        const statusOrder = { 'Pending': 1, 'In Progress': 2, 'Completed': 3 };
        const aStatus = statusOrder[a.status] || 1;
        const bStatus = statusOrder[b.status] || 1;
        return aStatus - bStatus;
      });
    }
  },
  methods: {
    ...mapActions('performance', [
      'fetchTasks',
      'createTask',
      'updateTask',
      'deleteTask',
      'fetchEmployees'
    ]),
    
    getEmployeeName(employeeId) {
      const employee = this.employees.find(e => e.id === employeeId);
      return employee ? employee.name : 'Unassigned';
    },
    
    async refreshTasks() {
      try {
        await this.fetchTasks();
        await this.fetchEmployees();
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Tasks refreshed successfully'
        });
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'Error',
          text: 'Failed to refresh tasks'
        });
      }
    },
    
    async toggleStatus(task) {
      try {
        const newStatus = task.status === "Completed" ? "In Progress" : "Completed";
        const updatedTask = {
          ...task,
          status: newStatus,
          completedDate: newStatus === 'Completed' ? new Date().toISOString() : null
        };
        
        await this.updateTask({ id: task.id, taskData: updatedTask });
        this.$notify({
          type: 'success',
          title: 'Success',
          text: `Task marked as ${newStatus}`
        });
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'Error',
          text: 'Failed to update task status'
        });
      }
    },
    
    addNewTask() {
      this.editMode = false;
      this.editingTask = null;
      this.newTask = {
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        status: "Pending",
        employeeId: ""
      };
      this.taskModal.show();
    },
    
    editTask(task) {
      this.editMode = true;
      this.editingTask = task;
      this.newTask = {
        title: task.title || task.name || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        dueDate: task.dueDate || "",
        status: task.status || "Pending",
        employeeId: task.employeeId || ""
      };
      this.taskModal.show();
    },
    
    async confirmAddTask() {
      if (!this.newTask.title.trim()) {
        this.$notify({
          type: 'error',
          title: 'Error',
          text: 'Task title is required'
        });
        return;
      }
      
      try {
        if (this.editMode && this.editingTask) {
          await this.updateTask({ 
            id: this.editingTask.id, 
            taskData: this.newTask 
          });
          this.$notify({
            type: 'success',
            title: 'Success',
            text: 'Task updated successfully'
          });
        } else {
          await this.createTask(this.newTask);
          this.$notify({
            type: 'success',
            title: 'Success',
            text: 'Task created successfully'
          });
        }
      
      this.taskModal.hide();
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'Error',
          text: this.editMode ? 'Failed to update task' : 'Failed to create task'
        });
      }
    },
    
    async removeTask(id) {
      if (!confirm('Are you sure you want to delete this task?')) return;
      
      try {
        await this.deleteTask(id);
        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Task deleted successfully'
        });
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'Error',
          text: 'Failed to delete task'
        });
      }
    },
    
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    
    getStatusBadgeClass(status) {
      const classes = {
        'Pending': 'bg-warning',
        'In Progress': 'bg-info',
        'Completed': 'bg-success'
      };
      return classes[status] || 'bg-secondary';
    },
    
    getPriorityBadgeClass(priority) {
      const classes = {
        'High': 'bg-danger',
        'Medium': 'bg-warning',
        'Low': 'bg-success'
      };
      return classes[priority] || 'bg-secondary';
    }
  },
  async mounted() {
    this.taskModal = new Modal(document.getElementById('taskModal'));
    
    // Load tasks and employees on component mount
    try {
      await this.fetchTasks();
      await this.fetchEmployees();
    } catch (error) {
      this.$notify({
        type: 'error',
        title: 'Error',
        text: 'Failed to load data'
      });
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

.evaluator-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

/* Task Statistics */
.task-stats-container {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  border-left: 4px solid;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card-1 {
  border-left-color: #007bff;
}

.stat-card-2 {
  border-left-color: #28a745;
}

.stat-card-3 {
  border-left-color: #ffc107;
}

.stat-card-4 {
  border-left-color: #17a2b8;
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
  color: #6c757d;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}

.stat-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Task Filters */
.task-filters {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

/* Task Grid */
.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.task-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.task-card.completed-task {
  border-left-color: #28a745;
  background-color: #f8f9fa;
}

.task-card.high-priority {
  border-left-color: #dc3545;
}

.task-card.medium-priority {
  border-left-color: #ffc107;
}

.task-card.low-priority {
  border-left-color: #28a745;
}

.task-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.task-checkbox {
  margin-right: 0.75rem;
  margin-top: 0.25rem;
}

.task-title h5 {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #2c3e50;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.task-body {
  margin-top: 1rem;
}

.task-description {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.task-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.task-due-date,
.task-completed-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-due-date i,
.task-completed-date i {
  color: #007bff;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Loading State */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.task-label {
  cursor: pointer;
  flex-grow: 1;
}

.task-status {
  font-size: 0.875rem;
  color: #6c757d;
  margin-left: 0.5rem;
}

.task-actions {
  display: flex;
  align-items: center;
}

.empty-state {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  color: #6c757d;
}

.btn-success {
  background: linear-gradient(135deg, #28a745, #5cb85c);
  color: white;
  border: none;
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .task-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .task-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .task-actions {
    margin-top: 0.5rem;
  }
}

@media (max-width: 576px) {
  .task-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .task-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .task-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>