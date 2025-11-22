import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHistory, faCog, faSignOutAlt, faIdCard, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Added faEye, faEyeSlash
import { getNotifications, getUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } from '../api/notificationsService'; // Import notification service
import { Box, IconButton, Badge, Popover, Typography, List, ListItem, ListItemText, Divider, Menu, MenuItem, Tooltip } from '@mui/material'; // Material-UI components, added Tooltip
import { Notifications, Close } from '@mui/icons-material'; // Material-UI icons
import './Header.css';
import apiClient from '../api/axiosConfig'; // Ensure apiClient is imported for wallet balance fetch

const formatCurrency = (value) => {
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

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null); // State for MUI Menu anchor
  const isUserMenuOpen = Boolean(userMenuAnchorEl); // Derived state for MUI Menu
  const [searchTerm, setSearchTerm] = useState(''); // Retain for now, although mobile search is removed

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Wallet Balance states
  const [walletBalance, setWalletBalance] = useState('Ksh 0.00');
  const [walletBalanceAnchorEl, setWalletBalanceAnchorEl] = useState(null);
  const isWalletBalancePopoverOpen = Boolean(walletBalanceAnchorEl);

  // No longer need handleClickOutside for custom dropdown with MUI Menu
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
  //       setIsUserMenuOpen(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    if (user && user.id) { // Only fetch if user is logged in
      try {
        const fetchedNotifications = await getNotifications();
        setNotifications(fetchedNotifications);
        const count = await getUnreadNotificationsCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch on mount

    const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [user]); // Re-fetch if user changes

  const handleLogout = () => {
    logout();
    handleCloseUserMenu(); // Close the menu after logout
    navigate('/');
  };

  const handleNotificationsToggle = async (event) => {
    if (!user) { // Don't open if not logged in
      navigate('/login');
      return;
    }

    if (isNotificationsOpen) {
      // If closing, mark all currently visible unread notifications as read
      // This logic will be handled by handleCloseNotifications
    }
    setNotificationAnchorEl(event.currentTarget);
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleCloseNotifications = async () => {
    // When popover closes, mark all currently visible unread notifications as read
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
    fetchNotifications(); // Refresh count and status
    setIsNotificationsOpen(false);
    setNotificationAnchorEl(null);
  };

  // Handlers for MUI User Menu
  const handleOpenUserMenu = (event) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  // Fetch Wallet Balance
  const fetchWalletBalance = async () => {
    if (user && user.id) {
      try {
        const response = await apiClient.get(`/wallet/balance`); // Assuming this endpoint exists
        setWalletBalance(formatCurrency(response.data.balance));
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        setWalletBalance('Error');
      }
    }
  };

  // Handlers for Wallet Balance Popover
  const handleToggleWalletBalance = async (event) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (walletBalanceAnchorEl) { // If already open, close it
      setWalletBalanceAnchorEl(null);
    } else { // If closed, open it and fetch balance
      await fetchWalletBalance();
      setWalletBalanceAnchorEl(event.currentTarget);
    }
  };

  const handleCloseWalletBalance = () => {
    setWalletBalanceAnchorEl(null);
  };



  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo192.png" 
              alt="StyleHub Logo" 
              className="logo-img"
            />
          </Link>
        </div>
        
        <div className="header-actions">
          
          {user && ( // Only show wallet balance toggle if user is logged in
            <div className="relative">
              <Tooltip title={isWalletBalancePopoverOpen ? "Hide Balance" : "Show Balance"}>
                <IconButton color="inherit" onClick={handleToggleWalletBalance}>
                  <FontAwesomeIcon icon={isWalletBalancePopoverOpen ? faEyeSlash : faEye} />
                </IconButton>
              </Tooltip>
              <Popover
                open={isWalletBalancePopoverOpen}
                anchorEl={walletBalanceAnchorEl}
                onClose={handleCloseWalletBalance}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Wallet Balance: {walletBalance}
                  </Typography>
                </Box>
              </Popover>
            </div>
          )}

          <div className="relative">
            <IconButton color="inherit" onClick={handleNotificationsToggle}>
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <Popover
              open={isNotificationsOpen}
              anchorEl={notificationAnchorEl}
              onClose={handleCloseNotifications}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ width: 300, maxHeight: 400, overflowY: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                  <Typography variant="h6" sx={{ ml: 1 }}>Notifications</Typography>
                  <IconButton size="small" onClick={handleCloseNotifications}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
                <Divider />
                <List dense>
                  {notifications.length === 0 ? (
                    <ListItem><ListItemText primary="No new notifications." /></ListItem>
                  ) : (
                    notifications.map((notification) => (
                      <ListItem 
                        key={notification.id} 
                        onClick={() => console.log('Notification clicked:', notification.id)} // Placeholder for navigation
                        sx={{ bgcolor: notification.read ? 'transparent' : 'action.selected' }}
                      >
                        <ListItemText 
                          primary={notification.message} 
                          secondary={new Date(notification.timestamp).toLocaleString()} 
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            </Popover>
          </div>
          
          <div className="relative"> {/* Removed ref={userMenuRef} as it's no longer needed for custom dropdown */}
            <button 
              onClick={handleOpenUserMenu} // Use MUI Menu handler
              className={`user-menu-btn ${user ? 'user-avatar' : 'user-avatar-placeholder'}`}
            >
              {user ? (
                <span className="user-avatar-initial">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}
            </button>
            
            <Menu
              anchorEl={userMenuAnchorEl}
              open={isUserMenuOpen && user} // Only open if anchor is set AND user is logged in
              onClose={handleCloseUserMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                style: {
                  width: '250px', // Match previous custom dropdown width
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Match previous custom dropdown shadow
                  borderRadius: '8px', // Match previous custom dropdown border-radius
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {user && ( // Ensure user exists before rendering menu items
                <Box sx={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <Typography variant="subtitle1" fontWeight="600" color="text.dark">
                    {user.name || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              )}
              <MenuItem onClick={() => { navigate('/dashboard'); handleCloseUserMenu(); }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.75rem' }} /> My Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/orders'); handleCloseUserMenu(); }}>
                <FontAwesomeIcon icon={faHistory} style={{ marginRight: '0.75rem' }} /> Order History
              </MenuItem>
              <MenuItem onClick={() => { navigate('/verification-hub'); handleCloseUserMenu(); }}>
                <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '0.75rem' }} /> Verification
              </MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); handleCloseUserMenu(); }}>
                <FontAwesomeIcon icon={faCog} style={{ marginRight: '0.75rem' }} /> Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '0.75rem' }} /> Log Out
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      
      {/* Mobile search bar - removed */}
    </header>
  );
}