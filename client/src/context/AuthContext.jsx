import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set default baseURL — uses VITE_API_URL if defined, otherwise relative '/api' (handled by Vite proxy in dev)
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check Supabase session first
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const sUser = data.session.user;
          const token = data.session.access_token;
          localStorage.setItem('token', token);
          localStorage.setItem('espacio_token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser({
            _id: sUser.id,
            id: sUser.id,
            email: sUser.email,
            name: sUser.user_metadata?.name || sUser.email?.split('@')[0],
            role: sUser.user_metadata?.role || 'superadmin'
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback to local token check
      }

      // 2. Check local token with backend
      const token = localStorage.getItem('token') || localStorage.getItem('espacio_token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            logout();
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const sanitizedEmail = email ? email.trim().toLowerCase() : '';
    // 1. Try Supabase Auth first
    try {
      let supaRes = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (supaRes.error && sanitizedEmail.includes('tarunutt')) {
        const alternateEmail = sanitizedEmail.includes('tarunuttupulusu')
          ? sanitizedEmail.replace('tarunuttupulusu', 'tarunuttpulusu')
          : sanitizedEmail.replace('tarunuttpulusu', 'tarunuttupulusu');
        const retry = await supabase.auth.signInWithPassword({
          email: alternateEmail,
          password,
        });
        if (!retry.error) supaRes = retry;
      }

      if (supaRes.data?.session?.user) {
        const sUser = supaRes.data.session.user;
        const token = supaRes.data.session.access_token;
        localStorage.setItem('token', token);
        localStorage.setItem('espacio_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const loggedUser = {
          _id: sUser.id,
          id: sUser.id,
          email: sUser.email,
          name: sUser.user_metadata?.name || sUser.email?.split('@')[0],
          role: sUser.user_metadata?.role || 'superadmin'
        };
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      }
    } catch (err) {
      console.warn('Supabase AuthContext login notice:', err);
    }

    // 2. Backend Fallback
    try {
      const response = await axios.post('/auth/login', { email: sanitizedEmail, password });
      if (response.data.success) {
        const { token, user: loggedUser } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('espacio_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    supabase.auth.signOut().catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('espacio_token');
    localStorage.removeItem('supabase_auth_token');
    sessionStorage.removeItem('active_admin_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put('/auth/updatepassword', {
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        const { token, user: updatedUser } = response.data.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(updatedUser);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Password update failed',
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
