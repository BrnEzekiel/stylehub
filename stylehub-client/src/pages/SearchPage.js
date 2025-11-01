// src/pages/SearchPage.js

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts } from '../api/searchService';

function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      const performSearch = async () => {
        try {
          setLoading(true);
          setError(null);
          const results = await searchProducts(query);
          
          // 🛑 1. ADD THIS CONSOLE LOG 🛑
          console.log('Search results received from API:', results);
          
          setProducts(results);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      performSearch();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) return <p>Searching for "{query}"...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search Results for "{query}"</h2>
      {products.length === 0 ? (
        <p>No products found matching your search.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map((product) => {

            // 🛑 2. ADD THIS CONSOLE LOG 🛑
            console.log('Mapping product:', product); 

            return (
              <li key={product.id || product.name} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h4>
                  {/* This link is probably /products/undefined */}
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h4>
                <p>Price: Ksh {product.price}</p>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100px', height: '100px' }} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SearchPage;