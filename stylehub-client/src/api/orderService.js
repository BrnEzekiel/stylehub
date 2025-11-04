// src/api/orderService.js

import apiClient from './axiosConfig';
import { saveAs } from 'file-saver';

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
 * Fetches ALL orders for the logged-in seller, PLUS a summary.
 * @returns {Promise<object>} An object { orders: [], summary: {} }
 */
export const fetchAllOrders = async () => {
  try {
    const response = await apiClient.get('/orders/all');
    return response.data; 
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch all orders for seller dashboard.';
    console.error('Fetch all orders error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * 🛑 NEW: Downloads a PDF receipt for a specific order.
 */
export const downloadOrderReceipt = async (orderId) => {
  try {
    const response = await apiClient.get(
      `/orders/${orderId}/receipt`, 
      {
        responseType: 'blob', // Important: tells axios to expect binary data
      }
    );
    
    // Use file-saver to trigger a download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    saveAs(blob, `StyleHub-Receipt-${orderId.substring(0, 8)}.pdf`);
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to download receipt.';
    console.error('Download receipt error:', errorMessage);
    throw new Error(errorMessage);
  }
};