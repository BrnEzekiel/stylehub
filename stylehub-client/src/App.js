// src/App.js

import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, NavLink } from 'react-router-dom';
import './App.css'; 
import { useAuth } from './context/AuthContext';
import { categories } from './utils/categories'; 
import { ChatContainer } from './components/Chat';

// Import Pages
import Home from './pages/Home';
import ClientDashboard from './pages/ClientDashboard';
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
import VerificationPage from './pages/VerificationPage';
import WishlistPage from './pages/WishlistPage';
import SellerWalletPage from './pages/SellerWalletPage'; // 1. 🛑 Import new page

// --- Reusable Layout Component ---
function MainLayout({ children }) {
  return (
    <div className="admin-layout"> 
      <aside className="sidebar">
        <h3>Categories</h3>
        <ul className="sidebar-nav">
          <li><NavLink to="/products">All Products</NavLink></li>
          {categories.map((category) => (
            <li key={category}>
              <NavLink to={`/products?category=${category}`}>
                {category}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

// --- Main App Component ---
function App() {
  const { token, user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      {token && user?.role === 'client' && <Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link>}
      {token && user?.role === 'seller' && <Link to="/seller-dashboard" onClick={handleLinkClick}>Dashboard</Link>}
      
      <Link to="/products" onClick={handleLinkClick}>Products</Link>
      
      {token ? (
        <>
          {user?.role === 'seller' && (
            <>
              {/* 2. 🛑 Add new link for sellers */}
              <Link to="/wallet" onClick={handleLinkClick}>My Wallet</Link>
              <Link to="/create-product" onClick={handleLinkClick}>Create Product</Link>
              <Link to="/kyc" onClick={handleLinkClick}>KYC</Link>
              <Link to="/verification" onClick={handleLinkClick}>Verification</Link>
            </>
          )}
          {user?.role === 'client' && (
            <>
              <Link to="/orders" onClick={handleLinkClick}>My Orders</Link>
              <Link to="/wishlist" onClick={handleLinkClick}>My Wishlist</Link>
            </>
          )}
          <button onClick={() => { logout(); handleLinkClick(); }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={handleLinkClick}>Login</Link>
          <Link to="/register" onClick={handleLinkClick}>Register</Link>
        </>
      )}
      
      {user?.role !== 'seller' && (
        <Link to="/cart" onClick={handleLinkClick} style={{ fontSize: '1.5em', color: 'var(--color-primary)' }}>🛒</Link>
      )}
    </>
  );

  return (
    <div className="App-Layout">
      <nav className="top-nav">
        <Link to="/" className="top-nav-logo">
          <img src="/logo192.png" alt="StyleHub Logo" style={{ height: '60px', verticalAlign: 'middle' }} />
        </Link>
        
        <form onSubmit={handleSearchSubmit} className="nav-search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="top-nav-links">
          <NavLinks />
        </div>

        <button className="mobile-menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
      </nav>
      
      <div className={`nav-links-mobile ${isMenuOpen ? 'open' : ''}`}>
        <NavLinks />
      </div>

      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
        <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><ClientDashboard /></MainLayout>} />
        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} /> 
        <Route path="/seller-dashboard" element={<SellerOrdersPage />} /> 
        <Route path="/kyc" element={<KYCPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        {/* 3. 🛑 Add new route */}
        <Route path="/wallet" element={<SellerWalletPage />} />
      </Routes>
      
      <ChatContainer />
    </div>
  );
}

export default App;