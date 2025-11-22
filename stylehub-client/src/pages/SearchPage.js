// src/pages/SearchPage.js

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../api/productService';
import { useAuth } from '../context/AuthContext';
import { getWishlistProductIds, addWishlistItem, removeWishlistItem } from '../api/wishlistService';
import {
  Box, Typography, Grid, CircularProgress, Container, Paper, Pagination, Alert
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import ProductCard from '../components/ProductCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  const [data, setData] = useState({ products: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { token, user } = useAuth();
  
  const navigate = useNavigate();
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
        const params = { search: searchTerm, page: page, limit: 9 };
        
        const [responseData, wishlistIdSet] = await Promise.all([
          getProducts(params),
          token && user?.role === 'client' ? getWishlistProductIds() : new Set()
        ]);
        
        setData(responseData);
        setWishlistIds(wishlistIdSet);
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [searchTerm, page, token, user]);

  const handleToggleWishlist = async (productId) => {
    if (!token || user?.role !== 'client') {
      navigate('/login');
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
  
  const handlePageChange = (event, value) => {
      navigate(`/search?q=${searchTerm}&page=${value}`);
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2 }}>Searching for "{searchTerm}"...</Typography>
        </Box>
    );
  }
  if (error) { return <Box sx={pageSx}><Alert severity="error">{error}</Alert></Box>; }

  const { products, meta } = data;
  const { totalPages, total } = meta;

  return (
    <Box sx={pageSx}>
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 1}}>Search Results for "{searchTerm}"</Typography>
            <Typography color="text.secondary" sx={{mb: 3}}>{total || 0} results found.</Typography>
            
            {products.length === 0 ? (
                <Paper sx={{...paperSx, p: 4, textAlign: 'center'}}>
                    <Typography variant="h6">No products matched your search.</Typography>
                </Paper>
            ) : (
            <>
                <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <ProductCard 
                            product={product} 
                            isWishlisted={wishlistIds.has(product.id)} 
                            onToggleWishlist={handleToggleWishlist}
                            userRole={user?.role}
                        />
                    </Grid>
                ))}
                </Grid>

                {totalPages > 1 && (
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                    </Box>
                )}
            </>
            )}
        </Container>
    </Box>
  );
}

export default SearchPage;