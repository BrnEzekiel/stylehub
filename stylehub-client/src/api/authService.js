// src/api/authService.js

import apiClient from './axiosConfig'; // Use apiClient (corrected from last time)

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} The response data, e.g., { user, access_token }
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
    console.error('Login failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Registers a new user.
 * @param {object} userData - Contains name, username, email, phone, password, role
 * @returns {Promise<object>} The response data, e.g., { user, access_token }
 */
export const register = async (userData) => {
  try {
    // Call the /api/auth/register endpoint
    const response = await apiClient.post('/auth/register', userData);
    
    // Return the successful data (user and tokens)
    return response.data;

  } catch (error) {
    // Handle errors like "Email already in use"
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    console.error('Registration failed:', errorMessage);
    throw new Error(errorMessage);
  }
};
