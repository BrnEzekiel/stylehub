// src/api/productService.js

import apiClient from './axiosConfig';

/**
 * Fetches a list of products WITH pagination meta-data.
 * @param {object} params - Query parameters (e.g., { limit: 9, page: 1 })
 * @returns {Promise<object>} A promise that resolves to { products: [], meta: {} }
 */
export const getProducts = async (params) => {
  try {
    // Calls GET /api/products with query params
    const response = await apiClient.get('/products', { params });
    // 1. 🛑 FIX: Return the full data object, not just products
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch products.';
    console.error('Fetch products error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Creates a new product.
 */
export const createProduct = async (formData) => {
  try {
    const response = await apiClient.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Product creation failed.';
    console.error('Create product error:', errorMessage);
    throw new Error(errorMessage);
  }
};