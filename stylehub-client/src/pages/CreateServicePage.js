// src/pages/CreateServicePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService } from '../api/serviceService';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Container,
  Grid
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

const CATEGORIES = ['Hair', 'Nails', 'Makeup', 'Skincare', 'Barber'];

export default function CreateServicePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Hair',
    priceShopCents: '',
    priceHomeCents: '',
    offersHome: false,
    durationMinutes: 60,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== '') finalData.append(key, val);
    });
    if (imageFile) finalData.append('image', imageFile);

    setLoading(true);
    setMessage('');
    try {
      await createService(finalData);
      alert('Service created successfully!');
      navigate('/my-services');
    } catch (err) {
      let msg = 'Failed to create service.';
      if (err.response) {
        msg = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        msg = 'Network error. Please check your internet connection.';
      } else {
        msg = err.message || 'An unknown error occurred.';
      }
      setMessage(msg);
      console.error('Create service error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={pageSx}>
        <Container maxWidth="md">
            <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 3}}>Create a New Service</Typography>
            <Paper sx={{...paperSx, p: 4}}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} required multiline rows={4} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select name="category" value={formData.category} onChange={handleChange} label="Category">
                                    {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                           <TextField fullWidth label="Duration (minutes)" name="durationMinutes" type="number" value={formData.durationMinutes} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Price (Shop) - Ksh" name="priceShopCents" type="number" value={formData.priceShopCents} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox name="offersHome" checked={formData.offersHome} onChange={handleChange} />}
                                label="Offers Home Service"
                            />
                            {formData.offersHome && (
                                <TextField
                                    fullWidth
                                    label="Home Service Price - Ksh"
                                    name="priceHomeCents"
                                    type="number"
                                    value={formData.priceHomeCents}
                                    onChange={handleChange}
                                    required
                                    sx={{mt: 2}}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label" sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                                Upload Service Image
                                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required hidden />
                            </Button>
                            {imageFile && <Typography sx={{display: 'inline', ml: 2}}>{imageFile.name}</Typography>}
                        </Grid>
                        
                        {message && <Grid item xs={12}><Typography color="error">{message}</Typography></Grid>}

                        <Grid item xs={12}>
                            <Button type="submit" disabled={loading} variant="contained" size="large" fullWidth sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Service'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    </Box>
  );
}