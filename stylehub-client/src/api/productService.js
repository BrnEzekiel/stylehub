import apiClient from './axiosConfig';

/**
 * Fetches a list of products with pagination and optional filtering.
 * @param {object} params - Query parameters (e.g., { limit: 9, page: 1, category: 'electronics', search: 'phone' })
 * @returns {Promise<object>} A promise that resolves to { products: [], meta: {} }
 */
export const getProducts = async (params) => {
  try {
    const response = await apiClient.get('/products', { params });
    return response.data; // Should include products and meta
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch products.';
    console.error('Fetch products error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Fetches a single product by its ID.
 * @param {string} productId - The ID of the product
 * @returns {Promise<object>} A promise that resolves to the product data
 */
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch product.';
    console.error('Fetch product by ID error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Creates a new product.
 * @param {FormData} formData - Form data containing product fields and image
 * @returns {Promise<object>} A promise that resolves to the created product
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