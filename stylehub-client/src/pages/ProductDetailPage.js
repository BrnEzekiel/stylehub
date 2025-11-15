// src/pages/ProductDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productService'; // 1. 🛑 Import from new service
import { useAuth } from '../context/AuthContext';
import { addItemToCart } from '../api/cartService';
import { getProductReviews, submitReview } from '../api/reviewService';
import { useSocket } from '../context/SocketContext';
import { getWishlistProductIds, addWishlistItem, removeWishlistItem } from '../api/wishlistService';
import Container from '../components/Container';
import Card from '../components/Card';

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  
  // 3. 🛑 Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { id } = useParams();
  const { token, user } = useAuth();
  const { openChatWithUser, onlineUsers } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // 4. 🛑 Fetch all data in parallel
        const [productData, reviewsData, wishlistIdSet] = await Promise.all([
          getProductById(id),
          getProductReviews(id),
          token && user?.role === 'client' ? getWishlistProductIds() : new Set()
        ]);
        
        setProduct(productData);
        setReviews(reviewsData);
        setIsWishlisted(wishlistIdSet.has(id)); // 5. 🛑 Set initial wishlist state
        
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndReviews();
  }, [id, token, user]); // 6. 🛑 Re-run if auth state changes

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setCartLoading(true);
    setCartMessage(''); 
    try {
      await addItemToCart(product.id, quantity); 
      setCartMessage('Product added to cart successfully!');
    } catch (err) {
      setCartMessage(err.message);
    } finally {
      setCartLoading(false);
    }
  };

  const handleReviewImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReviewImage(e.target.files[0]);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewRating) {
      setReviewError('Please provide a rating.');
      return;
    }
    setReviewLoading(true);
    setReviewError('');
    try {
      const formData = new FormData();
      formData.append('productId', id);
      formData.append('rating', parseInt(reviewRating));
      formData.append('comment', reviewComment);
      if (reviewImage) {
        formData.append('image', reviewImage);
      }
      const newReview = await submitReview(formData);
      setReviews([newReview, ...reviews]);
      setReviewComment('');
      setReviewRating(5);
      setReviewImage(null);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const stockStatus = product.stock > 0 ? 'In Stock' : 'Out of Stock';
  
  // 7. 🛑 Get seller info safely from the product
  const seller = product.seller;
  const sellerId = seller?.id;
  const isSellerOnline = sellerId && onlineUsers[sellerId];
  const isSellerVerified = seller?.verificationStatus === 'approved';

  const handleChatClick = () => {
    openChatWithUser(sellerId, seller?.name || `Seller of ${product.name}`);
  };

  // 8. 🛑 Wishlist toggle handler
  const handleToggleWishlist = async () => {
    if (!token || user?.role !== 'client') {
      navigate('/login');
      return;
    }
    
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeWishlistItem(product.id);
        setIsWishlisted(false);
      } else {
        await addWishlistItem(product.id);
        setIsWishlisted(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="page-transition" style={{ paddingBottom: '80px' }}>
      <Container>
      <div className="product-detail-container">
      <div className="product-detail-layout">
        
        <div>
          <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          
          {/* 9. 🛑 Show Verified Seller Badge */}
          {isSellerVerified && (
            <div className="verified-seller-badge">
              ✅ Verified Local Seller
            </div>
          )}
          
          <p className="price">Ksh {parseFloat(product.price).toFixed(2)}</p>
          <p className="rating">
            Average Rating: <strong>{parseFloat(product.averageRating).toFixed(1)} / 5</strong>
          </p>
          <p className={product.stock > 0 ? 'stock' : 'stock out'}>{stockStatus}</p>
          <p>{product.description}</p>
          <p>Category: {product.category}</p>

          {/* "Chat with Seller" Button */}
          {sellerId && user && user.role === 'client' && (
            <div style={{ margin: '20px 0' }}>
              <button 
                onClick={handleChatClick} 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '1.1em', 
                  background: isSellerOnline ? '#28a745' : '#6c757d', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Chat with Seller {isSellerOnline ? '(Online)' : '(Offline)'}
              </button>
            </div>
          )}
          
          <div className="action-box">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock)))} min="1" max={product.stock} />
            </div>
            <button onClick={handleAddToCart} disabled={cartLoading || product.stock === 0}>
              {cartLoading ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
            </button>
            
            {/* 10. 🛑 Add Wishlist Button */}
            {user?.role === 'client' && (
              <button 
                className={`wishlist-btn-detail ${isWishlisted ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
              >
                {wishlistLoading ? '...' : (isWishlisted ? '♥ Remove from Wishlist' : '♡ Add to Wishlist')}
              </button>
            )}
            
            {cartMessage && <p style={{ color: cartMessage.includes('successfully') ? 'green' : 'red', marginTop: '10px' }}>{cartMessage}</p>}
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {token && user?.role === 'client' ? (
          <div className="review-form">
            <h3>Write a Customer Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div>
                <label htmlFor="rating">Rating:</label>
                <select id="rating" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>
              <div>
                <label htmlFor="comment">Comment:</label>
                <textarea id="comment" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
              </div>
              <div>
                <label htmlFor="reviewImage">Add a photo (optional):</label>
                <input type="file" id="reviewImage" accept="image/*" onChange={handleReviewImageChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
              </div>
              {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}
              <button type="submit" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <p>You must be logged in as a client to write a review.</p>
        )}
        <div className="review-list">
          {reviews.length === 0 ? (
            <p>No reviews yet for this product.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <strong>{review.user?.name || 'Customer'}</strong>
                <p className="rating">Rating: {review.rating} / 5</p>
                <p>{review.comment}</p>
                {review.imageUrl && (
                  <img src={review.imageUrl} alt="Review" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px', marginTop: '10px' }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
      </div>
      </Container>
    </div>
  );
}

export default ProductDetailPage;