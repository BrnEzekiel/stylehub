// src/api/searchService.js

import apiClient from './axiosConfig';

/**
 * Searches for products based on a query string.
 * @param {string} query - The user's search term.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products.
 */
export const searchProducts = async (query) => {
  try {
    // 🛑 FIX 1: Change the URL to match your backend
    // FROM: /products/search?q=${query}
    // TO:   /products?search=${query}
    const response = await apiClient.get(`/products?search=${query}`);
    
    // 🛑 FIX 2: Your backend returns { products: [...], meta: {...} }
    // We must return the nested 'products' array.
    return response.data.products;

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Search failed.';
    console.error('Search error:', errorMessage);
    throw new Error(errorMessage);
  }
};