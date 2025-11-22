// src/pages/MyServicesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyServices } from '../api/serviceService';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Container,
  Paper
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import ServiceCard from '../components/ServiceCard';

function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyServices();
        setServices(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading your services...</Typography>
        </Box>
    );
  }

  return (
    <Box sx={pageSx}>
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900'}}>My Services</Typography>
                <Button component={Link} to="/my-services/create" variant="contained" sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                + Create Service
                </Button>
            </Box>
            {services.length === 0 ? (
                <Paper sx={{...paperSx, p: 4, textAlign: 'center'}}>
                    <Typography variant="h6">You haven’t created any services yet.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                {services.map((s) => (
                    <Grid item key={s.id} xs={12} sm={6} md={4}>
                        <ServiceCard service={s} />
                    </Grid>
                ))}
                </Grid>
            )}
        </Container>
    </Box>
  );
}

export default MyServicesPage;