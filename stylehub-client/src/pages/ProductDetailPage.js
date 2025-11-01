// src/pages/ProductDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { addItemToCart } from '../api/cartService';
// 1. Import the new review service functions
import { getProductReviews, submitReview } from '../api/reviewService';

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // 2. Add state for reviews
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  
  const { id } = useParams();
  const { token, user } = useAuth(); // 3. Get user object
  const navigate = useNavigate();

  // 4. Update useEffect to fetch both product and reviews
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const productResponse = await apiClient.get(`/products/${id}`);
        setProduct(productResponse.data);

        // Fetch reviews
        const reviewsData = await getProductReviews(id);
        setReviews(reviewsData);

      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductAndReviews();
    }
  }, [id]);

  const handleAddToCart = async () => {
    // ... (your existing handleAddToCart function is perfect)
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

  // 5. Add handler for submitting a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment || !reviewRating) {
      setReviewError('Please provide a rating and a comment.');
      return;
    }

    setReviewLoading(true);
    setReviewError('');

    try {
      const reviewData = {
        productId: id,
        rating: parseInt(reviewRating),
        comment: reviewComment,
      };
      
      const newReview = await submitReview(reviewData);
      
      // Add new review to the top of the list
      setReviews([newReview, ...reviews]);
      
      // Clear the form
      setReviewComment('');
      setReviewRating(5);

    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} style={{ width: '300px', height: '300px' }} />
      )}
      <h2>{product.name}</h2>
      
      <p style={{ fontSize: '1.5em', color: 'green' }}>Ksh {product.price}</p>
      
      {/* 6. Display Average Rating */}
      <p style={{ fontSize: '1.2em' }}>
        Average Rating: 
        <strong style={{ color: '#f0ad4e', marginLeft: '10px' }}>
          {parseFloat(product.averageRating).toFixed(1)} / 5
        </strong>
      </p>

      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>In Stock: {product.stock}</p>
      
      {/* Quantity and Add to Cart */}
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="quantity" style={{ marginRight: '10px', fontWeight: 'bold' }}>Quantity:</label>
        <input 
          type="number" 
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock)))} 
          min="1"
          max={product.stock}
          style={{ width: '70px', padding: '8px', fontSize: '1em' }}
        />
      </div>
      
      <button 
        onClick={handleAddToCart} 
        disabled={cartLoading || product.stock === 0}
        style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer' }}
      >
        {cartLoading ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
      </button>
      
      {cartMessage && <p style={{ color: cartMessage.includes('successfully') ? 'green' : 'red', marginTop: '10px' }}>
        {cartMessage}
      </p>}

      <hr style={{ margin: '40px 0' }} />

      {/* 7. Review Submission Form */}
      {token && user?.role === 'client' ? (
        <div style={styles.reviewForm}>
          <h3>Write a Customer Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="rating">Rating:</label>
              <select 
                id="rating" 
                value={reviewRating} 
                onChange={(e) => setReviewRating(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                /* 🛑 FIX: Changed '1im_start_TOKEN' to '100%' and added boxSizing */
                style={{ width: '100%', minHeight: '80px', padding: '5px', display: 'block', boxSizing: 'border-box' }}
              />
            </div>
            
            {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}

            <button type="submit" disabled={reviewLoading} style={{ padding: '8px 15px', cursor: 'pointer' }}>
              {reviewLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      ) : (
        <p>You must be logged in as a client to write a review.</p>
      )}

      {/* 8. Review List */}
      <div style={{ marginTop: '30px' }}>
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet for this product.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {reviews.map((review) => (
              <div key={review.id} style={styles.reviewItem}>
                <strong style={{ fontSize: '1.1em' }}>{review.user?.name || 'Customer'}</strong>
                <p style={styles.reviewRating}>Rating: {review.rating} / 5</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Simple styling
const styles = {
  reviewForm: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  reviewItem: {
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '5px',
  },
  reviewRating: {
    margin: '5px 0',
    color: '#f0ad4e',
    fontWeight: 'bold',
  }
};

export default ProductDetailPage;