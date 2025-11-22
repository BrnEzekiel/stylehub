import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Switch, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook

const Header = ({ drawerWidth, handleDrawerToggle, handleSidebarToggle, isSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  return (
    <AppBar
      position="fixed"
      sx={{
        height: '80px', // Set header height
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Set background color
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it's above the sidebar
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        ...(isSidebarOpen && {
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }),
        ...(!isSidebarOpen && {
          width: `calc(100% - ${collapsedDrawerWidth}px)`,
          ml: `${collapsedDrawerWidth}px`,
        }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={handleSidebarToggle}
          sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}> {/* Added flexGrow to push theme toggle to the right */}
          StyleHub Admin
        </Typography>

        {/* Theme Toggle */}
        <FormControlLabel
          control={<Switch checked={theme === 'dark'} onChange={toggleTheme} />}
          label={theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          labelPlacement="start"
          sx={{ color: 'inherit' }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;