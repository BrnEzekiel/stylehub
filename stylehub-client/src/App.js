// src/App.js

import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, NavLink } from 'react-router-dom';
import './App.css'; 
import { useAuth } from './context/AuthContext';
import { categories } from './utils/categories'; 
import ChatContainer from './components/Chat';

// Import Pages
import ClientWalletPage from './pages/ClientWalletPage';
import ProviderWalletPage from './pages/ProviderWalletPage'; // if you make one
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
import SellerWalletPage from './pages/SellerWalletPage';

// 1. 🛑 NEW: Import all new Service & Booking pages
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import PortfolioUploadPage from './pages/PortfolioUploadPage';
import ProviderDashboard from './pages/ProviderDashboard';
import MyServicesPage from './pages/MyServicesPage';
import CreateServicePage from './pages/CreateServicePage';
import ProviderBookingsPage from './pages/ProviderBookingsPage';
import ClientBookingsPage from './pages/ClientBookingsPage';


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
          
          {/* 2. 🛑 NEW: Add service categories */}
          <h3 style={{marginTop: '20px'}}>Services</h3>
          <li><NavLink to="/services">All Services</NavLink></li>
          {/* You can create a new 'serviceCategories' util later */}
          <li><NavLink to="/services?category=Hair">Hair</NavLink></li>
          <li><NavLink to="/services?category=Nails">Nails</NavLink></li>
          <li><NavLink to="/services?category=Makeup">Makeup</NavLink></li>
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

  // 3. 🛑 UPDATED: Add all new links for all roles
  const NavLinks = () => (
    <>
      {token && user?.role === 'client' && <Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link>}
      {token && user?.role === 'seller' && <Link to="/seller-dashboard" onClick={handleLinkClick}>Dashboard</Link>}
      {/* NEW: Provider Dashboard Link */}
      {token && user?.role === 'service_provider' && <Link to="/provider-dashboard" onClick={handleLinkClick}>Dashboard</Link>}
      
      <Link to="/products" onClick={handleLinkClick}>Products</Link>
      {/* NEW: Browse Services Link */}
      <Link to="/services" onClick={handleLinkClick}>Services</Link>
      
      {token ? (
        <>
          {/* --- SELLER LINKS --- */}
          {user?.role === 'seller' && (
            <>
              <Link to="/wallet" onClick={handleLinkClick}>My Wallet</Link>
              <Link to="/create-product" onClick={handleLinkClick}>Create Product</Link>
              <Link to="/kyc" onClick={handleLinkClick}>KYC</Link>
              <Link to="/verification" onClick={handleLinkClick}>Verification</Link>
            </>
          )}

          {/* --- NEW: SERVICE PROVIDER LINKS --- */}
          {user?.role === 'service_provider' && (
            <>
              <Link to="/provider-bookings" onClick={handleLinkClick}>My Bookings</Link>
              <Link to="/my-services" onClick={handleLinkClick}>My Services</Link>
              <Link to="/my-wallet" onClick={handleLinkClick}>My Wallet</Link>
              <Link to="/kyc" onClick={handleLinkClick}>KYC</Link>
              <Link to="/portfolio" onClick={handleLinkClick}>Portfolio</Link>
            </>
          )}
          
          {/* --- CLIENT LINKS --- */}
          {user?.role === 'client' && (
            <>
              <Link to="/orders" onClick={handleLinkClick}>My Orders</Link>
              {/* NEW: My Bookings Link */}
              <Link to="/my-bookings" onClick={handleLinkClick}>My Bookings</Link>
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
      
      {user?.role === 'client' && (
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
            placeholder="Search products & services..."
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

      {/* 4. 🛑 UPDATED: Add all new routes */}
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        
        {/* Product Marketplace */}
        <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
        <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        
        {/* NEW: Service Marketplace */}
        <Route path="/services" element={<MainLayout><ServicesPage /></MainLayout>} />
        <Route path="/services/:id" element={<MainLayout><ServiceDetailPage /></MainLayout>} />
        
        {/* Client Routes */}
        <Route path="/dashboard" element={<MainLayout><ClientDashboard /></MainLayout>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} /> 
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/my-wallet" element={<ClientWalletPage />} />
        <Route path="/my-bookings" element={<ClientBookingsPage />} />

        {/* Seller Routes */}
        <Route path="/seller-dashboard" element={<SellerOrdersPage />} /> 
        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/wallet" element={<SellerWalletPage />} />
        
        {/* NEW: Service Provider Routes */}
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/provider-bookings" element={<ProviderBookingsPage />} />
        <Route path="/my-services" element={<MyServicesPage />} />
        <Route path="/my-services/create" element={<CreateServicePage />} />
        <Route path="/my-wallet" element={<ProviderWalletPage />} />
        <Route path="/portfolio" element={<PortfolioUploadPage />} />

        {/* Shared Routes */}
        <Route path="/kyc" element={<KYCPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      
      <ChatContainer />
    </div>
  );
}

export default App;