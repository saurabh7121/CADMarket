import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://cadmarket.onrender.comapi';

const api = axios.create({
  baseURL: baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`,
  timeout: 30000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('cadmarket_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cadmarket_admin_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
