// src/App.js

import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css'; // Make sure this is imported
import { useAuth } from './context/AuthContext'; 

// Import Pages
import Home from './pages/Home';
import Products from './pages/Products';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import CreateProductPage from './pages/CreateProductPage';
import ProductDetailPage from './pages/ProductDetailPage'; 
import CartPage from './pages/CartPage'; 
import OrdersPage from './pages/OrdersPage'; 
import SellerOrdersPage from './pages/SellerOrdersPage';
import SearchPage from './pages/SearchPage';
import KYCPage from './pages/KYCPage';

function App() {
  const { token, user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // 1. 🛑 Add state for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
      setSearchTerm('');
      setIsMenuOpen(false); // Close menu on search
    }
  };
  
  // 2. 🛑 Helper function to close menu on link click
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };
  
  // 3. 🛑 We put all links in one component to avoid repeating
  const NavLinks = ({ isMobile = false }) => (
    <>
      <Link to="/products" onClick={handleLinkClick}>Products</Link>
      
      {token ? (
        <>
          {user && user.role === 'seller' && (
            <>
              <Link to="/seller/orders" onClick={handleLinkClick}>📈 Dashboard</Link>
              <Link to="/create-product" onClick={handleLinkClick}>Create Product</Link>
              <Link to="/kyc" onClick={handleLinkClick}>Submit KYC</Link>
            </>
          )}
          {user && user.role === 'client' && (
            <>
              <Link to="/orders" onClick={handleLinkClick}>Order History</Link>
              <Link to="/cart" onClick={handleLinkClick}>🛒 Cart</Link>
            </>
          )}
          <button 
            onClick={() => {
              logout();
              handleLinkClick();
            }}
            style={isMobile ? {} : { background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1em' }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={handleLinkClick}>Login</Link>
          <Link to="/register" onClick={handleLinkClick}>Register</Link>
        </>
      )}
    </>
  );

  return (
    <div className="App">
      <nav>
        {/* 4. 🛑 Home link is always visible */}
        <Link to="/" style={{ fontSize: '1.5em', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>
          StyleHub
        </Link>
        
        {/* 5. 🛑 Search Form */}
        <form onSubmit={handleSearchSubmit} className="nav-search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* 6. 🛑 Desktop Links (hidden on mobile) */}
        <div className="nav-links">
          <NavLinks />
        </div>
        
        {/* 7. 🛑 Hamburger Icon (hidden on desktop) */}
        <button className="mobile-menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
      </nav>
      
      {/* 8. 🛑 Mobile Menu Dropdown (shown when 'open') */}
      <div className={`nav-links-mobile ${isMenuOpen ? 'open' : ''}`}>
        <NavLinks isMobile={true} />
      </div>

      <hr />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} /> 
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/kyc" element={<KYCPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;