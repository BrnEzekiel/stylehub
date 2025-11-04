// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../api/authService';
import { getMyProfile } from '../api/userService'; // 🛑 FIX: Corrected import path
import apiClient from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          // This call will now work
          const profile = await getMyProfile();
          setUser(profile);
        } catch (error) {
          localStorage.removeItem('accessToken');
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
      
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('accessToken', data.access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

      // This is the fix for the login redirect
      return data.user; 

    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};