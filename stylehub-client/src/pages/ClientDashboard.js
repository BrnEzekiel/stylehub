// src/pages/ClientDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchClientOrders } from '../api/orderService';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency
import StatCard from '../components/StatCard';

function ClientDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          const ordersData = await fetchClientOrders();
          setOrders(ordersData.slice(0, 3));
        } catch (error) {
          console.error("Failed to fetch recent orders:", error);
        }
        setLoading(false);
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return null; 
  }

  return (
    <Box sx={pageSx}>
      <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 1}}>Welcome, <span style={{color: 'lightgreen'}}>{user.name}</span>!</Typography>
      <Typography color="text.secondary" sx={{mb: 4}}>Here's a quick overview of your account.</Typography>

      <Grid container spacing={3}>
        <StatCard title="Go Shopping" icon="🛍️" linkTo="/products" />
        <StatCard title="View Your Cart" icon="🛒" linkTo="/cart" />
        <StatCard title="Order History" icon="🧾" linkTo="/orders" />
        <StatCard title="My Bookings" icon="📅" linkTo="/my-bookings" />
      </Grid>
      
      <Paper sx={{...paperSx, mt: 4, p: 3}}>
        <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Your Recent Orders</Typography>
        {loading ? (
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <CircularProgress size={24} sx={{color: COLOR_PRIMARY_BLUE, mr: 2}} />
                <Typography color="text.secondary">Loading orders...</Typography>
            </Box>
        ) : orders.length === 0 ? (
          <Typography>You haven't placed any orders yet.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

export default ClientDashboard;