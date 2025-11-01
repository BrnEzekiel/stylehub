// src/api/authService.js

import apiClient from './axiosConfig';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed.';
    throw new Error(errorMessage);
  }
};

export const getMyProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch profile.';
    throw new Error(errorMessage);
  }
};