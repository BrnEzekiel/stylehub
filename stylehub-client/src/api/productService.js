import apiClient from './axiosConfig';

/**
 * Fetches a list of products.
 * @param {object} params - Query parameters (e.g., { limit: 4, sortBy: 'createdAt' })
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products.
 */
export const getProducts = async (params) => {
  try {
    // Calls GET /api/products with query params
    const response = await apiClient.get('/products', { params });
    // Your backend returns { products: [], meta: {} }
    return response.data.products;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch products.';
    console.error('Fetch products error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Creates a new product.
 * This sends FormData, so we must set the 'Content-Type' header.
 *
 * @param {FormData} formData - The product data.
 * @returns {Promise<object>} The new product.
 */
export const createProduct = async (formData) => {
  try {
    const response = await apiClient.post('/products', formData, {
      headers: {
        // This is the magic header for file uploads
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
