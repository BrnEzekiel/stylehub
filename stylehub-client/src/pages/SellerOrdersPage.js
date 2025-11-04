// src/pages/SellerOrdersPage.js

import React, { useState, useEffect } from 'react';
import { fetchAllOrders, downloadOrderReceipt } from '../api/orderService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext'; // 1. 🛑 Import useSocket

function SellerOrdersPage() {
  const [data, setData] = useState({ orders: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  
  const { token, user } = useAuth();
  const { openChatWithUser } = useSocket(); // 2. 🛑 Get the chat function
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== 'seller') {
      navigate('/login');
      return;
    }
    
    const loadSellerData = async () => {
      try {
        setLoading(true);
        const sellerData = await fetchAllOrders(); 
        setData(sellerData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Could not load seller dashboard.');
      } finally {
        setLoading(false);
      }
    };
    
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

  // 3. 🛑 Handler to start chat with a customer
  const handleChatClick = (customer) => {
    if (!customer || !customer.id) {
      alert("Cannot chat: Customer ID is missing.");
      return;
    }
    openChatWithUser(customer.id, customer.name);
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading your dashboard...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;

  const { orders, summary } = data;

  return (
    <div className="admin-content" style={{ backgroundColor: '#f9f9f9' }}>
      <h1>📈 Seller Dashboard</h1>
      
      {summary && (
        <div className="stats-grid">
          {/* ... (StatCards are unchanged) ... */}
          <StatCard 
            title="Total Revenue" 
            value={`Ksh ${parseFloat(summary.totalRevenue).toFixed(2)}`}
            icon="💰"
          />
          <StatCard 
            title="Total Orders" 
            value={summary.totalOrders}
            icon="📦"
          />
          <StatCard 
            title="Pending Orders" 
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
              <th>Subtotal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.substring(0, 8)}...</td>
                {/* 4. 🛑 Make sure order.user is not null */}
                <td>{order.user?.name || 'N/A'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>{order.items.length}</td>
                <td>
                  Ksh {order.items.reduce((acc, item) => 
                    acc + (parseFloat(item.unitPrice) * item.quantity), 0).toFixed(2)
                  }
                </td>
                <td style={{ display: 'flex', gap: '5px' }}>
                  {/* --- Download Button --- */}
                  <button
                    onClick={() => handleDownload(order.id)}
                    disabled={downloading === order.id}
                    style={{ fontSize: '0.9em', padding: '5px 10px', background: 'var(--color-primary)' }}
                  >
                    {downloading === order.id ? '...' : 'Receipt'}
                  </button>
                  {/* 5. 🛑 New Chat Button */}
                  <button
                    onClick={() => handleChatClick(order.user)}
                    disabled={!order.user}
                    style={{ fontSize: '0.9em', padding: '5px 10px', background: '#28a745' }}
                  >
                    Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ... (StatCard component is unchanged) ...
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