// src/api/wishlistService.js

import apiClient from './axiosConfig';

/**
 * Get all items in the user's wishlist.
 */
export const getWishlist = async () => {
  try {
    const response = await apiClient.get('/wishlist');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch wishlist.');
  }
};

/**
 * Get a set of product IDs in the user's wishlist.
 * Returns a Set for fast lookups (e.g., new Set(['id1', 'id2']))
 */
export const getWishlistProductIds = async () => {
  try {
    const response = await apiClient.get('/wishlist/ids');
    return new Set(response.data); // Return a Set for O(1) lookups
  } catch (error) {
    console.warn('Could not fetch wishlist IDs:', error.message);
    return new Set(); // Return an empty set on error
  }
};

/**
 * Add a product to the user's wishlist.
 */
export const addWishlistItem = async (productId) => {
  try {
    const response = await apiClient.post(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add item.');
  }
};

/**
 * Remove a product from the user's wishlist.
 */
export const removeWishlistItem = async (productId) => {
  try {
    const response = await apiClient.delete(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove item.');
  }
};