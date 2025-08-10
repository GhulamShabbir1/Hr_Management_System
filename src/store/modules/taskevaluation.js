import api from '@/services/api'; // Make sure you have this real API service

export default {
  namespaced: true,
  state: {
    tasks: []
  },
  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    ADD_TASK(state, task) {
      state.tasks.push(task);
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
      }
    },
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    }
  },
  actions: {
    async fetchTasks({ commit }) {
      try {
        const response = await api.get('/tasks');
        commit('SET_TASKS', response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    },
    async createTask({ commit }, taskData) {
      try {
        const response = await api.post('/tasks', taskData);
        commit('ADD_TASK', response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating task:', error);
        throw error;
      }
    },
    async updateTask({ commit }, { id, taskData }) {
      try {
        const response = await api.put(`/tasks/${id}`, taskData);
        commit('UPDATE_TASK', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating task:', error);
        throw error;
      }
    },
    async deleteTask({ commit }, taskId) {
      try {
        await api.delete(`/tasks/${taskId}`);
        commit('REMOVE_TASK', taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    }
  },
  getters: {
    allTasks: state => state.tasks,
    getTaskById: state => id => state.tasks.find(task => task.id === id)
  }
};