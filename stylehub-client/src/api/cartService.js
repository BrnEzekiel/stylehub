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
 * 🛑 CORRECTED FUNCTION 🛑
 * Removes a specific item from the user's cart.
 * @param {string} cartItemId - The unique ID of the cart item (NOT the product ID).
 */
export const removeItemFromCart = async (cartItemId) => {
  try {
    // Calls DELETE /api/cart/:cartItemId
    const response = await apiClient.delete(`/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to remove item.';
    console.error('Remove item error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Creates an order from the current cart (POST /api/cart/checkout).
 */
export const createOrder = async () => {
  try {
    const response = await apiClient.post('/cart/checkout');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create order.';
    console.error('Create order error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Fetches the currently logged-in user's order history (GET /api/orders).
 */
export const fetchOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data; 
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch order history.';
    console.error('Fetch orders error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * 🛑 UPDATED FUNCTION 🛑
 * Fetches ALL orders for the logged-in seller, PLUS a summary.
 * @returns {Promise<object>} An object { orders: [], summary: {} }
 */
export const fetchAllOrders = async () => {
  try {
    // Calls GET /api/orders/all
    const response = await apiClient.get('/orders/all');
    // Now returns the whole object
    return response.data; 
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch all orders for seller dashboard.';
    console.error('Fetch all orders error:', errorMessage);
    throw new Error(errorMessage);
  }
};