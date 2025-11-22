import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClientOrders, downloadOrderReceipt } from '../api/orderService';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Container,
} from '@mui/material';
import { ArrowBack, Download, Check, AccessTime, Close } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const orders = await fetchClientOrders();
        const foundOrder = orders?.find((o) => o.id === id);
        if (!foundOrder) {
          setError('Order not found');
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadOrderReceipt(id);
    } catch (err) {
      alert(`Failed to download receipt: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const getStatusChip = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'delivered') return <Chip icon={<Check />} label={status} color="success" size="small" />;
    if (s === 'pending') return <Chip icon={<AccessTime />} label={status} color="warning" size="small" />;
    if (s === 'cancelled') return <Chip icon={<Close />} label={status} color="error" size="small" />;
    return <Chip label={status} size="small" />;
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading order details...</Typography>
        </Box>
    );
  }

  if (error) {
    return (
      <Box sx={pageSx}>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 2, color: COLOR_PRIMARY_BLUE }}>Back</Button>
        <Paper sx={{...paperSx, p: 3, textAlign: 'center'}}>
          <Typography color="error" variant="h6">Error: {error}</Typography>
        </Paper>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={pageSx}>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 2, color: COLOR_PRIMARY_BLUE }}>Back</Button>
        <Paper sx={{...paperSx, p: 3, textAlign: 'center'}}>
          <Typography variant="h6">Order not found</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 2, color: COLOR_PRIMARY_BLUE }}>Back to Orders</Button>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{...paperSx, p: 3, mb: 3}}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK}}>Order Details</Typography>
                  <Typography variant="caption" color="textSecondary">{order.id}</Typography>
                </Box>
                {getStatusChip(order.status)}
              </Box>

              <Grid container spacing={2} sx={{ mt: 2, pt: 2, borderTop: '1px solid #ccc' }}>
                <Grid item xs={4}><Typography variant="caption" color="textSecondary">Order Date</Typography><Typography sx={{fontWeight: 'medium'}}>{new Date(order.createdAt).toLocaleDateString()}</Typography></Grid>
                <Grid item xs={4}><Typography variant="caption" color="textSecondary">Total Amount</Typography><Typography sx={{fontWeight: 'bold'}}>{formatCurrency(order.totalAmount)}</Typography></Grid>
                <Grid item xs={4}><Typography variant="caption" color="textSecondary">Items</Typography><Typography sx={{fontWeight: 'medium'}}>{(order.items || []).length}</Typography></Grid>
              </Grid>
            </Paper>

            <Paper sx={{...paperSx, p: 3}}>
                <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Order Items</Typography>
                {(order.items || []).map((item, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Box>
                            <Typography sx={{fontWeight: 'bold'}}>{item.product?.name || 'Product'}</Typography>
                            <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
                         </Box>
                         <Typography sx={{fontWeight: 'bold'}}>{formatCurrency(item.price * item.quantity)}</Typography>
                    </Paper>
                ))}
                <Box sx={{mt: 3, pt: 2, borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'flex-end'}}>
                    <Box sx={{width: 250}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}><Typography color="text.secondary">Subtotal</Typography><Typography>{formatCurrency(order.totalAmount)}</Typography></Box>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mt:1, pt:1, borderTop: '1px solid #ddd'}}><Typography variant="h6" sx={{fontWeight: 'bold'}}>Total</Typography><Typography variant="h6" sx={{fontWeight: 'bold'}}>{formatCurrency(order.totalAmount)}</Typography></Box>
                    </Box>
                </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{...paperSx, p: 3, position: 'sticky', top: '20px' }}>
              <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Actions</Typography>
              <Button onClick={handleDownload} disabled={downloading} fullWidth variant="contained" startIcon={<Download />} sx={{ mb: 2, backgroundColor: COLOR_PRIMARY_BLUE }}>
                {downloading ? 'Downloading...' : 'Download Receipt'}
              </Button>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ccc' }}>
                <Typography variant="caption" color="textSecondary">Shipping Address</Typography>
                <Typography>{order.shippingAddress || 'Not provided'}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default OrderDetailPage;
