// src/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productService';
import { useAuth } from '../context/AuthContext';
import { addItemToCart } from '../api/cartService';
import { getProductReviews, submitReview } from '../api/reviewService';
import { useSocket } from '../context/SocketContext';
import { getWishlistProductIds, addWishlistItem, removeWishlistItem } from '../api/wishlistService';
import {
    Box, Typography, Button, Grid, Paper, TextField, CircularProgress, Container, Chip, Rating, Avatar, List, ListItem, ListItemAvatar, ListItemText, Select, MenuItem, FormControl, InputLabel, Alert, IconButton
} from '@mui/material';
import { AddShoppingCart, Chat, Favorite, FavoriteBorder, VerifiedUser } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency

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
        const [productData, reviewsData, wishlistIdSet] = await Promise.all([
          getProductById(id),
          getProductReviews(id),
          token && user?.role === 'client' ? getWishlistProductIds() : new Set()
        ]);
        setProduct(productData);
        setReviews(reviewsData);
        setIsWishlisted(wishlistIdSet.has(id));
      } catch (err) {
        setError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [id, token, user]);

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


  if (loading) return <Box sx={{...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><CircularProgress /></Box>;
  if (error) return <Box sx={pageSx}><Alert severity="error">{error}</Alert></Box>;
  if (!product) return <Box sx={pageSx}><Alert severity="warning">Product not found.</Alert></Box>;

  const seller = product.seller;
  const isSellerOnline = seller?.id && onlineUsers[seller.id];

  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{...paperSx, p: 0, overflow: 'hidden'}}><Box component="img" src={product.imageUrl} alt={product.name} sx={{ width: '100%', height: 'auto' }} /></Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{...paperSx, p:3}}>
                {product.seller?.verificationStatus === 'approved' && <Chip icon={<VerifiedUser />} label="Verified Local Seller" color="success" size="small" sx={{mb: 1}} />}
                <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK}}>{product.name}</Typography>
                <Box sx={{display: 'flex', alignItems: 'center', my: 1}}>
                    <Rating value={parseFloat(product.averageRating)} precision={0.5} readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ml: 1}}>({reviews.length} reviews)</Typography>
                </Box>
                <Typography variant="h3" sx={{fontWeight: 'bold', color: COLOR_PRIMARY_BLUE, my: 2}}>{formatCurrency(product.price)}</Typography>
                <Chip label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} color={product.stock > 0 ? 'success' : 'error'} sx={{mb: 2}} />
                <Typography variant="body1" color="text.secondary">{product.description}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{mt: 2}}>Category: {product.category}</Typography>

                {seller && user && user.role === 'client' && (
                    <Button fullWidth variant="outlined" startIcon={<Chat />} onClick={() => openChatWithUser(seller.id, seller.name || `Seller of ${product.name}`)} sx={{my: 2}}>
                        Chat with Seller {isSellerOnline ? '(Online)' : '(Offline)'}
                    </Button>
                )}
                
                <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mt: 2}}>
                    <TextField type="number" label="Qty" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock)))} inputProps={{min:1, max: product.stock}} sx={{width: 80}} />
                    <Button fullWidth variant="contained" size="large" startIcon={<AddShoppingCart/>} onClick={handleAddToCart} disabled={cartLoading || product.stock === 0} sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                        {cartLoading ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    {user?.role === 'client' && 
                        <IconButton onClick={handleToggleWishlist} disabled={wishlistLoading}>
                            {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
                        </IconButton>
                    }
                </Box>
                {cartMessage && <Alert severity={cartMessage.includes('successfully') ? 'success' : 'error'} sx={{mt: 2}}>{cartMessage}</Alert>}
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{...paperSx, p:3, mt: 4}}>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Customer Reviews</Typography>
            {token && user?.role === 'client' && 
                <Box component="form" onSubmit={handleReviewSubmit} sx={{mb: 4}}>
                    <Typography sx={{mb: 1}}>Write a Review</Typography>
                    <Rating value={reviewRating} onChange={(e, newValue) => setReviewRating(newValue)} sx={{mb: 1}}/>
                    <TextField fullWidth multiline rows={3} label="Comment" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} sx={{mb: 1}}/>
                    <Button variant="outlined" component="label" sx={{mb: 1}}>Upload Photo <input type="file" hidden accept="image/*" onChange={(e) => setReviewImage(e.target.files[0])} /></Button>
                    {reviewImage && <Typography variant="caption" sx={{ml: 1}}>{reviewImage.name}</Typography>}
                    <Button type="submit" variant="contained" sx={{display: 'block', mt: 1}} disabled={reviewLoading}>{reviewLoading ? 'Submitting...' : 'Submit Review'}</Button>
                    {reviewError && <Alert severity="error" sx={{mt: 1}}>{reviewError}</Alert>}
                </Box>
            }
            <List>
                {reviews.length === 0 ? <Typography>No reviews yet.</Typography> : reviews.map(review => (
                    <ListItem key={review.id} alignItems="flex-start">
                        <ListItemAvatar><Avatar>{review.user?.name?.charAt(0) || 'C'}</Avatar></ListItemAvatar>
                        <ListItemText
                            primary={review.user?.name || 'Customer'}
                            secondary={<>
                                <Rating value={review.rating} readOnly size="small"/>
                                <Typography variant="body2" color="text.primary">{review.comment}</Typography>
                                {review.imageUrl && <Box component="img" src={review.imageUrl} sx={{width: 100, height: 100, objectFit: 'cover', borderRadius: 1, mt: 1}} />}
                            </>}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>

      </Container>
    </Box>
  );
}

export default ProductDetailPage;