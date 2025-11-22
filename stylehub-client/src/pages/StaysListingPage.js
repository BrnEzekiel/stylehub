import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { staysService } from '../api/staysService';
import {
  Box, Typography, Grid, CircularProgress, Container, Paper, TextField, Select, MenuItem, FormControl, InputLabel, Pagination, Alert, Rating
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import StayCard from '../components/StayCard';


const StaysListingPage = () => {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    type: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStays();
  }, [filters, pagination.page]);

  const fetchStays = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await staysService.getAllStays(params);
      setStays(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta?.total || 0,
        totalPages: response.meta?.totalPages || 0,
      }));
    } catch (err) {
      setError('Failed to load stays');
      console.error('Error fetching stays:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && stays.length === 0) {
    return (
      <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
        <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading stays...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{fontWeight: '900', color: COLOR_TEXT_DARK, mb: 3}}>Find Your Perfect Stay</Typography>

        {/* Filters */}
        <Paper sx={{...paperSx, p: 3, mb: 4}}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="City" name="city" value={filters.city} onChange={handleFilterChange} placeholder="Enter city" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Min Price" name="minPrice" type="number" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min price" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Max Price" name="maxPrice" type="number" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max price" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select name="type" value={filters.type} onChange={handleFilterChange} label="Type">
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="APARTMENT">Apartment</MenuItem>
                  <MenuItem value="HOUSE">House</MenuItem>
                  <MenuItem value="ROOM">Room</MenuItem>
                  <MenuItem value="SHARED_ROOM">Shared Room</MenuItem>
                  <MenuItem value="HOSTEL">Hostel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Results */}
        {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

        <Typography color="text.secondary" sx={{mb: 2}}>
          {pagination.total} stays found
        </Typography>

        {/* Stays Grid */}
        {stays.length === 0 && !loading ? (
          <Paper sx={{...paperSx, p: 4, textAlign: 'center'}}>
            <Typography variant="h6" sx={{fontSize: '3rem', mb: 2}}>🏠</Typography>
            <Typography variant="h6" sx={{fontWeight: 'bold', mb: 1}}>No stays found</Typography>
            <Typography color="text.secondary">Try adjusting your filters or search criteria.</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {stays.map((stay) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={stay.id}>
                <StayCard stay={stay} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination count={pagination.totalPages} page={pagination.page} onChange={handlePageChange} color="primary" />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StaysListingPage;
