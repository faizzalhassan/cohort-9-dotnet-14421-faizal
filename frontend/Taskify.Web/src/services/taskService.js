import api from './api';

const taskService = {
  // Get all tasks (admin sees all, user sees their own + assigned)
  async getTasks(params = {}) {
  try {
    const response = await api.get('/tasks', { params });
    console.log('raw response:', response.data); // ← add this temporarily
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
  },
  
  async getAssignedTasks(params = {}) {
    try {
      const response = await api.get('/tasks/assigned', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      throw error;
    }
  },
  
  async getPendingTasks(params = {}) {
    try {
      const response = await api.get('/tasks/pending', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
      throw error;
    }
  },
  
  async getInProgressTasks(params = {}) {
    try {
      const response = await api.get('/tasks/in-progress', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching in-progress tasks:', error);
      throw error;
    }
  },
  
  async getCompletedTasks(params = {}) {
    try {
      const response = await api.get('/tasks/completed', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      throw error;
    }
  },
  
  async getOverdueTasks(params = {}) {
    try {
      const response = await api.get('/tasks/overdue', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      throw error;
    }
  },
  
  async getCancelledTasks(params = {}) {
    try {
      const response = await api.get('/tasks/cancelled', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching cancelled tasks:', error);
      throw error;
    }
  },
  
  async getTask(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },
  
  async createTask(data) {
    try {
      const response = await api.post('/tasks', data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  async updateTask(id, data) {
    try {
      const response = await api.put(`/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },
  
async updateTaskStatus(id, status) {
  try {
    const statusMap = { Pending: 1, InProgress: 2, Completed: 3, Cancelled: 4 };
    const response = await api.patch(`/tasks/${id}/status`, { status: statusMap[status] ?? 1 });
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
},
  
  async deleteTask(id) {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};

export default taskService;