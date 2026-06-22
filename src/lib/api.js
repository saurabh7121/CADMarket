import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://cadmarket.onrender.com';

const api = axios.create({
  baseURL: baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`,
  timeout: 30000,
});

api.interceptors.request.use(config => {
  // For user routes, use user token; for admin routes, use admin token
  const userToken = localStorage.getItem('cadmarket_user_token');
  const adminToken = localStorage.getItem('cadmarket_admin_token');

  // If the request already has an Authorization header set manually, don't override
  if (!config.headers.Authorization) {
    const isAdminRoute = config.url?.includes('/admin');
    if (isAdminRoute && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (!isAdminRoute && userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('cadmarket_admin_token');
        window.location.href = '/admin/login';
      }
      // For user routes, let the component handle 401 (UserAuthContext handles cleanup)
    }
    return Promise.reject(err);
  }
);

export default api;
