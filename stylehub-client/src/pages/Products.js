// src/pages/Products.js

import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productService'; // 1. 🛑 Import from new service
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWishlistProductIds, addWishlistItem, removeWishlistItem } from '../api/wishlistService'; // 2. 🛑 Import wishlist functions

// Helper to parse query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Products() {
  const [data, setData] = useState({ products: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. 🛑 Wishlist state
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { token, user } = useAuth();
  
  const query = useQuery();
  const page = parseInt(query.get('page') || '1');
  const category = query.get('category');
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // 4. 🛑 Fetch products and wishlist IDs in parallel
        const params = { page: page, limit: 9 };
        if (category) {
          params.category = category;
        }
        
        const [responseData, wishlistIdSet] = await Promise.all([
          getProducts(params),
          token && user?.role === 'client' ? getWishlistProductIds() : new Set()
        ]);

        setData(responseData); 
        setWishlistIds(wishlistIdSet);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [page, category, token, user]); // 5. 🛑 Re-run if auth state changes

  // 6. 🛑 Wishlist toggle handler
  const handleToggleWishlist = async (e, productId) => {
    e.preventDefault(); // Stop click from navigating
    e.stopPropagation(); // Stop click from bubbling

    if (!token || user?.role !== 'client') {
      alert('Please log in as a client to use the wishlist.');
      return;
    }

    const newSet = new Set(wishlistIds);
    if (wishlistIds.has(productId)) {
      // Remove
      try {
        await removeWishlistItem(productId);
        newSet.delete(productId);
      } catch (err) { alert(err.message); }
    } else {
      // Add
      try {
        await addWishlistItem(productId);
        newSet.add(productId);
      } catch (err) { alert(err.message); }
    }
    setWishlistIds(newSet);
  };

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
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isWishlisted={wishlistIds.has(product.id)} // 7. 🛑 Pass state to card
              onToggleWishlist={handleToggleWishlist} // 8. 🛑 Pass handler to card
              userRole={user?.role}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <Link to={`/products?page=${page - 1}${category ? `&category=${category}` : ''}`}>
          <button disabled={page <= 1}>
            &larr; Previous
          </button>
        </Link>
        <span>Page {page} of {totalPages || 1}</span>
        <Link to={`/products?page=${page + 1}${category ? `&category=${category}` : ''}`}>
          <button disabled={page >= totalPages}>
            Next &rarr;
          </button>
        </Link>
      </div>
    </div>
  );
}

// 9. 🛑 Product Card updated with Wishlist button and Verified Badge
function ProductCard({ product, isWishlisted, onToggleWishlist, userRole }) {
  const isVerified = product.seller?.verificationStatus === 'approved';
  
  return (
    <div className="product-card">
      {/* Show wishlist button only for clients */}
      {userRole === 'client' && (
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => onToggleWishlist(e, product.id)}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
      )}
      
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img 
          src={product.imageUrl || 'https://placehold.co/600x400/007bff/FFFFFF?text=StyleHub'} 
          alt={product.name} 
          className="product-card-image"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/dc3545/FFFFFF?text=Image+Missing"; }}
        />
        <div className="product-card-content">
          {/* Show badge if seller is verified */}
          {isVerified && (
            <div className="verified-seller-badge" style={{fontSize: '0.8em', marginBottom: '8px'}}>
              ✅ Verified Seller
            </div>
          )}
          <h3>{product.name}</h3>
          <p>Ksh {parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
}

export default Products;