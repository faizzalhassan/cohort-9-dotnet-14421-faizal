import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5255/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskify_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('taskify_token');
        localStorage.removeItem('taskify_user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
