// src/pages/ClientDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchClientOrders } from '../api/orderService'; // ✅ FIXED
import { Link } from 'react-router-dom';

function ClientDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          const ordersData = await fetchClientOrders(); // ✅ FIXED
          setOrders(ordersData.slice(0, 3));
        } catch (error) {
          console.error("Failed to fetch recent orders:", error);
        }
        setLoading(false);
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return null; 
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name}!</h1>
      <p>Here's a quick overview of your account.</p>

      <div className="stats-grid">
        <StatCard title="Go Shopping" icon="🛍️" linkTo="/products" />
        <StatCard title="View Your Cart" icon="🛒" linkTo="/cart" />
        <StatCard title="Order History" icon="🧾" linkTo="/orders" />
        <StatCard title="My Bookings" icon="📅" linkTo="/my-bookings" />
      </div>
      
      <div className="dashboard-grid-large" style={{ gridTemplateColumns: '1fr' }}>
        <div className="dashboard-card">
          <h3>Your Recent Orders</h3>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id.substring(0, 8)}...</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>Ksh {parseFloat(order.totalAmount).toFixed(2)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, icon, linkTo }) {
  const content = (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>{icon}</div>
      <div className="stat-info">
        <p style={{ fontSize: '1.2em', margin: 0, color: '#0f35df' }}>{title}</p>
      </div>
    </div>
  );
  return <Link to={linkTo} style={{ textDecoration: 'none' }}>{content}</Link>;
}

export default ClientDashboard;