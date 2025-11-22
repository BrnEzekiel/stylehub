// src/api/verificationService.js

import apiClient from './axiosConfig';

/**
 * Gets the seller's current verification status and submission details.
 */
export const getVerificationStatus = async () => {
  try {
    const response = await apiClient.get('/verification/status');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { status: 'unverified' };
    }
    const errorMessage = error.response?.data?.message || 'Failed to fetch verification status.';
    console.error('Fetch status error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Submits the seller's verification documents.
 * @param {FormData} formData - Must contain 'businessName', 'socialMediaUrl', and 'businessLicense'
 */
export const submitVerification = async (formData) => {
  try {
    const response = await apiClient.post('/verification/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to submit verification.';
    console.error('Submit verification error:', errorMessage);
    throw new Error(errorMessage);
  }
};