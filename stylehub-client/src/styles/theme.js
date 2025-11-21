// --- COLOR PALETTE DEFINITION ---
import { createTheme } from '@mui/material/styles';

export const COLOR_PRIMARY_BLUE = '#0f35df'; // Deep Blue
export const COLOR_ACCENT_MAGENTA = '#fa0f8c'; // Bright Magenta
export const COLOR_ACCENT_YELLOW = '#FFD700'; // Gold/Vibrant Yellow
export const COLOR_TEXT_DARK = '#1A2027'; // Near Black
export const COLOR_BACKGROUND_LIGHT = '#e0e5ec'; // Adjusted base color for optimal Neumorphism effect

// --- NEUMORPHISM SHADOWS ---
export const NEU_RAISED_SHADOW = '6px 6px 12px #bebfc3, -6px -6px 12px #ffffff';
export const NEU_PRESSED_SHADOW = 'inset 4px 4px 8px #bebfc3, inset -4px -4px 8px #ffffff';

// --- SHARED STYLES ---
export const pageSx = {
    fontFamily: 'Inter, sans-serif',
};

export const paperSx = {
    mt: { xs: 2, md: 4 },
    p: { xs: 1.5, sm: 3 },
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '2px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
};

export const mainTheme = createTheme({
  palette: {
    primary: {
      main: COLOR_PRIMARY_BLUE,
    },
    secondary: {
      main: COLOR_ACCENT_MAGENTA,
    },
    // You can define other palette colors here if needed
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.component === 'a' && ownerState.to && { // Target Buttons used as Links
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(1.05)',
              boxShadow: '0 0 15px rgba(255,255,255,0.4)',
            },
          }),
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'white', // Default text color to white
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'white', // Default icon color to white
        },
      },
    },
    MuiInputBase: { // For text fields, ensure input text is white
      styleOverrides: {
        input: {
          color: 'white',
        },
      },
    },
    MuiFormLabel: { // For input labels, ensure label text is white
      styleOverrides: {
        root: {
          color: 'white',
          '&.Mui-focused': { // Keep label white when focused
            color: 'white',
          },
        },
      },
    },
  },
});