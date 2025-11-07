// src/pages/ProviderDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

function ProviderDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Service Provider Dashboard</h1>
      <div className="stats-grid">
        <StatCard title="My Services" icon="💇‍♀️" linkTo="/my-services" />
        <StatCard title="My Bookings" icon="📅" linkTo="/provider-bookings" />
        <StatCard title="Portfolio Status" icon="📁" linkTo="/portfolio" />
      </div>
      <p style={{ marginTop: '30px', textAlign: 'center', color: '#555' }}>
        Manage your services, bookings, and profile from here.
      </p>
    </div>
  );
}

function StatCard({ title, icon, linkTo }) {
  return (
    <Link to={linkTo} style={{ textDecoration: 'none' }}>
      <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
          <p style={{ fontSize: '1.2em', margin: 0, color: '#0f35df' }}>{title}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProviderDashboard;