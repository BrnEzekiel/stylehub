// src/pages/ServiceDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, createBooking } from '../api/serviceService';
import { useAuth } from '../context/AuthContext';
import {
    Box, Typography, Button, Grid, Paper, TextField, CircularProgress, Container, Chip, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel, Alert
} from '@mui/material';
import { VerifiedUser } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

function ServiceDetailPage() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [isHome, setIsHome] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const { id } = useParams();
  const { token } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const navigate = useNavigate();

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const data = await getServiceById(id);
        setService(data);
        setError(null);
      } catch (err) {
        setError('Service not found.');
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [id]);

  const handleBook = async () => {
    if (!token) return navigate('/login');
    if (!bookingDate) return alert('Please select a date and time.');

    try {
      await createBooking({
        serviceId: id,
        startTime: bookingDate,
        isHomeService: isHome,
        paymentMethod: paymentMethod,
      });
      setBookingMessage('Booking request sent! Check your bookings page.');
    } catch (err) {
      setBookingMessage(err.message || 'Failed to book.');
    }
  };

  if (loading) return <Box sx={{...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><CircularProgress /></Box>;
  if (error) return <Box sx={pageSx}><Alert severity="error">{error}</Alert></Box>;
  if (!service) return <Box sx={pageSx}><Alert severity="warning">Service not found.</Alert></Box>;

  const price = isHome ? service.priceHomeCents : service.priceShopCents;
  const canBookHome = service.offersHome && service.priceHomeCents;

  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{...paperSx, p: 0, overflow: 'hidden'}}><Box component="img" src={service.imageUrl} alt={service.title} sx={{ width: '100%', height: 'auto' }} /></Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{...paperSx, p:3}}>
                {service.provider?.verificationStatus === 'approved' && <Chip icon={<VerifiedUser />} label="Verified Provider" color="success" size="small" sx={{mb: 1}} />}
                <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK}}>{service.title}</Typography>
                <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_PRIMARY_BLUE, my: 2}}>Ksh {parseFloat(price).toFixed(2)}</Typography>
                <Typography variant="body1" color="text.secondary">{service.description}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{mt: 2}}>Duration: {service.durationMinutes} minutes</Typography>

                {canBookHome && (
                    <FormControlLabel control={<Checkbox checked={isHome} onChange={(e) => setIsHome(e.target.checked)} />} label="Book at home" sx={{mt: 2}}/>
                )}
                
                <FormControl fullWidth sx={{mt: 2, mb: 2}}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} label="Payment Method">
                        <MenuItem value="cash_on_delivery">Cash on Delivery</MenuItem>
                        <MenuItem value="mpesa">M-Pesa</MenuItem>
                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    </Select>
                </FormControl>

                <TextField fullWidth type="datetime-local" label="Preferred Date & Time" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{mb: 2}}/>

                <Button fullWidth variant="contained" size="large" onClick={handleBook} disabled={!bookingDate} sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                    Book Now
                </Button>
                {bookingMessage && <Alert severity={bookingMessage.includes('sent') ? 'success' : 'error'} sx={{mt: 2}}>{bookingMessage}</Alert>}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ServiceDetailPage;