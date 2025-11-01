// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../api/productService';
import { Link } from 'react-router-dom';

/**
 * Main Home Component
 * This component checks the user's role and renders the appropriate homepage.
 */
function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch products if user is a guest or a client
    if (!user || user.role === 'client') {
      const fetchNewArrivals = async () => {
        try {
          setLoading(true);
          // Fetch the 4 newest products by sorting by createdAt
          const data = await getProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' });
          setProducts(data);
        } catch (error) {
          console.error(error.message);
          // Don't block the page, just show no products
        } finally {
          setLoading(false);
        }
      };
      
      fetchNewArrivals();
    } else {
      // If user is a seller, no products are needed
      setLoading(false);
    }
  }, [user]); // Re-run when user logs in or out

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  // Render homepage based on role
  if (user?.role === 'seller') {
    return <SellerHome user={user} />;
  }
  
  // Render for clients and guests
  return <ClientGuestHome user={user} products={products} />;
}

export default Home;

/**
 * Homepage for Guests and Clients
 */
function ClientGuestHome({ user, products }) {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>{user ? `Welcome back, ${user.name}!` : 'Welcome to StyleHub'}</h1>
        <p>Discover the latest trends in fashion. All in one place.</p>
        <Link to="/products" className="hero-button">Shop All Products</Link>
      </div>

      <h2 className="home-section-title">New Arrivals</h2>
      <div className="home-product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No new products found. Check back soon!</p>
        )}
      </div>
    </div>
  );
}

/**
 * Homepage for Sellers
 */
function SellerHome({ user }) {
  return (
    <div className="seller-home" style={{ padding: '20px' }}>
      <h1>Welcome, {user.name}!</h1>
      <p>Manage your store and products from here.</p>
      <div className="seller-dashboard-links">
        <Link to="/seller/orders" className="seller-link-card">
          📈 View Dashboard
        </Link>
        <Link to="/create-product" className="seller-link-card">
          ➕ Create New Product
        </Link>
        <Link to="/kyc" className="seller-link-card">
          ✅ Check KYC Status
        </Link>
      </div>
    </div>
  );
}

/**
 * Reusable Product Card Component
 */
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img 
          src={product.imageUrl || 'https://placehold.co/600x400/00BFFF/FFFFFF?text=StyleHub'} 
          alt={product.name} 
          className="product-card-image"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/FF1493/FFFFFF?text=Image+Missing"; }}
        />
        <div className="product-card-content">
          <h3>{product.name}</h3>
          <p>Ksh {parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
}