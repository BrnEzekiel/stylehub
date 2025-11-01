// src/App.js

import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import KycDashboard from './pages/KycDashboard';
import UserManagement from './pages/UserManagement';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement'; // 1. Import OrderManagement
import './App.css';

// Admin layout component
function AdminLayout({ onLogout }) {
  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <ul className="sidebar-nav">
          <li>
            <Link to="/kyc-dashboard">KYC Management</Link>
          </li>
          <li>
            <Link to="/user-management">User Management</Link>
          </li>
          <li>
            <Link to="/product-management">Product Management</Link>
          </li>
          <li>
            {/* 2. Add new link */}
            <Link to="/order-management">Order Management</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <Routes>
          <Route path="/kyc-dashboard" element={<KycDashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/product-management" element={<ProductManagement />} />
          {/* 3. Add new route */}
          <Route path="/order-management" element={<OrderManagement />} />
          <Route path="/" element={<Navigate to="/kyc-dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const { token, user, logout } = useAuth();
  const location = useLocation();

  if (!token || user?.role !== 'admin') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" state={{ from: location }} replace />} />
      </Routes>
    );
  }

  return (
    <div className="App">
      <nav className="top-nav">
        <h2>StyleHub Admin</h2>
        <button onClick={logout} className="top-nav-logout">
          Logout
        </button>
      </nav>
      
      <AdminLayout onLogout={logout} />
    </div>
  );
}

export default App;