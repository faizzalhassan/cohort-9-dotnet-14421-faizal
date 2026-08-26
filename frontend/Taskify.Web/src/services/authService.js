import api from './api';

const authService = {
  async register(registerData) {
    const response = await api.post('/auth/register', registerData);

    return response.data;
  },

  async login(loginData) {
    const response = await api.post('/auth/login', loginData);

    const result = response.data;

    if (result.success && result.data?.token) {
      localStorage.setItem(
        'taskify_token',
        result.data.token
      );

      localStorage.setItem(
        'taskify_user',
        JSON.stringify(result.data.user)
      );
    }

    return result;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('taskify_token');
      localStorage.removeItem('taskify_user');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');

    return response.data;
  },

  async adminTest() {
    const response = await api.get('/auth/admin-test');

    return response.data;
  },

  getStoredToken() {
    return localStorage.getItem('taskify_token');
  },

  getStoredUser() {
    const user = localStorage.getItem('taskify_user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('taskify_user');
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('taskify_token');
  },

  clearAuthentication() {
    localStorage.removeItem('taskify_token');
    localStorage.removeItem('taskify_user');
  },
};

export default authService;