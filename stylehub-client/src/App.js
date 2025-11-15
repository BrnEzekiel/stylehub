// src/App.js

import React from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css'; 
import { useAuth } from './context/AuthContext';
import ChatContainer from './components/Chat';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';

// Import Pages
import ClientWalletPage from './pages/ClientWalletPage';
import ProviderWalletPage from './pages/ProviderWalletPage';
import Home from './pages/Home';
import ClientDashboard from './pages/ClientDashboard';
import Products from './pages/Products';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import CreateProductPage from './pages/CreateProductPage';
import ProductDetailPage from './pages/ProductDetailPage'; 
import CartPage from './pages/CartPage'; 
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import BookingDetailPage from './pages/BookingDetailPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import SearchPage from './pages/SearchPage';
import KYCPage from './pages/KYCPage';
import VerificationPage from './pages/VerificationPage';
import WishlistPage from './pages/WishlistPage';
import SellerWalletPage from './pages/SellerWalletPage';
import StyleDIYPage from './pages/StyleDIYPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import PortfolioUploadPage from './pages/PortfolioUploadPage';
import Marketplace from './pages/Marketplace';
import ProviderDashboard from './pages/ProviderDashboard';
import MyServicesPage from './pages/MyServicesPage';
import CreateServicePage from './pages/CreateServicePage';
import ProviderBookingsPage from './pages/ProviderBookingsPage';
import ClientBookingsPage from './pages/ClientBookingsPage';
import { getAllAvailableCategories } from './api/categoryService';

// --- Reusable Layout Component ---
function MainLayout({ children }) {
  const [productCategories, setProductCategories] = React.useState([]);
  const [serviceCategories, setServiceCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getAllAvailableCategories();
        setProductCategories(data.products || []);
        setServiceCategories(data.services || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setProductCategories([]);
        setServiceCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="admin-layout"> 
      <aside className="sidebar">
        <h3>Categories</h3>
        <ul className="sidebar-nav">
          <li><NavLink to="/products">All Products</NavLink></li>
          {productCategories.map((category) => (
            <li key={`prod-${category}`}>
              <NavLink to={`/products?category=${category}`}>
                {category}
              </NavLink>
            </li>
          ))}
          
          {serviceCategories.length > 0 && (
            <>
              <h3 style={{marginTop: '20px'}}>Services</h3>
              <li><NavLink to="/services">All Services</NavLink></li>
              {serviceCategories.map((category) => (
                <li key={`svc-${category}`}>
                  <NavLink to={`/services?category=${category}`}>
                    {category}
                  </NavLink>
                </li>
              ))}
            </>
          )}
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
  const { token, user } = useAuth();

  return (
    <div className="App-Layout">
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        
        {/* Product Marketplace */}
        <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
        <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        
        {/* Service Marketplace */}
        <Route path="/services" element={<MainLayout><ServicesPage /></MainLayout>} />
        <Route path="/services/:id" element={<MainLayout><ServiceDetailPage /></MainLayout>} />
        
        {/* Client Routes */}
        <Route path="/dashboard" element={<MainLayout><ClientDashboard /></MainLayout>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/bookings/:id" element={<BookingDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/my-wallet" element={<ClientWalletPage />} />
        <Route path="/my-bookings" element={<ClientBookingsPage />} />

        {/* Seller Routes */}
        <Route path="/seller-dashboard" element={<SellerOrdersPage />} /> 
        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/wallet" element={<SellerWalletPage />} />
        
        {/* Service Provider Routes */}
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/provider-bookings" element={<ProviderBookingsPage />} />
        <Route path="/my-services" element={<MyServicesPage />} />
        <Route path="/my-services/create" element={<CreateServicePage />} />
        <Route path="/my-wallet" element={<ProviderWalletPage />} />
        <Route path="/portfolio" element={<PortfolioUploadPage />} />

        {/* Style DIY */}
        <Route path="/style-diy" element={<MainLayout><StyleDIYPage /></MainLayout>} />
        {/* Combined Marketplace */}
        <Route path="/marketplace" element={<MainLayout><Marketplace /></MainLayout>} />

        {/* Shared Routes */}
        <Route path="/kyc" element={<KYCPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      
      <ChatContainer />
      <BottomNav />
    </div>
  );
}

export default App;