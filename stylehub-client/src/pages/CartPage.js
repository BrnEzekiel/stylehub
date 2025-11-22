// src/pages/CartPage.js

import React, { useState, useEffect } from 'react';
import { fetchCart, createOrder, removeItemFromCart } from '../api/cartService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  Container
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils';

function CartPage() {
  const [cartData, setCartData] = useState({ items: [], subtotal: 0, shippingFee: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Kenya',
  });

  const loadCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const apiResponse = await fetchCart();
      setCartData({
        items: apiResponse.cart.items || [],
        subtotal: apiResponse.subtotal,
        shippingFee: apiResponse.shippingFee,
        total: apiResponse.total,
      });
      // Pre-fill address
      if (user) {
        setAddress(prev => ({ 
          ...prev, 
          fullName: user.name || '', 
          phone: user.phone || '' 
        }));
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartData.items.length === 0) return;
    
    setCheckoutLoading(true);
    setCheckoutMessage('');
    try {
      const newOrder = await createOrder(address);
      setCheckoutMessage(`Order #${newOrder.orderId.substring(0,8)} created! Total: ${formatCurrency(newOrder.totalAmount)}`);
      setCartData({ items: [], subtotal: 0, shippingFee: 0, total: 0 }); 
    } catch (err) {
      setCheckoutMessage(err.message || 'Checkout failed. Please review your address and cart items.');
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading your cart...</Typography>
        </Box>
    );
  }

  const { items, subtotal, shippingFee, total } = cartData;

  if (checkoutMessage.includes('created!')) {
    return (
        <Box sx={{...pageSx, textAlign: 'center'}}>
            <Paper sx={{...paperSx, p: 4, display: 'inline-block'}}>
                <Typography variant="h4" sx={{ color: 'green', fontWeight: 'bold', mb: 2 }}>🎉 Checkout Successful! 🎉</Typography>
                <Typography variant="h6" sx={{ color: 'green', mb: 4 }}>{checkoutMessage}</Typography>
                <Button 
                    variant="contained"
                    sx={{backgroundColor: COLOR_PRIMARY_BLUE}}
                    onClick={() => navigate('/')}
                >
                    Continue Shopping
                </Button>
            </Paper>
        </Box>
    );
  }

  return (
    <Box sx={pageSx}>
        <Container maxWidth="lg">
            <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 2, color: COLOR_PRIMARY_BLUE }}>
                Back
            </Button>
            <Typography variant="h4" gutterBottom sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 3}}>
                Checkout
            </Typography>
            
            <Grid container spacing={4}>
                {/* Left Side: Address Form */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{...paperSx, p: 4}}>
                        <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 3}}>Shipping Address</Typography>
                        <Box component="form" onSubmit={handleCheckout}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField label="Full Name" name="fullName" value={address.fullName} onChange={handleAddressChange} required fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Phone Number" name="phone" value={address.phone} onChange={handleAddressChange} required fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Street Address" name="street" value={address.street} onChange={handleAddressChange} required fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField label="City" name="city" value={address.city} onChange={handleAddressChange} required fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField label="State / County" name="state" value={address.state} onChange={handleAddressChange} required fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField label="ZIP Code" name="zipCode" value={address.zipCode} onChange={handleAddressChange} required fullWidth />
                                </Grid>
                            </Grid>
                            
                            {checkoutMessage && !checkoutMessage.includes('created!') && (
                                <Typography color="error" sx={{mt: 2}}>{checkoutMessage}</Typography>
                            )}
                            
                            <Button 
                                type="submit"
                                disabled={checkoutLoading || items.length === 0} 
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3, backgroundColor: COLOR_PRIMARY_BLUE, p: 1.5 }}
                            >
                                {checkoutLoading ? <CircularProgress size={24} color="inherit" /> : `Pay ${formatCurrency(total)}`}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                
                {/* Right Side: Order Summary */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{...paperSx, p: 4, position: 'sticky', top: '20px' }}>
                        <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 3}}>Order Summary</Typography>
                        <Box sx={{mb: 2}}>
                            {items.map(item => (
                                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box component="img" src={item.product?.imageUrl} alt={item.product?.name} sx={{width: 50, height: 50, objectFit: 'cover', borderRadius: 1, mr: 2}} />
                                    <Box sx={{flex: 1}}>
                                        <Typography variant="body1" sx={{fontWeight: 'medium'}}>{item.product?.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">Qty: {item.quantity}</Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{fontWeight: 'medium'}}>{formatCurrency(item.product?.price * item.quantity)}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ borderTop: '1px solid #ccc', pt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="textSecondary">Subtotal</Typography>
                                <Typography sx={{fontWeight: 'medium'}}>{formatCurrency(subtotal)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography color="textSecondary">Shipping</Typography>
                                <Typography sx={{fontWeight: 'medium'}}>{formatCurrency(shippingFee)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #ccc' }}>
                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Total</Typography>
                                <Typography variant="h6" sx={{fontWeight: 'bold', color: COLOR_PRIMARY_BLUE}}>{formatCurrency(total)}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </Box>
  );
}

export default CartPage;