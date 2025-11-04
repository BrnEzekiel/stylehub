// src/api/reviewService.js

import apiClient from './axiosConfig';

/**
 * Fetches all reviews for a specific product.
 */
export const getProductReviews = async (productId) => {
  try {
    const response = await apiClient.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch reviews.';
    console.error('Fetch reviews error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * 🛑 UPDATED: Submits a new review with an optional image.
 * @param {FormData} formData - The review data, including image
 * @returns {Promise<object>} The newly created review object.
 */
export const submitReview = async (formData) => {
  try {
    // 1. 🛑 Send FormData
    const response = await apiClient.post('/reviews', formData, {
      headers: {
        // 2. 🛑 Set correct header for file upload
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to submit review.';
    console.error('Submit review error:', errorMessage);
    throw new Error(errorMessage);
  }
};