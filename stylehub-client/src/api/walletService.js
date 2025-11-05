// src/api/walletService.js

import apiClient from './axiosConfig';

/**
 * Gets the seller's wallet balance and transaction history.
 */
export const getWalletDetails = async () => {
  try {
    const response = await apiClient.get('/wallet');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch wallet details.';
    console.error('Fetch wallet error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Submits a withdrawal request from the seller's wallet.
 * @param {object} data - { amount: number, mpesaNumber: string }
 */
export const requestWithdrawal = async (data) => {
  try {
    const response = await apiClient.post('/wallet/withdraw', data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to request withdrawal.';
    console.error('Withdrawal request error:', errorMessage);
    throw new Error(errorMessage);
  }
};