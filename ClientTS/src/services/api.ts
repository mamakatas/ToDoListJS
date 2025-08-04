import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5244/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  changePassword: (passwordData: any) => api.post('/auth/change-password', passwordData),
  getProfiles: () => api.get('/auth/profile'),
};

export const tasksAPI = {
  getAllTasks: (query: any = {}) => api.get('/task/admin-get-all-tasks', { params: query }),
  getUserTasks: (query: any = {}) => api.get('/task/user-tasks', { params: query }),
  getTaskById: (id: number) => api.get(`/task/${id}-admin-get-by-id`),
  createTask: (taskData: any) => api.post('/task', taskData),
  updateTask: (id: number, taskData: any) => api.put(`/task/${id}`, taskData),
  updateTaskCompletion: (id: number, status: any) => api.put(`/task/${id}/completion`, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  deleteTask: (id: number) => api.delete(`/task/${id}`),
  addMessageToTask: (taskId: number, messageContent: string) => api.post(`/task/${taskId}/messages`, messageContent),
  getMessagesForTask: (taskId: number) => api.get(`/task/${taskId}/messages`),
  respondToMessage: (messageId: number, response: any) => api.post(`/message/respond/${messageId}`, response),
};

export default api; 