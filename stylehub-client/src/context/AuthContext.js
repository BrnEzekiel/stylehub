// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../api/authService'; // 🛑 FIX: Changed to ../api/
import { getMyProfile } from '../api/userService';   // 🛑 FIX: Changed to ../api/
import apiClient from '../api/axiosConfig';          // 🛑 FIX: Changed to ../api/

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Checks for token AND user

  // Updated useEffect to fetch the user profile
  useEffect(() => {
    const loadUserFromToken = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          // Fetch the user's profile using the token
          const profile = await getMyProfile();
          setUser(profile); // Set the user object
        } catch (error) {
          // Token is invalid or expired
          console.error("Failed to fetch user with token:", error);
          localStorage.removeItem('accessToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  // Create the login function
  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password); 
      
      setToken(data.access_token);
      setUser(data.user); // Set user on login
      
      localStorage.setItem('accessToken', data.access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      
    } catch (error) {
      console.error("Login failed in context:", error);
      throw error;
    }
  };

  // Create the logout function
  const logout = () => {
    setToken(null);
    setUser(null); // Clear user on logout
    localStorage.removeItem('accessToken');
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const value = {
    token,
    user, // The user object is now restored on refresh
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