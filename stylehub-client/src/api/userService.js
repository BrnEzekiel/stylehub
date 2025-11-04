// src/api/userService.js

import apiClient from './axiosConfig';

/**
 * Fetches the profile of the currently logged-in user.
 */
export const getMyProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch profile.';
    console.error('Get profile error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * 🛑 NEW: Fetches public user info by ID (for chat).
 */
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user info.';
    console.error('Get user by ID error:', errorMessage);
    throw new Error(errorMessage);
  }
};