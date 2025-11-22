// src/components/StayCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Box, Typography } from '@mui/material';
import { paperSx, COLOR_PRIMARY_BLUE } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency

const StayCard = ({ stay }) => {
  return (
    <Paper sx={{ ...paperSx, p: 0, overflow: 'hidden' }}>
      <Link to={`/stays/${stay.id}`} style={{ textDecoration: 'none' }}>
        <Box
          component="img"
          src={stay.images?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={stay.title}
          sx={{
            width: '100%',
            height: 160,
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">{stay.city || 'Unknown Location'}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {stay.title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLOR_PRIMARY_BLUE, mt: 1 }}>
            {formatCurrency(stay.pricePerMonth)}/month
          </Typography>
        </Box>
      </Link>
    </Paper>
  );
};

export default StayCard;
