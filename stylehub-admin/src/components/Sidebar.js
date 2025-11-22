import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import HotelIcon from '@mui/icons-material/Hotel';
import ForumIcon from '@mui/icons-material/Forum';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'User Management', icon: <PeopleIcon />, path: '/users' },
  { text: 'Product Management', icon: <ShoppingCartIcon />, path: '/products' },
  { text: 'Service Management', icon: <RoomServiceIcon />, path: '/services' },
  { text: 'Stays & Accommodation', icon: <HotelIcon />, path: '/stays' },
  { text: 'Community Management', icon: <ForumIcon />, path: '/community' },
  { text: 'Order Management', icon: <ShoppingCartIcon />, path: '/orders' },
  { text: 'Financials', icon: <AttachMoneyIcon />, path: '/financials' },
  { text: 'KYC Dashboard', icon: <VerifiedUserIcon />, path: '/kyc' },
  { text: 'Portfolio Management', icon: <BusinessCenterIcon />, path: '/portfolios' },
  { text: 'Verification Admin', icon: <VerifiedUserIcon />, path: '/verifications' },
  { text: 'Withdrawal Requests', icon: <AttachMoneyIcon />, path: '/withdrawals' },
];

const Sidebar = ({ drawerWidth, collapsedDrawerWidth, mobileOpen, handleDrawerToggle, isSidebarOpen }) => {
  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem button component={Link} to={item.path} key={item.text}>
            <ListItemIcon sx={{ minWidth: isSidebarOpen ? '40px' : 'auto' }}>{item.icon}</ListItemIcon>
            {isSidebarOpen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isSidebarOpen ? drawerWidth : collapsedDrawerWidth,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Set background color
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
