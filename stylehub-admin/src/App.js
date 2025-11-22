import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import KycDashboard from './pages/KycDashboard';
import UserManagement from './pages/UserManagement';
import ProductManagement from './pages/ProductManagement';
import ServiceManagement from './pages/ServiceManagement';
import StaysManagement from './pages/StaysManagement';
import CommunityManagement from './pages/CommunityManagement';
import OrderManagement from './pages/OrderManagement';
import AdminOrderDetail from './pages/AdminOrderDetail';
import EditUserPage from './pages/EditUserPage';
import EditProductPage from './pages/EditProductPage';
import CreateUserPage from './pages/CreateUserPage';
import AdminCreateProduct from './pages/AdminCreateProduct';
import AdminCreateService from './pages/AdminCreateService';
import AdminCreateStay from './pages/AdminCreateStay';
import EditServicePage from './pages/EditServicePage';
import EditStayPage from './pages/EditStayPage';
import EditCommunityPostPage from './pages/EditCommunityPostPage';
import FinancialsPage from './pages/FinancialsPage';
import VerificationAdminPage from './pages/VerificationAdminPage';
import WithdrawalRequestsPage from './pages/WithdrawalRequestsPage';
import PortfolioManagementPage from './pages/PortfolioManagementPage';
import AdminCreateCommunityPost from './pages/AdminCreateCommunityPost';

function AppContent() {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token || user?.role !== 'admin') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="*"
          element={<Navigate to="/login" state={{ from: location }} replace />}
        />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/services" element={<ServiceManagement />} />
        <Route path="/stays" element={<StaysManagement />} />
        <Route path="/community" element={<CommunityManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/financials" element={<FinancialsPage />} />
        <Route path="/kyc" element={<KycDashboard />} />
        <Route path="/portfolios"
          element={<PortfolioManagementPage />}
        />
        <Route path="/verifications"
          element={<VerificationAdminPage />}
        />
        <Route path="/withdrawals"
          element={<WithdrawalRequestsPage />}
        />
        <Route path="/order/:id" element={<AdminOrderDetail />} />
        <Route path="/user/:id/edit" element={<EditUserPage />} />
        <Route path="/user/create" element={<CreateUserPage />} />
        <Route path="/product/:id/edit" element={<EditProductPage />} />
        <Route path="/product/create" element={<AdminCreateProduct />} />
        <Route path="/service/:id/edit" element={<EditServicePage />} />
        <Route path="/service/create" element={<AdminCreateService />} />
        <Route path="/stay/:id/edit" element={<EditStayPage />} />
        <Route path="/stay/create" element={<AdminCreateStay />} />
        <Route path="/community/:id/edit" element={<EditCommunityPostPage />} />
        <Route path="/community/create" element={<AdminCreateCommunityPost />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return <AppContent />;
}

export default App;