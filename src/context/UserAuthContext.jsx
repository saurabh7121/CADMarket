import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('cadmarket_user_token');
    if (token) {
      api
        .get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => setUser(r.data.user))
        .catch(() => localStorage.removeItem('cadmarket_user_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, phone = '') => {
    const r = await api.post('/users/register', { name, email, password, phone });
    localStorage.setItem('cadmarket_user_token', r.data.token);
    setUser(r.data.user);
    return r.data;
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await api.post('/users/login', { email, password });
    localStorage.setItem('cadmarket_user_token', r.data.token);
    setUser(r.data.user);
    return r.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cadmarket_user_token');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const token = localStorage.getItem('cadmarket_user_token');
    const r = await api.patch('/users/profile', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(r.data.user);
    return r.data.user;
  }, []);

  return (
    <UserAuthContext.Provider
      value={{ user, loading, isLoggedIn: !!user, login, logout, register, updateProfile }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be inside UserAuthProvider');
  return ctx;
};
