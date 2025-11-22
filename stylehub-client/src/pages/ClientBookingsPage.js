// src/pages/ClientBookingsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import { Phone, LocationOn, Payment, Close } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK, COLOR_ACCENT_MAGENTA } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency

function ClientBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        alert('Failed to load bookings. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['pending', 'confirmed', 'in_progress'].includes(booking.status);
    if (filter === 'completed') return booking.status === 'completed';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  // Status badge with color
  const renderStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'warning' },
      confirmed: { label: 'Confirmed', color: 'info' },
      in_progress: { label: 'In Progress', color: 'secondary' },
      completed: { label: 'Completed', color: 'success' },
      cancelled: { label: 'Cancelled', color: 'error' },
      disputed: { label: 'Disputed', color: 'error' },
    };

    const { label, color } = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={label} color={color} size="small" />;
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      // Optimistic update
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading your bookings...</Typography>
        </Box>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <Box sx={{...pageSx, textAlign: 'center'}}>
        <Paper sx={{...paperSx, p: 4, display: 'inline-block'}}>
          <Typography variant="h2" sx={{ mb: 2, color: COLOR_PRIMARY_BLUE }}>📅</Typography>
          <Typography variant="h5" sx={{fontWeight: 'bold', mb: 1}}>No Bookings Yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You haven’t booked any services yet.
          </Typography>
          <Button component={Link} to="/services" variant="contained" sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
            Browse Services
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={pageSx}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900'}}>My Bookings</Typography>
        <FormControl variant="outlined" size="small">
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter"
          >
            <MenuItem value="all">All Bookings</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{...paperSx, p: 2}}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{b.service?.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    #{b.id.substring(0, 8)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{b.provider?.name || '—'}</Typography>
                  <Button size="small" startIcon={<Phone sx={{fontSize: 14}}/>} sx={{textTransform: 'none', p:0}}>Contact</Button>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{new Date(b.startTime).toLocaleDateString()}</Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>{new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <LocationOn sx={{fontSize: 16, mr: 0.5}}/>
                    <Typography variant="body2">{b.isHomeService ? 'At Home' : 'At Shop'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{formatCurrency(b.price)}</Typography>
                </TableCell>
                <TableCell>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Payment sx={{fontSize: 16, mr: 0.5}}/>
                        <Typography variant="body2">{b.paymentMethod?.replace('_', ' ') || '—'}</Typography>
                    </Box>
                </TableCell>
                <TableCell>{renderStatusBadge(b.status)}</TableCell>
                <TableCell>
                  {['pending', 'confirmed'].includes(b.status) && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<Close />}
                      onClick={() => handleCancelBooking(b.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ClientBookingsPage;