// src/api/axiosConfig.js

import axios from 'axios';

// Set up the API client
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Your NestJS API URL
});

// Interceptor to add the token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminAccessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;