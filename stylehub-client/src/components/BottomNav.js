import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faThLarge, 
  faCalendarAlt,
  faHistory,
  faUsers,
  faUser,
  faShoppingBag,
  faWallet,
  faCommentAlt,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import './BottomNav.css';

const NavItem = ({ to, icon, exact = false }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  
  return (
    <NavLink 
      to={to} 
      className={`nav-item ${isActive ? 'active' : ''}`}
    >
      <FontAwesomeIcon icon={icon} className="nav-item-icon" />
      {isActive && <div className="nav-item-indicator" />}
    </NavLink>
  );
};

export function BottomNav() {
  const { user, token } = useAuth();
  
  if (!token || !user) {
    return null; // Don't show bottom nav if not logged in
  }

  const role = user.role;

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (role) {
      case 'client':
        return [
          { to: '/', icon: faHome, exact: true },
          { to: '/marketplace', icon: faShoppingBag },
          { to: '/style-diy', icon: faUsers },
          { to: '/orders', icon: faHistory },
          { to: '/dashboard/client', icon: faUser },
        ];
      
      case 'seller':
        return [
          { to: '/', icon: faHome, exact: true },
          { to: '/marketplace', icon: faShoppingBag },
          { to: '/style-diy', icon: faUsers }, // Added for sellers
          { to: '/seller/wallet', icon: faWallet },
          { to: '/seller-dashboard', icon: faUser }, // Changed to seller-dashboard
        ];
      
      case 'service_provider':
        return [
          { to: '/', icon: faHome, exact: true },
          { to: '/my-services', icon: faThLarge },
          { to: '/provider-bookings', icon: faCalendarAlt },
          { to: '/style-diy', icon: faUsers },
          { to: '/dashboard/provider', icon: faUser },
        ];
      
      default:
        return [
          { to: '/', icon: faHome, exact: true },
          { to: '/marketplace', icon: faShoppingBag },
          { to: '/style-diy', icon: faUsers },
          { to: '/orders', icon: faHistory },
          { to: '/dashboard/client', icon: faUser },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}
