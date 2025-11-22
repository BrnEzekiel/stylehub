// src/utils/styleUtils.js
import { useTheme } from '@mui/material/styles';

export const useUnderlinedHeadingStyle = () => {
  const theme = useTheme();
  return {
    color: theme.palette.text.primary, // Using primary text color for the heading
    fontWeight: '900',
    mb: { xs: 3, md: 4 }, // Responsive margin-bottom
    fontSize: { xs: '1.75rem', sm: '2.5rem' }, // Responsive font-size
    borderBottom: `3px solid ${theme.palette.secondary.main}`, // Underline with secondary color
    display: 'inline-block', // Ensures borderBottom wraps content
    pb: 0.5, // Padding-bottom for space between text and underline
  };
};

export const formatCurrency = (value) => {
    if (!value) return 'Ksh 0.00';
    const numericValue = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericValue)) return value;
  
    if (numericValue >= 1000000) {
      return `Ksh ${(numericValue / 1000000).toFixed(1)}M`;
    }
    if (numericValue >= 1000) {
      return `Ksh ${(numericValue / 1000).toFixed(1)}K`;
    }
    return `Ksh ${numericValue.toFixed(2)}`;
  };