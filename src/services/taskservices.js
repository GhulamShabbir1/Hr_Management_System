import api from './api';

export default {
  /**
   * Get all tasks for an employee
   * @param {string} employeeId - ID of the employee
   * @returns {Promise<Array>} Array of task objects
   */
  async getEmployeeTasks(employeeId) {
    const response = await api.get(`/tasks/employee/${employeeId}`);
    return response.data;
  },

  /**
   * Get task details by ID
   * @param {string} taskId - ID of the task
   * @returns {Promise<Object>} Task details
   */
  async getTaskDetails(taskId) {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task creation data
   * @returns {Promise<Object>} Created task details
   */
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  /**
   * Update an existing task
   * @param {string} taskId - ID of the task to update
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated task details
   */
  async updateTask(taskId, updateData) {
    const response = await api.put(`/tasks/${taskId}`, updateData);
    return response.data;
  },

  /**
   * Delete a task
   * @param {string} taskId - ID of the task to delete
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteTask(taskId) {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Get tasks by status and period
   * @param {string} status - Task status (e.g., 'Pending', 'Completed')
   * @param {string} startDate - Start date filter (YYYY-MM-DD)
   * @param {string} endDate - End date filter (YYYY-MM-DD)
   * @returns {Promise<Array>} Filtered tasks
   */
  async getTasksByStatus(status, startDate, endDate) {
    const response = await api.get('/tasks/filter', {
      params: { status, startDate, endDate }
    });
    return response.data;
  },

  /**
   * Get overdue tasks for an employee
   * @param {string} employeeId - ID of the employee
   * @returns {Promise<Array>} Overdue tasks
   */
  async getOverdueTasks(employeeId) {
    const response = await api.get(`/tasks/overdue/${employeeId}`);
    return response.data;
  },

  /**
   * Update task status
   * @param {string} taskId - ID of the task
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated task
   */
  async updateTaskStatus(taskId, status) {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  /**
   * Get task completion statistics
   * @param {string} employeeId - ID of the employee
   * @param {string} period - Time period (monthly, quarterly, yearly)
   * @returns {Promise<Object>} Completion statistics
   */
  async getTaskStatistics(employeeId, period) {
    const response = await api.get(`/tasks/stats/${employeeId}`, {
      params: { period }
    });
    return response.data;
  },

  /**
   * Bulk assign tasks
   * @param {Array} tasksData - Array of tasks to assign
   * @returns {Promise<Object>} Assignment results
   */
  async bulkAssignTasks(tasksData) {
    const response = await api.post('/tasks/bulk-assign', tasksData);
    return response.data;
  }
};