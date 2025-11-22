// src/pages/ProviderBookingsPage.js
import React, { useState, useEffect } from 'react';
import { getMyProviderBookings, updateBookingStatus } from '../api/serviceService';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Chip
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency

function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyProviderBookings();
        setBookings(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert(err.message);
    }
  };
    
    const getStatusChip = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'confirmed') return <Chip label={status} color="success" size="small" />;
        if (s === 'pending') return <Chip label={status} color="warning" size="small" />;
        if (s === 'cancelled') return <Chip label={status} color="error" size="small" />;
        if (s === 'in_progress') return <Chip label={status} color="info" size="small" />;
        if (s === 'completed') return <Chip label={status} color="primary" size="small" />;
        return <Chip label={status} size="small" />;
    };


  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading bookings...</Typography>
        </Box>
    );
  }

  return (
    <Box sx={pageSx}>
      <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 3}}>My Bookings</Typography>
      {bookings.length === 0 ? (
        <Paper sx={{...paperSx, p: 4, textAlign: 'center'}}>
            <Typography variant="h6">No bookings yet.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{...paperSx, p: 2}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(b => (
                <TableRow key={b.id}>
                  <TableCell>{b.client?.name || '—'}</TableCell>
                  <TableCell>{b.service?.title}</TableCell>
                  <TableCell>{new Date(b.startTime).toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(b.price)}</TableCell>
                  <TableCell>{getStatusChip(b.status)}</TableCell>
                  <TableCell>
                    {b.status === 'pending' && (
                      <>
                        <Button variant="contained" size="small" sx={{ mr: 1, backgroundColor: COLOR_PRIMARY_BLUE }} onClick={() => handleStatusChange(b.id, 'confirmed')}>Confirm</Button>
                        <Button variant="contained" size="small" color="error" onClick={() => handleStatusChange(b.id, 'cancelled')}>Cancel</Button>
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <Button variant="contained" size="small" color="success" onClick={() => handleStatusChange(b.id, 'completed')}>Mark Complete</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ProviderBookingsPage;