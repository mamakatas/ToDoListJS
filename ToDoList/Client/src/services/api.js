import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5244/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  getProfiles: () => api.get('/auth/profile'),
};

export const tasksAPI = {
  getAllTasks: (query = {}) => api.get('/task/admin-get-all-tasks', { params: query }),
  getUserTasks: (query = {}) => api.get('/task/user-tasks', { params: query }),
  getTaskById: (id) => api.get(`/task/${id}-admin-get-by-id`),
  createTask: (taskData) => api.post('/task', taskData),
  updateTask: (id, taskData) => api.put(`/task/${id}`, taskData),
  updateTaskCompletion: (id, status) => api.put(`/task/${id}/completion`, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  deleteTask: (id) => api.delete(`/task/${id}`),
  addMessageToTask: (taskId, messageContent) => api.post(`/task/${taskId}/messages`, messageContent),
  getMessagesForTask: (taskId) => api.get(`/task/${taskId}/messages`),
  respondToMessage: (messageId, response) => api.post(`/message/respond/${messageId}`, response),
};

export default api; 