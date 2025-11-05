// src/pages/SearchPage.js

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getProducts } from '../api/productService'; // 1. 🛑 Import from new service
import { useAuth } from '../context/AuthContext';
import { getWishlistProductIds, addWishlistItem, removeWishlistItem } from '../api/wishlistService'; // 2. 🛑 Import wishlist functions

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  const [data, setData] = useState({ products: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. 🛑 Wishlist state
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { token, user } = useAuth();
  
  const query = useQuery();
  const searchTerm = query.get('q');
  const page = parseInt(query.get('page') || '1');
  
  useEffect(() => {
    if (!searchTerm) {
      setData({ products: [], meta: {} });
      setLoading(false);
      return;
    }
    
    const fetchSearch = async () => {
      try {
        setLoading(true);
        
        const params = {
          search: searchTerm,
          page: page,
          limit: 9
        };
        
        // 4. 🛑 Fetch search and wishlist IDs in parallel
        const [responseData, wishlistIdSet] = await Promise.all([
          getProducts(params),
          token && user?.role === 'client' ? getWishlistProductIds() : new Set()
        ]);
        
        setData(responseData);
        setWishlistIds(wishlistIdSet);
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [searchTerm, page, token, user]); // 5. 🛑 Re-run if auth state changes

  // 6. 🛑 Wishlist toggle handler
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

  if (loading) return <p>Searching for "{searchTerm}"...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const { products, meta } = data;
  const { totalPages, total } = meta;

  return (
    <div>
      <h2>Search Results for "{searchTerm}"</h2>
      <p>{total || 0} results found.</p>
      
      {products.length === 0 ? (
        <p>No products matched your search.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isWishlisted={wishlistIds.has(product.id)} // 7. 🛑 Pass state
              onToggleWishlist={handleToggleWishlist} // 8. 🛑 Pass handler
              userRole={user?.role}
            />
          ))}
        </div>
      )}

      <div className="pagination-controls">
        <Link to={`/search?q=${searchTerm}&page=${page - 1}`}>
          <button disabled={page <= 1}>
            &larr; Previous
          </button>
        </Link>
        <span>Page {page} of {totalPages || 1}</span>
        <Link to={`/search?q=${searchTerm}&page=${page + 1}`}>
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

export default SearchPage;