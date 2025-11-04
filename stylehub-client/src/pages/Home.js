// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 1. Check for user

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const data = await getProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' });
        setProducts(data.products); // 2. Get products from the data object
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewArrivals();
  }, []);

  return (
    <div className="home-page">
      {/* 3. Show a simpler hero for logged-in clients */}
      {!user && (
        <div className="hero-section" style={{ background: 'var(--color-primary)', textAlign: 'left', padding: '40px' }}>
          <h1>Welcome to StyleHub</h1>
          <p>Discover the latest trends in fashion. All in one place.</p>
          <Link to="/products" className="hero-button" style={{ background: 'var(--color-accent)', color: '#222' }}>Shop Now</Link>
        </div>
      )}

      <h2 style={{ fontSize: '1.8em', color: '#222', marginBottom: '20px' }}>New Arrivals</h2>
      
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No new products found. Check back soon!</p>
          )}
        </div>
      )}
    </div>
  );
}

// Reusable Product Card Component
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img 
          src={product.imageUrl || 'https://placehold.co/600x400/0f35df/FFFFFF?text=StyleHub'} 
          alt={product.name} 
          className="product-card-image"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/fa0f8c/FFFFFF?text=Image+Missing"; }}
        />
        <div className="product-card-content">
          <h3>{product.name}</h3>
          <p>Ksh {parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
}

export default Home;