import { createTheme } from '@mui/material/styles';

// Function to create a theme based on mode (light/dark)
export const getAppTheme = (mode) => {
  return createTheme({
    palette: {
      mode: mode, // 'light' or 'dark'
      primary: {
        main: mode === 'light' ? '#0f1f3d' : '#212c44', // --color-primary
      },
      secondary: {
        main: mode === 'light' ? '#fa0f8c' : '#ff3cac', // --color-secondary
      },
      accent: { // Custom color for accent, not directly part of MUI palette but used
        main: mode === 'light' ? '#ffe600' : '#ffeb3b', // --color-accent
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#121212', // --color-bg
        paper: mode === 'light' ? '#f9f9f9' : '#1e1e1e', // --color-bg-secondary
      },
      text: {
        primary: mode === 'light' ? '#0a0a0a' : '#e0e0e0', // --color-text
        secondary: mode === 'light' ? '#333333' : '#b0b0b0', // --color-text-secondary
      },
      muted: { // Custom color
        main: mode === 'light' ? '#6b6b6b' : '#9e9e9e', // --color-muted
      },
      border: { // Custom color
        main: mode === 'light' ? '#e0e0e0' : '#333333', // --color-border
      },
      success: {
        main: mode === 'light' ? '#16a34a' : '#69f0ae',
      },
      warning: {
        main: mode === 'light' ? '#d97706' : '#ffb300',
      },
      error: {
        main: mode === 'light' ? '#e11d48' : '#ff5252',
      },
      info: {
        main: mode === 'light' ? '#0284c7' : '#82b1ff',
      },
    },
    typography: {
      fontFamily: 'Inter, "Segoe UI", sans-serif', // --font-primary
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px', // Standard borderRadius
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '2px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // AppBar background
            color: mode === 'light' ? '#0a0a0a' : '#e0e0e0', // AppBar text color
            boxShadow: 'none', // Remove shadow
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Sidebar background
            color: mode === 'light' ? '#ffffff' : '#e0e0e0', // Sidebar text
          }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(15, 31, 61, 0.08)' : 'rgba(33, 44, 68, 0.08)',
            },
          },
        },
      },
    },
  });
};


