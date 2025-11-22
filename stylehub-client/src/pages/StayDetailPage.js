import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import staysService from '../api/staysService';
import {
  Box, Typography, Button, Grid, Paper, TextField, CircularProgress, Container, Rating, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, List, ListItem, ListItemText, ListItemAvatar, Avatar, Alert
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

const StayDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingForm, setBookingForm] = useState({
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1,
    specialRequests: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchStayDetails();
  }, [id]);

  const fetchStayDetails = async () => {
    try {
      setLoading(true);
      const response = await staysService.getStayById(id);
      setStay(response);
    } catch (err) {
      setError('Failed to load stay details');
      console.error('Error fetching stay details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const bookingData = {
        stayId: id,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        guestCount: bookingForm.guestCount,
        specialRequests: bookingForm.specialRequests,
      };

      await staysService.createBooking(bookingData);
      alert('Booking request submitted successfully!');
      setShowBookingForm(false);
      setBookingForm({
        checkInDate: '',
        checkOutDate: '',
        guestCount: 1,
        specialRequests: '',
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateNights = () => {
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) return 0;
    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    return Math.max(0, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
  };

  const calculateTotalPrice = () => {
    if (!stay) return 0;
    const nights = calculateNights();
    const basePrice = (stay.pricePerMonth / 30) * nights;
    const serviceFee = basePrice * 0.1;
    return basePrice + serviceFee;
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading stay details...</Typography>
        </Box>
    );
  }

  if (error || !stay) {
    return (
        <Box sx={{ ...pageSx, textAlign: 'center' }}>
            <Alert severity="error">{error || 'Stay not found'}</Alert>
            <Button onClick={() => navigate('/stays')} variant="contained" sx={{ mt: 2, backgroundColor: COLOR_PRIMARY_BLUE }}>
                Back to Stays
            </Button>
        </Box>
    );
  }

  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        {/* Image Gallery */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{...paperSx, p:0, overflow: 'hidden'}}>
              <Box component="img" src={stay.images?.[selectedImage]?.url || '/placeholder-stay.jpg'} alt={stay.title} sx={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 2 }} />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={2}>
              {stay.images?.slice(1, 5).map((image, index) => (
                <Grid item xs={6} key={image.id}>
                  <Paper sx={{...paperSx, p:0, overflow: 'hidden', cursor: 'pointer', '&:hover': {opacity: 0.8}}} onClick={() => setSelectedImage(index + 1)}>
                    <Box component="img" src={image.url} alt={`${stay.title} ${index + 2}`} sx={{ width: '100%', height: 192, objectFit: 'cover', borderRadius: 2 }} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{...paperSx, p:3, mb: 3}}>
              <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 1}}>{stay.title}</Typography>
              <Typography color="text.secondary" sx={{mb: 2}}>{stay.address}, {stay.city}, {stay.state}, {stay.country}</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Chip label={stay.type.replace('_', ' ')} />
                <Chip label={`Max ${stay.maxOccupants} guests`} />
                {stay.ratingAverage && (
                  <Chip label={`${stay.ratingAverage.toFixed(1)} (${stay.reviewCount} reviews)`} icon={<Rating value={1} max={1} readOnly size="small" />} />
                )}
              </Box>
            </Paper>

            {/* Description */}
            <Paper sx={{...paperSx, p:3, mb: 3}}>
              <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>About this place</Typography>
              <Typography color="text.secondary" sx={{lineHeight: 1.8}}>{stay.description}</Typography>
            </Paper>

            {/* Amenities */}
            {stay.amenities && stay.amenities.length > 0 && (
              <Paper sx={{...paperSx, p:3, mb: 3}}>
                <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Amenities</Typography>
                <Grid container spacing={2}>
                  {stay.amenities.map((amenity) => (
                    <Grid item xs={6} md={4} key={amenity.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography>{amenity.type.replace('_', ' ')}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {/* House Rules */}
            {stay.houseRules && (
              <Paper sx={{...paperSx, p:3, mb: 3}}>
                <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>House Rules</Typography>
                <Typography color="text.secondary">{stay.houseRules}</Typography>
              </Paper>
            )}

            {/* Reviews */}
            {stay.reviews && stay.reviews.length > 0 && (
              <Paper sx={{...paperSx, p:3, mb: 3}}>
                <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Reviews</Typography>
                <List>
                  {stay.reviews.slice(0, 5).map((review) => (
                    <ListItem key={review.id} alignItems="flex-start" sx={{pb: 2, mb: 2, borderBottom: '1px solid #eee'}}>
                      <ListItemAvatar><Avatar>{review.user?.name?.charAt(0) || 'A'}</Avatar></ListItemAvatar>
                      <ListItemText
                        primary={<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography sx={{fontWeight: 'bold'}}>{review.user?.name || 'Anonymous'}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(review.createdAt).toLocaleDateString()}</Typography>
                        </Box>}
                        secondary={<>
                          <Rating value={review.rating} readOnly size="small" sx={{my: 0.5}}/>
                          {review.title && <Typography sx={{fontWeight: 'medium'}}>{review.title}</Typography>}
                          {review.comment && <Typography variant="body2" color="text.primary">{review.comment}</Typography>}
                        </>}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>

          {/* Booking Card */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{...paperSx, p:3, position: 'sticky', top: '20px'}}>
              <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>
                KSh {stay.pricePerMonth.toLocaleString()}
                <Typography component="span" variant="body1" color="text.secondary">/month</Typography>
              </Typography>

              {!showBookingForm ? (
                <Button fullWidth variant="contained" onClick={() => setShowBookingForm(true)} sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                  Request to Book
                </Button>
              ) : (
                <Box component="form" onSubmit={handleBookingSubmit} sx={{mt: 2}}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-in Date"
                    value={bookingForm.checkInDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, checkInDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    sx={{mb: 2}}
                    required
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-out Date"
                    value={bookingForm.checkOutDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, checkOutDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: bookingForm.checkInDate || new Date().toISOString().split('T')[0] }}
                    sx={{mb: 2}}
                    required
                  />

                  <FormControl fullWidth sx={{mb: 2}}>
                    <InputLabel>Number of Guests</InputLabel>
                    <Select value={bookingForm.guestCount} onChange={(e) => setBookingForm(prev => ({ ...prev, guestCount: parseInt(e.target.value) }))} label="Number of Guests">
                      {[...Array(stay.maxOccupants)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {i + 1} guest{i !== 0 ? 's' : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Special Requests (Optional)"
                    multiline
                    rows={3}
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requests or notes..."
                    sx={{mb: 2}}
                  />

                  {calculateNights() > 0 && (
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Base price ({calculateNights()} nights)</Typography>
                        <Typography variant="body2">KSh {((stay.pricePerMonth / 30) * calculateNights()).toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Service fee</Typography>
                        <Typography variant="body2">KSh {(((stay.pricePerMonth / 30) * calculateNights()) * 0.1).toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', pt: 1, borderTop: '1px solid #eee' }}>
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h6">KSh {calculateTotalPrice().toLocaleString()}</Typography>
                      </Box>
                    </Paper>
                  )}

                  <Button type="submit" fullWidth variant="contained" disabled={bookingLoading} sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                    {bookingLoading ? 'Submitting...' : 'Request Booking'}
                  </Button>
                  <Button type="button" fullWidth variant="outlined" onClick={() => setShowBookingForm(false)} sx={{mt: 1}}>
                    Cancel
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StayDetailPage;
