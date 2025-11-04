// src/api/cartService.js

import apiClient from './axiosConfig';

/**
 * Fetches the user's current cart details (GET /api/cart).
 */
export const fetchCart = async () => {
  try {
    const response = await apiClient.get('/cart');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch cart.';
    console.error('Fetch cart error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Adds an item to the user's cart (POST /api/cart).
 */
export const addItemToCart = async (productId, quantity) => {
  try {
    const response = await apiClient.post('/cart', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to add item to cart.';
    console.error('Add to cart error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Removes a specific item from the user's cart.
 */
export const removeItemFromCart = async (cartItemId) => {
  try {
    const response = await apiClient.delete(`/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to remove item.';
    console.error('Remove item error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Creates an order from the current cart.
 */
export const createOrder = async (addressData) => {
  try {
    const response = await apiClient.post('/cart/checkout', addressData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create order.';
    console.error('Create order error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// 🛑 REMOVED fetchOrders and fetchAllOrders (moved to orderService.js)