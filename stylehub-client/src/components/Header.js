// src/components/Header.js

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faUser, faCrown, faHistory, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
      setSearchTerm('');
      setIsMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm" style={{ zIndex: 1000 }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo192.png" 
                alt="StyleHub Logo" 
                style={{ height: '50px', width: 'auto' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <span className="font-bold text-xl" style={{ display: 'none', marginLeft: '8px' }}>
                <span style={{ color: 'var(--color-primary)' }}>Style</span><span style={{ color: 'var(--color-secondary)' }}>Hub</span>
              </span>
            </Link>
          </div>
          
          <div className="flex-1 mx-4 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text" 
                placeholder="Search services, products, providers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none"
                style={{ 
                  focusRing: '2px solid var(--color-primary)',
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--color-primary)'}
                onBlur={(e) => e.target.style.boxShadow = ''}
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="text-gray-600 focus:outline-none"
              >
                <FontAwesomeIcon icon={faSearch} className="text-xl" />
              </button>
            </div>
            
            <div className="relative">
              <button className="text-gray-600 focus:outline-none relative">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                <span className="badge flex items-center justify-center w-5 h-5 bg-red-500 rounded-full text-white text-xs">3</span>
              </button>
            </div>
            
            {user && (
              <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <FontAwesomeIcon icon={faCrown} className="text-yellow-500 mr-1" />
                <span className="text-sm font-medium">235 pts</span>
              </div>
            )}

            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 rounded-full focus:outline-none flex items-center justify-center transition-all hover:scale-110"
                style={{ 
                  background: user 
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-blue))'
                    : '#e5e7eb',
                  boxShadow: user ? '0 2px 8px rgba(250, 15, 140, 0.3)' : 'none'
                }}
              >
                {user ? (
                  <span className="text-white font-bold text-sm">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                )}
              </button>
              
              {isUserMenuOpen && user && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <p>{user.name || 'User'}</p>
                    <p>{user.email}</p>
                  </div>
                  <ul className="user-dropdown-menu">
                    <li>
                      <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)}>
                        <FontAwesomeIcon icon={faUser} /> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}>
                        <FontAwesomeIcon icon={faHistory} /> Order History
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => { navigate('/my-wallet'); setIsUserMenuOpen(false); }} className="w-full text-left" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <FontAwesomeIcon icon={faCrown} /> Loyalty Points
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { navigate('/settings'); setIsUserMenuOpen(false); }} className="w-full text-left" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <FontAwesomeIcon icon={faCog} /> Settings
                      </button>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="w-full text-left" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile search bar */}
        <div className={`mobile-search-bar ${isMobileSearchOpen ? 'active' : ''}`}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search services, products, providers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
          </form>
        </div>
      </header>
    </>
  );
}