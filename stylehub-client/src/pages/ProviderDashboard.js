// src/pages/ProviderDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Container,
} from '@mui/material';
import { pageSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import StatCard from '../components/StatCard';

function ProviderDashboard() {
  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 3}}>Service Provider Dashboard</Typography>
        <Grid container spacing={3}>
          <StatCard title="My Services" icon="💇‍♀️" linkTo="/my-services" />
          <StatCard title="My Bookings" icon="📅" linkTo="/provider-bookings" />
          <StatCard title="Portfolio Status" icon="📁" linkTo="/portfolio" />
        </Grid>
        <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          Manage your services, bookings, and profile from here.
        </Typography>
      </Container>
    </Box>
  );
}

export default ProviderDashboard;