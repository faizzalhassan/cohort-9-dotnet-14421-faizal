import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5255/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // Increased timeout to 30 seconds
  withCredentials: false, // Set to true if you need to send cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskify_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
      headers: config.headers,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response for debugging
    console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('[API Response Error]', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        config: error.config
      });
      
      // Handle specific status codes
      if (error.response.status === 401) {
        console.warn('Token expired or invalid. Redirecting to login...');
        localStorage.removeItem('taskify_token');
        localStorage.removeItem('taskify_user');
        window.location.href = '/login';
      } else if (error.response.status === 400) {
        console.error('Bad Request:', error.response.data);
      } else if (error.response.status === 500) {
        console.error('Server Error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[API No Response]', {
        request: error.request,
        config: error.config,
        message: error.message
      });
      
      // Check if it's a CORS issue
      if (error.message === 'Network Error') {
        console.error('Possible CORS issue or server not running');
        console.error('Make sure the backend server is running on http://localhost:5255');
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[API Setup Error]', {
        message: error.message,
        config: error.config
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;