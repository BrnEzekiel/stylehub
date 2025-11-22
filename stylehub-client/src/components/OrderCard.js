// src/components/OrderCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Box, Typography, Button, Chip } from '@mui/material';
import { paperSx, COLOR_PRIMARY_BLUE } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency
import { Download } from '@mui/icons-material';

const OrderCard = ({ order, onDownload, isDownloading }) => {
    
    const getStatusChip = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'completed' || s === 'delivered') return <Chip label={status} color="success" size="small" />;
        if (s === 'pending') return <Chip label={status} color="warning" size="small" />;
        if (s === 'cancelled') return <Chip label={status} color="error" size="small" />;
        return <Chip label={status} size="small" />;
    };

  return (
    <Paper sx={{ ...paperSx, p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Order</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{(order.id || '').slice(0, 10)}…</Typography>
          <Typography variant="caption" color="text.secondary">{new Date(order.createdAt).toLocaleString()}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">Total</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>{formatCurrency(order.totalAmount)}</Typography>
          {getStatusChip(order.status)}
        </Box>
      </Box>
      <Box sx={{ mt: 1 }}>
        {(order.items || []).slice(0, 3).map((it, idx) => (
          <Typography key={idx} variant="body2" color="text.secondary">
            {it.product?.name || 'Item'} × {it.quantity}
          </Typography>
        ))}
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onDownload(order.id)}
          disabled={isDownloading}
          startIcon={<Download />}
        >
          {isDownloading ? 'Downloading...' : 'Receipt'}
        </Button>
        <Button component={Link} to={`/orders/${order.id}`} variant="contained" size="small" sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
          Details
        </Button>
      </Box>
    </Paper>
  );
};

export default OrderCard;
