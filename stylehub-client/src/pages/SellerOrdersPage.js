// src/pages/SellerOrdersPage.js

import React, { useState, useEffect } from 'react';
import { fetchSellerOrders, downloadOrderReceipt, updateSellerOrderStatus } from '../api/orderService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Chip, Container
} from '@mui/material';
import { Download, Chat, LocalShipping } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import GlassStatCard from '../components/GlassStatCard'; // Use GlassStatCard
import { FaDollarSign, FaShoppingCart, FaHourglassHalf } from 'react-icons/fa'; // Icons for StatCards
import { useSocket } from '../context/SocketContext';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency

function SellerOrdersPage() {
  const [data, setData] = useState({ orders: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  
  const { token, user } = useAuth();
  const { openChatWithUser } = useSocket();
  const navigate = useNavigate();

  const loadSellerData = async () => {
    try {
      setLoading(true);
      const sellerData = await fetchSellerOrders();
      setData(sellerData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Could not load seller dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'seller') {
      navigate('/login');
      return;
    }
    loadSellerData();
  }, [token, user, navigate]);

  const handleDownload = async (orderId) => {
    setDownloading(orderId);
    try {
      await downloadOrderReceipt(orderId);
    } catch (err) {
      alert(`Failed to download receipt: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleChatClick = (customer) => {
    if (!customer || !customer.id) {
      alert("Cannot chat: Customer ID is missing.");
      return;
    }
    openChatWithUser(customer.id, customer.name);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (newStatus === "") return;
    try {
      await updateSellerOrderStatus(orderId, newStatus);
      loadSellerData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
    
  const getStatusChip = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return <Chip label={status} color="success" size="small" />;
    if (s === 'pending') return <Chip label={status} color="warning" size="small" />;
    if (s === 'shipped') return <Chip label={status} color="info" size="small" />;
    if (s === 'cancelled') return <Chip label={status} color="error" size="small" />;
    return <Chip label={status} size="small" />;
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading your dashboard...</Typography>
        </Box>
    );
  }
  if (error) { return <Box sx={pageSx}><Typography color="error">{error}</Typography></Box>; }

  const { orders, summary } = data;

  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 3}}>📈 Seller Dashboard</Typography>
        
        {summary && (
          <Grid container spacing={3} sx={{mb: 4}}>
            <Grid item xs={12} sm={6} md={4}>
                <GlassStatCard 
                    title="Total Revenue" 
                    value={formatCurrency(summary.totalRevenue)}
                    icon={FaDollarSign}
                    linkTo="/seller/wallet"
                    gradient={`linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`}
                    delay={0.1}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <GlassStatCard 
                    title="Total Orders" 
                    value={summary.totalOrders.toString()}
                    icon={FaShoppingCart}
                    linkTo="/seller/orders"
                    gradient={`linear-gradient(135deg, ${COLORS.skyBlue} 0%, ${COLORS.yellow} 100%)`}
                    delay={0.2}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <GlassStatCard 
                    title="Pending Orders" 
                    value={summary.pendingOrders.toString()}
                    icon={FaHourglassHalf}
                    linkTo="/seller/orders?status=pending"
                    gradient={`linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.black} 100%)`}
                    delay={0.3}
                />
            </Grid>
          </Grid>
        )}
        
        <Box sx={{my: 4, borderBottom: '1px solid #eee'}} />

        <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Incoming Orders</Typography>
        {orders.length === 0 ? (
          <Paper sx={{...paperSx, p: 4, textAlign: 'center'}}>
            <Typography variant="h6">You have no orders yet.</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} 
            sx={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderRadius: '28px',
              padding: 'clamp(16px, 3vw, 24px)',
              border: `2px solid rgba(255, 255, 255, 0.12)`,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              overflowX: 'auto'
            }}
          >
            <Table sx={{minWidth: 700}}>
              <TableHead>
                <TableRow sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <TableCell sx={{color: COLORS.white, fontWeight: 'bold', fontSize: '1rem'}}>Order ID</TableCell>
                  <TableCell sx={{color: COLORS.white, fontWeight: 'bold', fontSize: '1rem'}}>Customer</TableCell>
                  <TableCell sx={{color: COLORS.white, fontWeight: 'bold', fontSize: '1rem'}}>Date</TableCell>
                  <TableCell sx={{color: COLORS.white, fontWeight: 'bold', fontSize: '1rem'}}>Status</TableCell>
                  <TableCell sx={{color: COLORS.white, fontWeight: 'bold', fontSize: '1rem'}}>Your Items</TableCell>
                  <TableCell sx={{color: COLORS.white, fontWeight: 'bold', fontSize: '1rem'}}>Your Earning</TableCell>
                  <TableCell sx={{color: COLORS.white, fontWeight: 'bold', fontSize: '1rem'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => {
                  const sellerEarning = order.items.reduce((acc, item) => 
                    acc + (parseFloat(item.sellerEarning) * item.quantity), 0); // Remove toFixed(2) here
                  const canBeShipped = order.status === 'paid';
                  
                  return (
                    <TableRow key={order.id} hover sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}>
                      <TableCell sx={{color: COLORS.white, borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                        <Link to={`/seller/orders/${order.id}`} style={{textDecoration: 'none', color: COLOR_PRIMARY_BLUE, fontWeight: 'bold'}}>
                          <Typography variant="body2" fontFamily="monospace">{(order.id || '').slice(0, 8)}...</Typography>
                        </Link>
                      </TableCell>
                      <TableCell sx={{color: COLORS.white, borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>{order.user?.name || 'N/A'}</TableCell>
                      <TableCell sx={{color: COLORS.white, borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell sx={{color: COLORS.white, borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>{getStatusChip(order.status)}</TableCell>
                      <TableCell sx={{color: COLORS.white, borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>{order.items.length}</TableCell>
                      <TableCell sx={{color: COLORS.white, borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}><Typography sx={{fontWeight: 'bold'}}>{formatCurrency(sellerEarning)}</Typography></TableCell>
                      <TableCell sx={{color: COLORS.white, borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                        <Button 
                          size="small" 
                          startIcon={<Download />} 
                          onClick={() => handleDownload(order.id)} 
                          disabled={downloading === order.id} 
                          sx={{ 
                            mr: 1, 
                            background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`, 
                            color: COLORS.white,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${COLORS.skyBlue} 0%, ${COLORS.blue} 100%)`,
                            }
                          }}
                        >
                          {downloading === order.id ? '...' : 'Receipt'}
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<Chat />} 
                          onClick={() => handleChatClick(order.user)} 
                          disabled={!order.user} 
                          sx={{ 
                            mr: 1, 
                            background: `linear-gradient(135deg, ${COLORS.yellow} 0%, ${COLORS.skyBlue} 100%)`,
                            color: COLORS.black,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${COLORS.skyBlue} 0%, ${COLORS.yellow} 100%)`,
                            }
                          }}
                        >
                          Chat
                        </Button>
                        {canBeShipped && (
                          <Button 
                            size="small" 
                            startIcon={<LocalShipping />} 
                            onClick={() => handleUpdateStatus(order.id, 'shipped')} 
                            sx={{ 
                              background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.blue} 100%)`,
                              color: COLORS.white,
                              '&:hover': {
                                background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.green} 100%)`,
                              }
                            }}
                          >
                            Mark as Shipped
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}

export default SellerOrdersPage;