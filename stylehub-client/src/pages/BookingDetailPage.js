import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientBookings, cancelBooking, downloadBookingConfirmation } from '../api/serviceService';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Close,
  Check,
  AccessTime,
  Download,
} from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency

function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        const bookings = await getClientBookings();
        const foundBooking = bookings?.find((b) => b.id === id);
        if (!foundBooking) {
          setError('Booking not found');
        } else {
          setBooking(foundBooking);
        }
      } catch (err) {
        setError(err.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await cancelBooking(id);
      alert('Booking cancelled successfully.');
      navigate('/orders');
    } catch (err) {
      alert(`Failed to cancel booking: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadConfirmation = async () => {
    setDownloading(true);
    try {
      await downloadBookingConfirmation(id);
    } catch (err) {
      alert(`Failed to download confirmation: ${err.message || err}`);
    } finally {
      setDownloading(false);
    }
  };

  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'confirmed') return <Check sx={{ color: 'green' }} />;
    if (s === 'pending') return <AccessTime sx={{ color: 'orange' }} />;
    if (s === 'cancelled') return <Close sx={{ color: 'red' }} />;
    return null;
  };

  const canCancelBooking = (b) => {
    return b?.status === 'pending' || b?.status === 'confirmed';
  };

  if (loading) {
    return (
      <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
        <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading booking details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={pageSx}>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 2, color: COLOR_PRIMARY_BLUE }}>
          Back
        </Button>
        <Paper sx={{...paperSx, p: 3, textAlign: 'center', backgroundColor: '#ffdddd'}}>
          <Typography color="error" variant="h6">Error: {error}</Typography>
        </Paper>
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box sx={pageSx}>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 2, color: COLOR_PRIMARY_BLUE }}>
          Back
        </Button>
        <Paper sx={{...paperSx, p: 3, textAlign: 'center'}}>
          <Typography variant="h6">Booking not found</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={pageSx}>
      <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 4, color: COLOR_PRIMARY_BLUE }}>
        Back to Bookings
      </Button>

      <Grid container spacing={3}>
        {/* Main Booking Info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{...paperSx, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK}}>{booking.service?.title || 'Service Booking'}</Typography>
                <Typography variant="caption" color="textSecondary">{booking.id}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getStatusIcon(booking.status)}
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{booking.status || 'N/A'}</Typography>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mt: 2, pt: 2, borderTop: '1px solid #ccc' }}>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">Booking Date</Typography>
                <Typography variant="body1" sx={{fontWeight: 'medium'}}>{new Date(booking.createdAt).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">Service Date</Typography>
                <Typography variant="body1" sx={{fontWeight: 'medium'}}>{new Date(booking.startTime).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">Time</Typography>
                <Typography variant="body1" sx={{fontWeight: 'medium'}}>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Service Details */}
          <Paper sx={{...paperSx, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Service Details</Typography>

            {booking.service?.imageUrl && (
              <Box component="img" src={booking.service.imageUrl} alt={booking.service.title} sx={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 2, mb: 2 }} />
            )}

            <Typography variant="body1" color="textSecondary" sx={{mb: 2}}>{booking.service?.description || 'No description'}</Typography>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Provider</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'medium'}}>{booking.provider?.name || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Duration</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'medium'}}>{booking.duration || 'N/A'} hours</Typography>
                </Grid>
            </Grid>
          </Paper>

          {/* Price Breakdown */}
          <Paper sx={{...paperSx, p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Price Breakdown</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Service Price</Typography>
                <Typography>{formatCurrency(booking.price)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #ccc' }}>
                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Total</Typography>
                <Typography variant="h6" sx={{fontWeight: 'bold', color: COLOR_PRIMARY_BLUE}}>{formatCurrency(booking.price)}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar - Actions & Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{...paperSx, p: 3, position: 'sticky', top: '20px' }}>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Actions</Typography>

            <Button
              onClick={handleDownloadConfirmation}
              disabled={downloading}
              variant="contained"
              startIcon={<Download />}
              fullWidth
              sx={{ mb: 2, backgroundColor: COLOR_PRIMARY_BLUE }}
            >
              {downloading ? 'Downloading...' : 'Download Confirmation'}
            </Button>

            {canCancelBooking(booking) && (
              <Button
                onClick={handleCancel}
                disabled={cancelling}
                variant="outlined"
                color="error"
                startIcon={<Close />}
                fullWidth
                sx={{ mb: 2 }}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            )}

            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #ccc' }}>
                {booking.notes && (
                    <Box sx={{mb: 2}}>
                        <Typography variant="caption" color="textSecondary">Notes</Typography>
                        <Typography variant="body2">{booking.notes}</Typography>
                    </Box>
                )}
                 <Box>
                    <Typography variant="caption" color="textSecondary">Booked On</Typography>
                    <Typography variant="body2">{new Date(booking.createdAt).toLocaleString()}</Typography>
                </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BookingDetailPage;

