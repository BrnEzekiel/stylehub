// src/pages/Products.js

import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productService'; // 1. Import from service
import { Link, useLocation } from 'react-router-dom';

// 2. Helper to parse query params (for category and page)
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Products() {
  const [data, setData] = useState({ products: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. Get page and category from the URL
  const query = useQuery();
  const page = parseInt(query.get('page') || '1');
  const category = query.get('category');
  
  // 4. Update useEffect to fetch based on page or category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build query params
        const params = {
          page: page,
          limit: 9, // Show 9 products per page
        };
        if (category) {
          params.category = category;
        }
        
        // Call the service
        const responseData = await getProducts(params);
        setData(responseData); 
        setError(null);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, category]); // 5. Re-run if page or category changes

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const { products, meta } = data;
  const { totalPages } = meta;

  return (
    <div>
      <h2>{category ? `Category: ${category}` : 'All Products'}</h2>
      
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        // 6. Use the new CSS classes for styling
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 7. Pagination Controls */}
      <div className="pagination-controls">
        <Link to={`/products?page=${page - 1}${category ? `&category=${category}` : ''}`}>
          <button disabled={page <= 1}>
            &larr; Previous
          </button>
        </Link>
        <span>Page {page} of {totalPages}</span>
        <Link to={`/products?page=${page + 1}${category ? `&category=${category}` : ''}`}>
          <button disabled={page >= totalPages}>
            Next &rarr;
          </button>
        </Link>
      </div>
    </div>
  );
}

// 8. Reusable Product Card Component
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img 
          src={product.imageUrl || 'https://placehold.co/600x400/007bff/FFFFFF?text=StyleHub'} 
          alt={product.name} 
          className="product-card-image"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/dc3545/FFFFFF?text=Image+Missing"; }}
        />
        <div className="product-card-content">
          <h3>{product.name}</h3>
          <p>Ksh {parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
}

export default Products;