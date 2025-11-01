// src/api/kycService.js

import apiClient from './axiosConfig';

/**
 * Fetches the current user's (seller's) KYC status.
 * @returns {Promise<object>} The KYC object or null.
 */
export const getKYCStatus = async () => {
  try {
    // Calls GET /api/kyc
    const response = await apiClient.get('/kyc');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // 404 means they haven't submitted one yet
    }
    const errorMessage = error.response?.data?.message || 'Failed to fetch KYC status.';
    console.error('Get KYC error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Submits the seller's KYC form data.
 * @param {FormData} formData - Contains doc_type, document, and selfie
 * @returns {Promise<object>} The new KYC record.
 */
export const submitKYC = async (formData) => {
  try {
    // Calls the PUT /api/kyc/submit endpoint
    const response = await apiClient.put('/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to submit KYC.';
    console.error('Submit KYC error:', errorMessage);
    throw new Error(errorMessage);
  }
};