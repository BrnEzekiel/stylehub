// src/api/orderService.js

import apiClient from './axiosConfig';

/**
 * Fetches all orders for the logged-in client.
 */
export const fetchClientOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders.');
  }
};

/**
 * Fetches all orders for the logged-in seller.
 */
export const fetchSellerOrders = async () => {
  try {
    const response = await apiClient.get('/orders/all');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch seller orders.');
  }
};

/**
 * Seller updates the status of an order (e.g., to "shipped").
 */
export const updateSellerOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/seller-status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order status.');
  }
};

/**
 * Downloads a PDF receipt for an order.
 */
export const downloadOrderReceipt = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}/receipt`, {
      responseType: 'blob', // Important for file downloads
    });
    
    // Create a link and click it to trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const filename = `StyleHub-Receipt-${orderId.substring(0, 8)}.pdf`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to download receipt.');
  }
};