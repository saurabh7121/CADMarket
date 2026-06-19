import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cadmarket_admin_token');
    if (token) {
      api.get('/admin/me')
        .then(r => setAdmin(r.data.admin))
        .catch(() => localStorage.removeItem('cadmarket_admin_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const r = await api.post('/admin/login', { email, password });
    localStorage.setItem('cadmarket_admin_token', r.data.token);
    setAdmin(r.data.admin);
    return r.data;
  };

  const logout = () => {
    localStorage.removeItem('cadmarket_admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAdmin: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
