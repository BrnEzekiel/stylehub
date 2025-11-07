// src/api/portfolioService.js
import apiClient from './axiosConfig';

/**
 * Get the current portfolio submission status
 */
export const getPortfolioStatus = async () => {
  try {
    const response = await apiClient.get('/provider-portfolio/status');
    return response.data;
  } catch (error) {
    // If 404, it means no submission yet — that's okay
    if (error.response?.status === 404) {
      return { status: 'unverified' };
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch portfolio status.');
  }
};

/**
 * Submit or update portfolio
 */
export const submitPortfolio = async (formData) => {
  try {
    const response = await apiClient.post('/provider-portfolio/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit portfolio.');
  }
};