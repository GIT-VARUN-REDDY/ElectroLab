import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('eltoken');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) { setUser(data.user); setIsAuthenticated(true); }
    } catch {
      localStorage.removeItem('eltoken');
      localStorage.removeItem('eluser');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) { localStorage.setItem('eltoken', data.token); setUser(data.user); setIsAuthenticated(true); return data; }
  };

  const signup = async (formData) => { const { data } = await api.post('/auth/signup', formData); return data; };

  const logout = () => {
    localStorage.removeItem('eltoken');
    localStorage.removeItem('eluser');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => setUser((prev) => ({ ...prev, ...updatedUser }));

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin: user?.role === 'admin', login, signup, logout, updateUser, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};