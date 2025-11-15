// src/pages/WishlistPage.js

import React, { useState, useEffect } from 'react';
import { getWishlist, removeWishlistItem } from '../api/wishlistService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// We can re-use the ProductCard component from Products.js
function ProductCard({ product, onRemove }) {
  return (
    <div className="product-card card-hover">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="product-card-image"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src="https://placehold.co/600x400/dc3545/FFFFFF?text=Image+Missing"; 
              }}
            />
          ) : (
            <div className="product-card-image flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)' }}>
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="product-card-content">
          <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-green-600 font-bold text-lg">KSh {parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
      <button 
        onClick={() => onRemove(product.id)} 
        className="btn btn-outline w-full mt-2"
        style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}
      >
        Remove from Wishlist
      </button>
    </div>
  );
}

function WishlistPage() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeWishlistItem(productId);
      // Refresh the list by filtering the state
      setWishlist(prev => ({
        ...prev,
        items: prev.items.filter(item => item.productId !== productId)
      }));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="page-section">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="page-section">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }
  
  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="page-transition">
        <div className="page-section text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">My Wishlist</h1>
          <p className="text-gray-600 text-lg mb-6">You haven't added any items to your wishlist yet.</p>
          <Link to="/products" className="btn btn-primary">Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="page-section">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>
        <div className="product-grid">
          {wishlist.items.map((item) => (
            <ProductCard 
              key={item.id} 
              product={item.product} 
              onRemove={handleRemove} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;