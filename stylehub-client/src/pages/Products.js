// src/pages/Products.js

import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productService';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWishlistProductIds, addWishlistItem, removeWishlistItem } from '../api/wishlistService';
import Container from '../components/Container';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Reusable Product Card Component
function ProductCard({ product, isWishlisted, onToggleWishlist, userRole }) {
  const isVerified = product.seller?.verificationStatus === 'approved';
  
  return (
    <div className="product-card card-hover">
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
        <div className="relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="product-card-image"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/600x400/dc3545/FFFFFF?text=Image+Missing"; 
              }}
            />
          ) : (
            <div className="product-card-image flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)' }}>
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          {isVerified && (
            <div className="verified-badge">
              <i className="fas fa-check-circle"></i> Verified
            </div>
          )}
        </div>
        <div className="product-card-content">
          <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-green-600 font-bold text-lg">KSh {parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
}


function Products() {
  const [data, setData] = useState({ products: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { token, user } = useAuth();
  
  const query = useQuery();
  const page = parseInt(query.get('page') || '1');
  const category = query.get('category');
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const params = { page: page, limit: 12 };
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
  }, [page, category, token, user]);

  const handleToggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token || user?.role !== 'client') {
      alert('Please log in as a client to use the wishlist.');
      return;
    }

    const newSet = new Set(wishlistIds);
    if (wishlistIds.has(productId)) {
      try {
        await removeWishlistItem(productId);
        newSet.delete(productId);
      } catch (err) { alert(err.message); }
    } else {
      try {
        await addWishlistItem(productId);
        newSet.add(productId);
      } catch (err) { alert(err.message); }
    }
    setWishlistIds(newSet);
  };

  if (loading) {
    return (
      <div className="page-section">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading products...</p>
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

  const { products, meta } = data;
  const { totalPages } = meta;

  return (
    <div className="page-transition" style={{ paddingBottom: '80px' }}>
      <Container>
      <div className="page-section">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {category ? `Products in ${category}` : 'All Products'}
        </h1>
        
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found.</p>
            {category && (
              <p className="text-gray-500 mt-2">Try browsing other categories or check back later.</p>
            )}
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isWishlisted={wishlistIds.has(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  userRole={user?.role}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <Link to={`/products?page=${page - 1}${category ? `&category=${category}` : ''}`}>
                  <button className="btn btn-outline" disabled={page <= 1}>
                    &larr; Previous
                  </button>
                </Link>
                <span className="text-gray-600">Page {page} of {totalPages}</span>
                <Link to={`/products?page=${page + 1}${category ? `&category=${category}` : ''}`}>
                  <button className="btn btn-outline" disabled={page >= totalPages}>
                    Next &rarr;
                  </button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      </Container>
    </div>
  );
}

export default Products;