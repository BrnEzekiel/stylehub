// src/api/reviewService.js

import apiClient from './axiosConfig';

/**
 * Fetches all reviews for a specific product.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<Array<object>>} An array of review objects.
 */
export const getProductReviews = async (productId) => {
  try {
    // Calls GET /api/reviews/product/:productId
    const response = await apiClient.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch reviews.';
    console.error('Fetch reviews error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Submits a new review for a product.
 * @param {object} reviewData - { productId, rating, comment }
 * @returns {Promise<object>} The newly created review object.
 */
export const submitReview = async (reviewData) => {
  try {
    // Calls POST /api/reviews
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to submit review.';
    console.error('Submit review error:', errorMessage);
    throw new Error(errorMessage);
  }
};