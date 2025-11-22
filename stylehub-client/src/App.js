import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';

// Import all your page components
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetailPage from './pages/ProductDetailPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import Marketplace from './pages/Marketplace';
import CartPage from './pages/CartPage';
import ClientDashboard from './pages/ClientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import BookingDetailPage from './pages/BookingDetailPage';
import ClientBookingsPage from './pages/ClientBookingsPage';
import ClientWalletPage from './pages/ClientWalletPage';
import CommunityPage from './pages/CommunityPage';
import CreateProductPage from './pages/CreateProductPage';
import CreateServicePage from './pages/CreateServicePage';
import KYCPage from './pages/KYCPage';
import MyServicesPage from './pages/MyServicesPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrdersPage from './pages/OrdersPage';
import PortfolioUploadPage from './pages/PortfolioUploadPage';
import PostCommentsPage from './pages/PostCommentsPage';
import ProviderBookingsPage from './pages/ProviderBookingsPage';
import ProviderWalletPage from './pages/ProviderWalletPage';
import SearchPage from './pages/SearchPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import SellerVerificationSubmissionPage from './pages/SellerVerificationSubmissionPage';
import SellerWalletPage from './pages/SellerWalletPage';
import SellerDashboard from './pages/SellerDashboard'; // Import SellerDashboard
import EditProductPage from './pages/EditProductPage'; // Import EditProductPage
import StayDetailPage from './pages/StayDetailPage';
import StaysListingPage from './pages/StaysListingPage';
import StyleDIYPage from './pages/StyleDIYPage';
import VerificationHub from './pages/VerificationHub';
import WishlistPage from './pages/WishlistPage';

const AppContent = () => {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register']; // Removed /login and /register from here

  return (
    <>
      {noLayoutRoutes.includes(location.pathname) ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route path="/dashboard/provider" element={<ProviderDashboard />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/client/bookings" element={<ClientBookingsPage />} />
            <Route path="/client/wallet" element={<ClientWalletPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/create-product" element={<CreateProductPage />} />
            <Route path="/create-service" element={<CreateServicePage />} />
            <Route path="/kyc" element={<KYCPage />} />
            <Route path="/my-services" element={<MyServicesPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/portfolio-upload" element={<PortfolioUploadPage />} />
            <Route path="/posts/:id/comments" element={<PostCommentsPage />} />
            <Route path="/provider/bookings" element={<ProviderBookingsPage />} />
            <Route path="/provider/wallet" element={<ProviderWalletPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller-verification-submit" element={<SellerVerificationSubmissionPage />} />
            <Route path="/seller/wallet" element={<SellerWalletPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} /> {/* New route for editing products */}
            <Route path="/stays/:id" element={<StayDetailPage />} />
            <Route path="/stays" element={<StaysListingPage />} />
            <Route path="/style-diy" element={<StyleDIYPage />} />
            <Route path="/verification-hub" element={<VerificationHub />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Layout>
      )}
    </>
  );
};

const App = () => {
  return (
    <AppContent />
  );
};

export default App;