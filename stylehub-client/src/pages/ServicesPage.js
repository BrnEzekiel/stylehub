// src/pages/ServicesPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getServices } from '../api/serviceService';
import {
  Box, Typography, Grid, CircularProgress, Container, Paper, Alert
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import ServiceCard from '../components/ServiceCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = useQuery();
  const category = query.get('category');

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const params = category ? { category } : {};
        const data = await getServices(params);
        setServices(data);
        setError(null);
      } catch (err) {
        setError('Failed to load services.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [category]);

  const servicesList = services.services || services || [];

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading services...</Typography>
        </Box>
    );
  }
  
  if (error) { return <Box sx={pageSx}><Alert severity="error">{error}</Alert></Box>; }

  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 3}}>
          {category ? `Services in ${category}` : 'All Services'}
        </Typography>
        {servicesList.length === 0 ? (
          <Paper sx={{...paperSx, p: 4, textAlign: 'center'}}>
            <Typography variant="h6">No services available.</Typography>
            {category && <Typography color="text.secondary" sx={{mt: 1}}>Try browsing other categories or check back later.</Typography>}
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {servicesList.map((service) => (
              <Grid item key={service.id} xs={12} sm={6} md={4}>
                <ServiceCard service={service} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default ServicesPage;