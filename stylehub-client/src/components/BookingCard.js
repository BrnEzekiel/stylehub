// src/components/BookingCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Box, Typography, Button, Chip } from '@mui/material';
import { paperSx, COLOR_PRIMARY_BLUE } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency
import { Close } from '@mui/icons-material';

const BookingCard = ({ booking, onCancel, isCancelling }) => {

    const getStatusChip = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'completed' || s === 'confirmed') return <Chip label={status} color="success" size="small" />;
        if (s === 'pending') return <Chip label={status} color="warning" size="small" />;
        if (s === 'cancelled' || s === 'disputed') return <Chip label={status} color="error" size="small" />;
        return <Chip label={status} size="small" />;
    };
    
    const canCancelBooking = (booking) => {
        return booking?.status === 'pending' || booking?.status === 'confirmed';
    };

  return (
    <Paper sx={{ ...paperSx, p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Booking</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{(booking.id || '').slice(0, 10)}…</Typography>
           <Typography variant="caption" color="text.secondary">{new Date(booking.startTime).toLocaleString()}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">Price</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>{formatCurrency(booking.price)}</Typography>
          {getStatusChip(booking.status)}
        </Box>
      </Box>
      <Typography sx={{ my: 1, fontWeight: 'medium' }}>{booking.service?.title}</Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        {canCancelBooking(booking) ? (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onCancel(booking.id)}
            disabled={isCancelling}
            startIcon={<Close />}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel'}
          </Button>
        ) : <Box sx={{flex: 1}} />}
        <Button component={Link} to={`/bookings/${booking.id}`} variant="contained" size="small" sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
          Details
        </Button>
      </Box>
    </Paper>
  );
};

export default BookingCard;
