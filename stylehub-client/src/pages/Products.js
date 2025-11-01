// src/pages/Products.js

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Link } from 'react-router-dom';

function Products() {
  const [productsData, setProductsData] = useState({ products: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Calls GET /api/products (which can also handle ?search=)
        const response = await apiClient.get('/products');
        setProductsData(response.data); 
        setError(null);
      } catch (err)
 {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Products Page</h2>
      {productsData.products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {productsData.products.map((product) => (
            <li key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              
              {/* This link is correct and uses the real UUID */}
              <h4>
                <Link to={`/products/${product.id}`}>{product.name}</Link>
              </h4>
              
              <p>Price: Ksh {product.price}</p>
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} style={{ width: '100px', height: '100px' }} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Products;