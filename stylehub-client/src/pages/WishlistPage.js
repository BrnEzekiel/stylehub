// src/pages/WishlistPage.js

import React, { useState, useEffect } from 'react';
import { getWishlist, removeWishlistItem } from '../api/wishlistService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Typography, Grid, CircularProgress, Container, Paper, Button, Alert
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import ProductCard from '../components/ProductCard';


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
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading your wishlist...</Typography>
        </Box>
    );
  }
  
  if (error) { return <Box sx={pageSx}><Alert severity="error">{error}</Alert></Box>; }
  
  if (!wishlist || wishlist.items.length === 0) {
    return (
      <Box sx={pageSx}>
        <Container maxWidth="md" sx={{textAlign: 'center'}}>
          <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>My Wishlist</Typography>
          <Paper sx={{...paperSx, p: 4}}>
            <Typography variant="h6" sx={{mb: 2}}>You haven't added any items to your wishlist yet.</Typography>
            <Button component={Link} to="/products" variant="contained" sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>Go Shopping</Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{fontWeight: '900', color: COLOR_TEXT_DARK, mb: 3}}>My Wishlist</Typography>
        <Grid container spacing={2}>
          {wishlist.items.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ProductCard 
                product={item.product} 
                onRemove={handleRemove} 
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default WishlistPage;