// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getRecentOrders, getPendingSubmissions, getAllUsers } from '../api/adminService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- 1. 🛑 NEW: Helper function to format currency (Ksh 1.3M) ---
function formatCurrency(num) {
  const number = parseFloat(num);
  if (isNaN(number)) return 'Ksh 0.00';
  
  if (number < 1000) {
    return `Ksh ${number.toFixed(2)}`;
  } else if (number < 1000000) {
    return `Ksh ${(number / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  } else if (number < 1000000000) {
    return `Ksh ${(number / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  } else {
    return `Ksh ${(number / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
  }
}

// --- 2. 🛑 NEW: Helper function to format simple counts (1.3M) ---
function formatCount(num) {
  if (num === null || num === undefined) return '0';
  const number = parseInt(num);
  if (number < 1000) return number.toString();
  if (number < 1000000) return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (number < 1000000000) return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
}


// --- Main Dashboard Component ---

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, ordersData, usersData, kycData] = await Promise.all([
          getAdminStats(),
          getRecentOrders(),
          getAllUsers(),
          getPendingSubmissions(),
        ]);
        
        setStats({
          ...statsData,
          pendingKYC: kycData.length 
        });
        setRecentOrders(ordersData.slice(0, 5));
        setNewUsers(usersData.slice(0, 5));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading Admin Command Center...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!stats) return <p>No stats found.</p>;

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      {/* --- 3. 🛑 KPI Stat Cards (using new formatters) --- */}
      <div className="stats-grid">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon="💰"
        />
        <StatCard
          title="Total Users"
          value={formatCount(stats.totalUsers)}
          icon="👥"
          linkTo="/user-management"
        />
        <StatCard
          title="Total Products"
          value={formatCount(stats.totalProducts)}
          icon="📦"
          linkTo="/product-management"
        />
        <StatCard
          title="Pending KYC"
          value={formatCount(stats.pendingKYC)}
          icon="⏳"
          className="pending"
          linkTo="/kyc-dashboard"
        />
      </div>

      {/* --- Main Content Grid (Charts & Lists) --- */}
      <div className="dashboard-grid-large">
        <div className="dashboard-card chart">
          <h3>Sales Overview (Mock Data)</h3>
          <p>This chart shows revenue over the last 7 days. (This is a mock-up. The API needs a new endpoint for real data).</p>
          <SalesChart />
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="activity-feed">
            {/* Recent Orders List */}
            <div className="activity-section">
              <h4>Recent Orders</h4>
              <ul className="activity-list">
                {recentOrders.map(order => (
                  <li key={order.id} className="activity-item">
                    <div>
                      <strong>{order.user?.name || 'Customer'}</strong> just placed an order.
                      <span className="activity-value">Ksh {parseFloat(order.totalAmount).toFixed(2)}</span>
                    </div>
                    <Link to={`/order/${order.id}`} className="activity-link">View</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* New Users List */}
            <div className="activity-section">
              <h4>New Users</h4>
              <ul className="activity-list">
                {newUsers.map(user => (
                  <li key={user.id} className="activity-item">
                    <div>
                      <strong>{user.name}</strong> just joined as a {user.role}.
                      <span className="activity-value">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link to={`/user/${user.id}/edit`} className="activity-link">View</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Reusable Stat Card Component ---

function StatCard({ title, value, icon, className = '', linkTo = null }) {
  // 4. 🛑 Simplified h3 style, word-break handles overflow
  const content = (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p>{title}</p>
        <h3 style={{ wordBreak: 'break-all' }}>
          {value}
        </h3>
      </div>
    </div>
  );
  
  return linkTo ? <Link to={linkTo} style={{ textDecoration: 'none' }}>{content}</Link> : content;
}


// --- Mock Sales Chart Component ---

function SalesChart() {
  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Revenue (Ksh)',
        data: [12000, 19000, 15000, 25000, 22000, 31000, 45000], // Mock data
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return <div style={{ height: '300px' }}><Line data={data} options={options} /></div>;
}

export default Dashboard;