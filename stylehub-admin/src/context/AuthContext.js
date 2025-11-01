// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, getMyProfile } from '../api/authService';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const storedToken = localStorage.getItem('adminAccessToken'); // Use unique key
      if (storedToken) {
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const profile = await getMyProfile();
          setUser(profile);
        } catch (error) {
          localStorage.removeItem('adminAccessToken');
          setToken(null);
        }
      }
      setLoading(false);
    };
    loadUserFromToken();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      
      // CRITICAL: Check if the user is an admin
      if (data.user.role !== 'admin') {
        throw new Error('Access Denied: Not an admin user.');
      }

      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('adminAccessToken', data.access_token); // Use unique key
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminAccessToken'); // Use unique key
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider> // 🛑 FIX: Corrected spelling 'AuthAontext'
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};