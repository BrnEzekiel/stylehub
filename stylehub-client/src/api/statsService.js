import apiClient from './axiosConfig';

/**
 * Fetches statistics for the seller dashboard.
 * @returns {Promise<object>} An object containing productCount, totalOrders, and totalRevenue.
 */
export const getSellerStats = async () => {
  try {
    const response = await apiClient.get('/stats/seller-dashboard');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch seller stats.';
    console.error('Get Seller Stats error:', errorMessage);
    throw new Error(errorMessage);
  }
};
