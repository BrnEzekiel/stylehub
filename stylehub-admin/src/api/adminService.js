// src/api/adminService.js

import apiClient from './axiosConfig';

// --- KYC METHODS ---
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

// --- SELLER VERIFICATION METHODS ---
export const getPendingVerifications = async () => {
  try {
    const response = await apiClient.get('/verification/pending');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch pending verifications.';
    console.error('Fetch Verifications error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const updateVerificationStatus = async (verificationId, status) => {
  try {
    const response = await apiClient.patch(`/verification/${verificationId}/status`, { status });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update verification status.';
    console.error('Update Verification error:', errorMessage);
    throw new Error(errorMessage);
  }
};


// --- 🛑 NEW: PROVIDER PORTFOLIO METHODS 🛑 ---
/**
 * Fetches all pending provider portfolio submissions.
 */
export const getPendingProviderPortfolios = async () => {
  try {
    const response = await apiClient.get('/provider-portfolio/pending');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch pending portfolios.';
    console.error('Fetch Portfolios error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Updates the status of a provider portfolio submission.
 */
export const updatePortfolioStatus = async (portfolioId, status) => {
  try {
    const response = await apiClient.patch(`/provider-portfolio/${portfolioId}/status`, { status });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update portfolio status.';
    console.error('Update Portfolio error:', errorMessage);
    throw new Error(errorMessage);
  }
};



// --- USER METHODS ---
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch users.';
    console.error('Fetch users error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const adminCreateUser = async (data) => {
  try {
    const response = await apiClient.post('/users/admin/create', data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create user.';
    console.error('Create user error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const getAdminUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/admin/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user details.';
    console.error('Fetch user error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const adminUpdateUser = async (userId, data) => {
  try {
    const response = await apiClient.patch(`/users/admin/${userId}`, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update user.';
    console.error('Update user error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const adminDeleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/admin/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete user.';
    console.error('Delete user error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// --- PRODUCT METHODS ---
export const adminCreateProduct = async (formData) => {
  try {
    const response = await apiClient.post('/products/admin/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create product.';
    console.error('Create product error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const getAllProducts = async () => {
  try {
    const response = await apiClient.get('/products/all-admin');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch products.';
    console.error('Fetch products error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const getAdminProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch product details.';
    console.error('Fetch product details error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const adminUpdateProduct = async (productId, data) => {
  try {
    const response = await apiClient.patch(`/products/admin/${productId}`, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update product.';
    console.error('Update product error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/products/admin/${productId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete product.';
    console.error('Delete product error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// --- ORDER METHODS ---
export const getAllOrders = async () => {
  try {
    const response = await apiClient.get('/orders/admin-all');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch all orders.';
    console.error('Fetch all orders error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const getRecentOrders = async () => {
  try {
    const response = await apiClient.get('/orders/admin-all');
    return response.data; 
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch recent orders.';
    console.error('Fetch recent orders error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const updateOrderStatus = async (orderId, status) => {
  try {
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
export const getAdminOrderDetails = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/admin-all/${orderId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch order details.';
    console.error('Fetch order details error:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const adminDeleteOrder = async (orderId) => {
  try {
    const response = await apiClient.delete(`/orders/admin/${orderId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete order.';
    console.error('Delete order error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// --- STATS METHOD ---
export const getAdminStats = async () => {
  try {
    const response = await apiClient.get('/stats/admin-dashboard');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch admin stats.';
    console.error('Fetch stats error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// --- FINANCIALS & PAYOUTS METHODS ---
export const getFinancialSummary = async () => {
  try {
    const response = await apiClient.get('/payouts/summary');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch financial summary.');
  }
};
export const getSellerPayoutSummaries = async () => {
  try {
    const response = await apiClient.get('/payouts/sellers');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch seller payout summaries.');
  }
};
export const createPayout = async (sellerId) => {
  try {
    const response = await apiClient.post(`/payouts/create/${sellerId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create payout.');
  }
};
export const markPayoutAsPaid = async (payoutId) => {
  try {
    const response = await apiClient.patch(`/payouts/${payoutId}/mark-paid`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark payout as paid.');
  }
};

// --- 🛑 NEW: WITHDRAWAL ADMIN METHODS 🛑 ---

/**
 * Fetches all withdrawal requests for the admin.
 */
export const getWithdrawalRequests = async () => {
  try {
    const response = await apiClient.get('/admin/withdrawals');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch withdrawal requests.');
  }
};

/**
 * Approves or rejects a withdrawal request.
 * @param {string} requestId - The ID of the withdrawal request
 * @param {string} status - 'approved' or 'rejected'
 * @param {string} adminRemarks - Reason for rejection
 */
export const updateWithdrawalStatus = async (requestId, status, adminRemarks = '') => {
  try {
    const response = await apiClient.patch(`/admin/withdrawals/${requestId}/status`, {
      status,
      adminRemarks,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update withdrawal status.');
  }
};