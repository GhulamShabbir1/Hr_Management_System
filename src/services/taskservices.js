// src/services/taskservices.js
import api from './api';

export default {
  async createTask(taskData) {
    const res = await api.post('/create-task', taskData);
    return res.data;
  },

  async listTasks() {
    const res = await api.get('/list-task');
    return res.data;
  }
};