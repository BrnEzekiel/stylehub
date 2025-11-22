import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Box, Typography, IconButton, Button, Chip, Rating } from '@mui/material';
import { Favorite, FavoriteBorder, Visibility, ShoppingCart } from '@mui/icons-material'; // Import Visibility for quick view
import { paperSx, COLOR_PRIMARY_BLUE, COLOR_ACCENT_YELLOW } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils';
import './ProductCard.css';

const ProductCard = ({ product, isWishlisted, onToggleWishlist, userRole, onRemove, onQuickView }) => {
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const inStock = product.stock !== undefined ? product.stock : 0; // Default to 0 if stock is undefined

  const getStockChipProps = () => {
    if (inStock > 20) {
      return { label: 'In Stock', color: 'success' };
    } else if (inStock > 0) {
      return { label: 'Low Stock', color: 'warning' };
    } else {
      return { label: 'Out of Stock', color: 'error' };
    }
  };

  return (
    <Paper sx={{ ...paperSx, p: 0, overflow: 'hidden', position: 'relative', background: 'rgba(0,0,0,0.3)', color: 'white' }}>
      {/* Badges and Actions */}
      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {product.isNew && <Chip label="NEW" size="small" sx={{ backgroundColor: 'rgb(6, 182, 212)', color: 'white', fontWeight: 'bold' }} />}
        {product.badge && <Chip label={product.badge} size="small" sx={{ backgroundColor: 'rgb(249, 115, 22)', color: 'white', fontWeight: 'bold' }} />}
        {discount > 0 && <Chip label={`-${discount}%`} size="small" sx={{ backgroundColor: 'red', color: 'white', fontWeight: 'bold' }} />}
      </Box>

      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 0.5 }}>
        {userRole === 'client' && (
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            sx={{ backgroundColor: 'rgba(255,255,255,0.7)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } }}
            size="small"
          >
            {isWishlisted ? <Favorite color="error" fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
        )}
        {onQuickView && (
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            sx={{ backgroundColor: 'rgba(255,255,255,0.7)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } }}
            size="small"
          >
            <Visibility fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Remove Button for specific contexts */}
      {onRemove && (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => onRemove(product.id)}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        >
          Remove
        </Button>
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

          {/* Rating and Reviews */}
          {(product.rating || product.reviews) && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={product.rating || 0} precision={0.5} readOnly size="small" />
              {product.reviews && (
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  ({product.reviews} reviews)
                </Typography>
              )}
            </Box>
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
              {product.originalPrice && discount > 0 && (
                <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', ml: 1 }}>
                  {formatCurrency(product.originalPrice)}
                </Typography>
              )}
            </Box>
            <Chip
              label={getStockChipProps().label}
              color={getStockChipProps().color}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: COLOR_PRIMARY_BLUE, '&:hover': { backgroundColor: COLOR_PRIMARY_BLUE } }}
            startIcon={<ShoppingCart fontSize="small" />}
          >
            Add to Cart
          </Button>
        </Box>
      </Link>
    </Paper>
  );
};

export default ProductCard;