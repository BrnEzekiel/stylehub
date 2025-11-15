// src/pages/SellerOrdersPage.js

import React, { useState, useEffect } from 'react';
// 1. 🛑 Import from new orderService
import { fetchSellerOrders, downloadOrderReceipt, updateSellerOrderStatus } from '../api/orderService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Container from '../components/Container';
import Card from '../components/Card';
import { useSocket } from '../context/SocketContext';

function SellerOrdersPage() {
  const [data, setData] = useState({ orders: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  
  const { token, user } = useAuth();
  const { openChatWithUser } = useSocket();
  const navigate = useNavigate();

  const loadSellerData = async () => {
    try {
      setLoading(true);
      const sellerData = await fetchSellerOrders(); // 2. 🛑 Use new function
      setData(sellerData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Could not load seller dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'seller') {
      navigate('/login');
      return;
    }
    loadSellerData();
  }, [token, user, navigate]);

  const handleDownload = async (orderId) => {
    setDownloading(orderId);
    try {
      await downloadOrderReceipt(orderId);
    } catch (err) {
      alert(`Failed to download receipt: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleChatClick = (customer) => {
    if (!customer || !customer.id) {
      alert("Cannot chat: Customer ID is missing.");
      return;
    }
    openChatWithUser(customer.id, customer.name);
  };

  // 3. 🛑 NEW: Handler for seller to update status
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (newStatus === "") return; // Ignore default
    
    try {
      await updateSellerOrderStatus(orderId, newStatus);
      // Refresh the list to show the change
      loadSellerData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading your dashboard...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;

  const { orders, summary } = data;

  return (
    <div className="admin-content" style={{ backgroundColor: '#f9f9f9' }}>
      <h1>📈 Seller Dashboard</h1>
      
      {summary && (
        <div className="stats-grid">
          <StatCard 
            title="Total Revenue (from delivered orders)" 
            value={`Ksh ${parseFloat(summary.totalRevenue).toFixed(2)}`}
            icon="💰"
          />
          <StatCard 
            title="Total Orders" 
            value={summary.totalOrders}
            icon="📦"
          />
          <StatCard 
            title="Pending Orders (paid, not shipped)" 
            value={summary.pendingOrders}
            icon="⏳"
            className="pending"
          />
        </div>
      )}
      
      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <h2>Incoming Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Your Items</th>
              <th>Your Earning</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              // 4. 🛑 Calculate seller's earning for this order
              const sellerEarning = order.items.reduce((acc, item) => 
                acc + (parseFloat(item.sellerEarning) * item.quantity), 0).toFixed(2);
              
              // 5. 🛑 Determine what actions are available
              const canBeShipped = order.status === 'paid';
              
              return (
                <tr key={order.id}>
                  <td>{order.id.substring(0, 8)}...</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>{order.items.length}</td>
                  <td>Ksh {sellerEarning}</td>
                  <td style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => handleDownload(order.id)}
                      disabled={downloading === order.id}
                      style={{ fontSize: '0.9em', padding: '5px 10px', background: 'var(--color-primary)' }}
                    >
                      {downloading === order.id ? '...' : 'Receipt'}
                    </button>
                    <button
                      onClick={() => handleChatClick(order.user)}
                      disabled={!order.user}
                      style={{ fontSize: '0.9em', padding: '5px 10px', background: '#28a745' }}
                    >
                      Chat
                    </button>
                    {/* 6. 🛑 NEW: Mark as Shipped Button */}
                    {canBeShipped && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'shipped')}
                        style={{ fontSize: '0.9em', padding: '5px 10px', background: 'var(--color-accent)', color: '#333' }}
                      >
                        Mark as Shipped
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default SellerOrdersPage;