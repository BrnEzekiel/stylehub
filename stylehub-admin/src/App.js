// src/App.js
import React from 'react';
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import PortfolioManagementPage from './pages/PortfolioManagementPage';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import KycDashboard from './pages/KycDashboard';
import UserManagement from './pages/UserManagement';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import AdminOrderDetail from './pages/AdminOrderDetail';
import EditUserPage from './pages/EditUserPage';
import EditProductPage from './pages/EditProductPage';
import CreateUserPage from './pages/CreateUserPage';
import AdminCreateProduct from './pages/AdminCreateProduct';
import FinancialsPage from './pages/FinancialsPage';
import VerificationAdminPage from './pages/VerificationAdminPage';
import WithdrawalRequestsPage from './pages/WithdrawalRequestsPage'; // 1. 🛑 Import
import './App.css';

// --- Admin Layout ---
function AdminLayout({ onLogout }) {
  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <ul className="sidebar-nav">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/financials">Financials</Link>
          </li>
          {/* 2. 🛑 Add new link */}
          <li>
            <Link to="/withdrawal-requests">Withdrawal Requests</Link>
          </li>
          <li>
            <Link to="/kyc-dashboard">KYC Management</Link>
          </li>
          <li>
            <Link to="/seller-verification">Seller Verification</Link>
          </li>
          <li>
            <Link to="/portfolio-management">Provider Portfolios</Link>
          </li>
          <li>
            <Link to="/user-management">User Management</Link>
          </li>
          <li>
            <Link to="/product-management">Product Management</Link>
          </li>
          <li>
            <Link to="/order-management">Order Management</Link>
          </li>
        </ul>
      </aside>
      {/* Main Content */}
      <main className="admin-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/financials" element={<FinancialsPage />} />
          <Route path="/withdrawal-requests" element={<WithdrawalRequestsPage />} /> {/* 3. 🛑 Add route */}
          <Route path="/kyc-dashboard" element={<KycDashboard />} />
          <Route path="/seller-verification" element={<VerificationAdminPage />} />
          <Route path="/portfolio-management" element={<PortfolioManagementPage />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/order-management" element={<OrderManagement />} />
          <Route path="/order/:id" element={<AdminOrderDetail />} />
          {/* User Routes */}
          <Route path="/user/:id/edit" element={<EditUserPage />} />
          <Route path="/user/create" element={<CreateUserPage />} />
          {/* Product Routes */}
          <Route path="/product/:id/edit" element={<EditProductPage />} />
          <Route path="/product/create" element={<AdminCreateProduct />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

// --- Main Auth Logic ---
function AppContent() {
  const { token, user, logout } = useAuth();
  const location = useLocation();

  if (!token || user?.role !== 'admin') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="*"
          element={<Navigate to="/login" state={{ from: location }} replace />}
        />
      </Routes>
    );
  }

  return (
    <div className="App">
      <nav className="top-nav">
        <Link to="/dashboard" className="top-nav-logo">
          <img src="/logo192.png" alt="StyleHub Admin" style={{ height: '60px' }} />
        </Link>
        <button onClick={logout} className="top-nav-logout">
          Logout
        </button>
      </nav>
      <AdminLayout onLogout={logout} />
    </div>
  );
}

// --- Main App Wrapper ---
function App() {
  return <AppContent />;
}

export default App;