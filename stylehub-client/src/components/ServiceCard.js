// src/components/ServiceCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Box, Typography, Button, Chip } from '@mui/material';
import { paperSx, COLOR_PRIMARY_BLUE } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency
import { Verified } from '@mui/icons-material';

const ServiceCard = ({ service }) => {
  return (
    <Paper sx={{ ...paperSx, p: 0, overflow: 'hidden', position: 'relative' }}>
        {service.provider?.verificationStatus === 'approved' && (
            <Chip
                icon={<Verified />}
                label="Verified"
                color="success"
                size="small"
                sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
            />
        )}
      <Link to={`/services/${service.id}`} style={{ textDecoration: 'none' }}>
        <Box
          component="img"
          src={service.imageUrl}
          alt={service.title}
          sx={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">{service.category}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mt: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {service.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 1, height: 40, overflow: 'hidden' }}>
            {service.description}
          </Typography>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLOR_PRIMARY_BLUE }}>
                    {formatCurrency(service.priceShopCents)}
                </Typography>
                <Button variant="contained" sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>Book Now</Button>
           </Box>
        </Box>
      </Link>
    </Paper>
  );
};

export default ServiceCard;
