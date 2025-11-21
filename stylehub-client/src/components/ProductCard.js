// src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Box, Typography, IconButton, Button, Chip } from '@mui/material';
import { paperSx, COLOR_PRIMARY_BLUE, COLOR_ACCENT_YELLOW } from '../styles/theme'; // Import COLOR_ACCENT_YELLOW
import { formatCurrency } from '../utils/styleUtils';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import './ProductCard.css';

const ProductCard = ({ product, isWishlisted, onToggleWishlist, userRole, onRemove }) => {
  return (
    <Paper sx={{ ...paperSx, p: 0, overflow: 'hidden', position: 'relative', background: 'rgba(0,0,0,0.3)', color: 'white' }}>
      {onRemove ? (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => onRemove(product.id)}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        >
          Remove
        </Button>
      ) : userRole === 'client' && (
        <IconButton 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, backgroundColor: 'rgba(255,255,255,0.7)' }}
        >
          {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      )}
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box
          component="img"
          src={product.imageUrl}
          alt={product.name}
          sx={{
            width: '100%',
            height: 140,
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        <Box sx={{ p: 2 }}>
          {product.category && (
            <Chip 
              label={product.category} 
              size="small" 
              className="radiate-chip"
              sx={{ mb: 1, backgroundColor: COLOR_PRIMARY_BLUE, color: 'white' }} 
            />
          )}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </Typography>
          {product.description && (
            <Typography variant="body2" sx={{ mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {product.description}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Box sx={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(5px)',
              borderRadius: '8px',
              padding: '4px 8px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLOR_ACCENT_YELLOW }}>
                {formatCurrency(product.price)}
              </Typography>
            </Box>
            {product.stock !== undefined && (
              <Typography variant="body2" sx={{ color: 'lightgreen', fontWeight: 'bold' }}>
                Stock: {product.stock}
              </Typography>
            )}
          </Box>
        </Box>
      </Link>
    </Paper>
  );
};

export default ProductCard;
