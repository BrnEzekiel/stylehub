// src/api/categoryService.js
import apiClient from './axiosConfig';
import { getProducts } from './productService';
import { getServices } from './serviceService';

/**
 * Get all available product categories (categories that have products)
 */
export const getAvailableProductCategories = async () => {
  try {
    const response = await apiClient.get('/products');
    const products = response.data.products || response.data || [];
    
    // Extract unique categories from products
    const categories = new Set();
    products.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
};

/**
 * Get all available service categories (categories that have services)
 */
export const getAvailableServiceCategories = async () => {
  try {
    const response = await apiClient.get('/services');
    const services = response.data.services || response.data || [];
    
    // Extract unique categories from services
    const categories = new Set();
    services.forEach(service => {
      if (service.category) {
        categories.add(service.category);
      }
    });
    
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return [];
  }
};

/**
 * Get all available categories (both products and services)
 */
export const getAllAvailableCategories = async () => {
  try {
    const [productCats, serviceCats] = await Promise.all([
      getAvailableProductCategories(),
      getAvailableServiceCategories()
    ]);
    
    return {
      products: productCats,
      services: serviceCats
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { products: [], services: [] };
  }
};

