// src/api/adminService.js

import apiClient from './axiosConfig';

/**
 * Fetches all KYC submissions with a 'pending' status.
 */
export const getPendingSubmissions = async () => {
  try {
    const response = await apiClient.get('/kyc/pending');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch pending submissions.';
    console.error('Fetch KYC error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Updates the status of a KYC submission (approve or reject).
 */
export const updateKycStatus = async (kycId, status) => {
  try {
    const response = await apiClient.patch(`/kyc/${kycId}/status`, { status });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update KYC status.';
    console.error('Update KYC error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Fetches all users from the system.
 */
export const getAllUsers = async () => {
  try {
    // Calls GET /api/users
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch users.';
    console.error('Fetch users error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// --- PRODUCT METHODS ---

/**
 * Fetches all products from all sellers.
 */
export const getAllProducts = async () => {
  try {
    // Calls GET /api/products/all-admin
    const response = await apiClient.get('/products/all-admin');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch products.';
    console.error('Fetch products error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Admin deletes a product.
 */
export const deleteProduct = async (productId) => {
  try {
    // Calls DELETE /api/products/admin/:id
    const response = await apiClient.delete(`/products/admin/${productId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete product.';
    console.error('Delete product error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// --- ORDER METHODS ---

/**
 * Fetches all orders from all users.
 */
export const getAllOrders = async () => {
  try {
    // Calls GET /api/orders/admin-all
    const response = await apiClient.get('/orders/admin-all');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch all orders.';
    console.error('Fetch all orders error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * 🛑 NEW FUNCTION 🛑
 * Admin updates the status of an order.
 * @param {string} orderId - The ID of the order.
 * @param {string} status - The new status (e.g., 'shipped').
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    // Calls PATCH /api/orders/admin-all/:id/status
    const response = await apiClient.patch(`/orders/admin-all/${orderId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update order status.';
    console.error('Update order status error:', errorMessage);
    throw new Error(errorMessage);
  }
};