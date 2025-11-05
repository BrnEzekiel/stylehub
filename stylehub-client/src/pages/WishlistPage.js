// src/pages/WishlistPage.js

import React, { useState, useEffect } from 'react';
import { getWishlist, removeWishlistItem } from '../api/wishlistService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// We can re-use the ProductCard component from Products.js
function ProductCard({ product, onRemove }) {
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
      {/* Add a remove button specific to the wishlist */}
      <button 
        onClick={() => onRemove(product.id)} 
        style={{
          width: '90%',
          margin: '0 auto 10px',
          padding: '8px',
          background: 'var(--color-secondary)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Remove
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

  if (loading) return <p>Loading your wishlist...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>My Wishlist</h2>
        <p>You haven't added any items to your wishlist yet.</p>
        <Link to="/products">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Wishlist</h2>
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
  );
}

export default WishlistPage;