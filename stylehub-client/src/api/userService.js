// src/api/userService.js

import apiClient from './axiosConfig';

/**
 * Fetches the profile of the currently logged-in user.
 * The token is automatically attached by the axios interceptor.
 * @returns {Promise<object>} The user object { id, email, name, role, ... }
 */
export const getMyProfile = async () => {
  try {
    // We assume your backend has a /auth/profile endpoint
    // that returns the user's data based on their token.
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch profile.';
    console.error('Get profile error:', errorMessage);
    throw new Error(errorMessage);
  }
};