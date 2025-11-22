// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/glassmorphism.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme as useCustomTheme } from './context/ThemeContext'; // Import our custom ThemeProvider and useTheme
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'; // Import Material-UI ThemeProvider
import { getAppTheme } from './styles/theme'; // Import our getAppTheme function

function ThemedApp() {
  const { theme: customTheme } = useCustomTheme(); // Get our custom theme mode
  const muiTheme = React.useMemo(() => getAppTheme(customTheme), [customTheme]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider> {/* Our custom theme provider */}
      <ThemedApp />
    </ThemeProvider>
  </React.StrictMode>
);