import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        drawerWidth={isSidebarOpen ? drawerWidth : collapsedDrawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        handleSidebarToggle={handleSidebarToggle}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar
        drawerWidth={drawerWidth}
        collapsedDrawerWidth={collapsedDrawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isSidebarOpen={isSidebarOpen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0066FF 0%, #00BFFF 50%, #000000 100%)', // Global gradient background
          paddingTop: '80px', // Header height
          paddingBottom: 0, // No bottom nav in admin
          p: 3, // Retain existing padding for left/right/bottom content
          width: '100%', // Default to full width for mobile
          marginLeft: 0,   // Default to no margin for mobile
          // Apply desktop styles based on breakpoint
          sm: {
            width: `calc(100% - ${isSidebarOpen ? drawerWidth : collapsedDrawerWidth}px)`,
            marginLeft: `${isSidebarOpen ? drawerWidth : collapsedDrawerWidth}px`,
          },
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

