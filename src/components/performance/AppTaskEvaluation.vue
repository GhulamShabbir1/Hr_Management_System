<template>
  <div class="task-evaluator-container animate__animated animate__fadeIn">
    <h2 class="evaluator-title">
      <i class="bi bi-check-circle me-2" aria-hidden="true"></i>
      Task Completion Evaluator
    </h2>
    
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="task-stats">
        <span class="badge bg-primary me-2">
          Total: {{ tasks.length }}
        </span>
        <span class="badge bg-success me-2">
          Completed: {{ completedCount }}
        </span>
        <span class="badge bg-warning">
          Remaining: {{ tasks.length - completedCount }}
        </span>
      </div>
      <button 
        @click="addNewTask" 
        class="btn btn-sm btn-outline-primary"
        aria-label="Add new task"
      >
        <i class="bi bi-plus-lg me-1" aria-hidden="true"></i> Add Task
      </button>
    </div>

    <ul class="task-list" v-if="tasks.length > 0">
      <li 
        v-for="task in filteredTasks" 
        :key="task.id" 
        class="task-item"
        :class="{ 'completed-task': task.status === 'Completed' }"
      >
        <div class="task-content">
          <div class="d-flex align-items-center">
            <input
              type="checkbox"
              :id="`task-${task.id}`"
              :checked="task.status === 'Completed'"
              @change="toggleStatus(task)"
              class="form-check-input me-2"
              aria-label="Toggle task completion status"
            >
            <label :for="`task-${task.id}`" class="task-label">
              <strong>{{ task.name }}</strong>
              <span class="task-status">
                ({{ task.status }})
              </span>
              <small 
                v-if="task.completedDate" 
                class="text-muted d-block"
              >
                Completed on: {{ formatDate(task.completedDate) }}
              </small>
            </label>
          </div>
          <div class="task-actions">
            <button 
              @click="toggleStatus(task)" 
              :class="['btn btn-sm', task.status === 'Completed' ? 'btn-danger' : 'btn-success']"
              aria-label="Toggle task status"
            >
              {{ task.status === 'Completed' ? 'Mark Incomplete' : 'Mark Complete' }}
            </button>
            <button 
              @click="removeTask(task.id)" 
              class="btn btn-sm btn-outline-danger ms-2"
              aria-label="Delete task"
            >
              <i class="bi bi-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </li>
    </ul>
    
    <div v-else class="empty-state text-center py-4">
      <i class="bi bi-check2-circle fs-1 text-muted" aria-hidden="true"></i>
      <p class="mt-2">No tasks available. Add your first task!</p>
    </div>

    <!-- Filter Controls -->
    <div class="mt-3 d-flex justify-content-end">
      <div class="btn-group btn-group-sm">
        <button 
          @click="filter = 'all'"
          :class="['btn', filter === 'all' ? 'btn-primary' : 'btn-outline-primary']"
          aria-label="Show all tasks"
        >
          All
        </button>
        <button 
          @click="filter = 'completed'"
          :class="['btn', filter === 'completed' ? 'btn-primary' : 'btn-outline-primary']"
          aria-label="Show completed tasks"
        >
          Completed
        </button>
        <button 
          @click="filter = 'incomplete'"
          :class="['btn', filter === 'incomplete' ? 'btn-primary' : 'btn-outline-primary']"
          aria-label="Show incomplete tasks"
        >
          Incomplete
        </button>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-gradient-primary text-white">
            <h2 id="taskModalLabel" class="modal-title h5">Add New Task</h2>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="newTaskName" class="form-label">Task Name</label>
              <input 
                type="text" 
                class="form-control" 
                id="newTaskName" 
                v-model="newTask.name"
                placeholder="Enter task name"
                required
              >
            </div>
            <div class="mb-3">
              <label for="newTaskDescription" class="form-label">Description (Optional)</label>
              <textarea 
                class="form-control" 
                id="newTaskDescription" 
                v-model="newTask.description"
                rows="3"
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
              :disabled="!newTask.name.trim()"
            >
              Add Task
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
  name: "AppTaskEvaluation",
  data() {
    return {
      tasks: [
        { id: 1, name: "Project Alpha", status: "Incomplete", description: "Complete project documentation" },
        { id: 2, name: "Website Redesign", status: "Incomplete", description: "Implement new UI components" },
        { id: 3, name: "Client Support", status: "Incomplete", description: "Handle tier 2 support tickets" },
      ],
      newTask: {
        name: "",
        description: ""
      },
      filter: 'all',
      taskModal: null
    };
  },
  computed: {
    completedCount() {
      return this.tasks.filter(task => task.status === 'Completed').length;
    },
    filteredTasks() {
      switch (this.filter) {
        case 'completed':
          return this.tasks.filter(task => task.status === 'Completed');
        case 'incomplete':
          return this.tasks.filter(task => task.status === 'Incomplete');
        default:
          return [...this.tasks].sort((a, b) => {
            // Sort completed tasks to bottom
            if (a.status === 'Completed' && b.status !== 'Completed') return 1;
            if (a.status !== 'Completed' && b.status === 'Completed') return -1;
            return 0;
          });
      }
    }
  },
  methods: {
    toggleStatus(task, event) {
      task.status = task.status === "Completed" ? "Incomplete" : "Completed";
      
      if (task.status === 'Completed') {
        task.completedDate = new Date().toISOString();
      } else {
        task.completedDate = null;
      }
      
      if (event) {
        const button = event.target;
        button.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
          button.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
      }
    },
    addNewTask() {
      this.newTask = { name: "", description: "" };
      this.taskModal.show();
    },
    confirmAddTask() {
      if (!this.newTask.name.trim()) return;
      
      this.tasks.push({
        id: Date.now(),
        name: this.newTask.name,
        description: this.newTask.description,
        status: "Incomplete"
      });
      
      this.taskModal.hide();
    },
    removeTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    }
  },
  mounted() {
    this.taskModal = new Modal(document.getElementById('taskModal'));
  }
};
</script>

<style scoped>
.task-evaluator-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.evaluator-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  margin-bottom: 0.75rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.completed-task {
  border-left-color: #28a745;
  background-color: #f8f9fa;
}

.completed-task .task-label {
  opacity: 0.7;
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