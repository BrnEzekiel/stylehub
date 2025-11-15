// src/components/BottomNav.js

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

const NavItem = ({ to, icon, exact = false }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  
  return (
    <NavLink 
      to={to} 
      className={`flex flex-col items-center justify-center transition-all ${
        isActive 
          ? 'text-primary' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
      style={{ 
        padding: '12px 16px',
        flex: 1,
        position: 'relative',
        height: '100%'
      }}
    >
      <FontAwesomeIcon 
        icon={icon} 
        style={{ 
          fontSize: '28px',
          transition: 'transform 0.2s',
          transform: isActive ? 'scale(1.2)' : 'scale(1)'
        }}
      />
      {isActive && (
        <div 
          style={{ 
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50px',
            height: '4px',
            backgroundColor: 'var(--color-primary)',
            borderRadius: '2px 2px 0 0'
          }}
        />
      )}
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
          { to: '/dashboard', icon: faUser },
        ];
      
      case 'seller':
        return [
          { to: '/', icon: faHome, exact: true },
          { to: '/marketplace', icon: faShoppingBag },
          { to: '/seller-dashboard', icon: faThLarge },
          { to: '/wallet', icon: faWallet },
          { to: '/dashboard', icon: faUser },
        ];
      
      case 'service_provider':
        return [
          { to: '/', icon: faHome, exact: true },
          { to: '/my-services', icon: faThLarge },
          { to: '/provider-bookings', icon: faCalendarAlt },
          { to: '/style-diy', icon: faUsers },
          { to: '/provider-dashboard', icon: faUser },
        ];
      
      default:
        return [
          { to: '/', icon: faHome, exact: true },
          { to: '/marketplace', icon: faShoppingBag },
          { to: '/style-diy', icon: faUsers },
          { to: '/orders', icon: faHistory },
          { to: '/dashboard', icon: faUser },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white bottom-nav z-50"
      style={{ 
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        borderTop: '1px solid #e5e7eb',
        height: '70px'
      }}
    >
      <div className="flex items-center justify-around" style={{ 
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        padding: '0 16px'
      }}>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}
