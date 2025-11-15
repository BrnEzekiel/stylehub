// src/pages/ClientBookingsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { FaPhone, FaMapMarkerAlt, FaMoneyBillWave, FaTimes } from 'react-icons/fa'; // Icons

function ClientBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        alert('Failed to load bookings. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['pending', 'confirmed', 'in_progress'].includes(booking.status);
    if (filter === 'completed') return booking.status === 'completed';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  // Status badge with color
  const renderStatusBadge = (status) => {
    const style = {
      borderRadius: '20px',
      padding: '4px 12px',
      fontWeight: '600',
      fontSize: '0.85em',
      textTransform: 'capitalize',
    };

    const statusMap = {
      pending: { text: 'Pending', color: '#f4d40f', bg: '#fff9db' },
      confirmed: { text: 'Confirmed', color: '#0284c7', bg: '#e0f2fe' },
      in_progress: { text: 'In Progress', color: '#8b5cf6', bg: '#f5f3ff' },
      completed: { text: 'Completed', color: '#16a34a', bg: '#dcfce7' },
      cancelled: { text: 'Cancelled', color: '#dc2626', bg: '#fee2e2' },
      disputed: { text: 'Disputed', color: '#ea580c', bg: '#ffedd5' },
    };

    const { text, color, bg } = statusMap[status] || { text: status, color: '#666', bg: '#f1f1f1' };
    return <span style={{ ...style, color, backgroundColor: bg }}>{text}</span>;
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      // Optimistic update
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) return <p className="admin-content">Loading your bookings...</p>;

  if (bookings.length === 0) {
    return (
      <div className="admin-content" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#0f35df' }}>📅</div>
        <h2>No Bookings Yet</h2>
        <p style={{ fontSize: '1.1em', color: '#555', marginBottom: '20px' }}>
          You haven’t booked any services yet.
        </p>
        <Link to="/services" style={{
          display: 'inline-block',
          padding: '10px 24px',
          backgroundColor: '#0f35df',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '1.1em'
        }}>
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Bookings</h2>
        <div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="all">All Bookings</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '800px', width: '100%' }}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Provider</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Price</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: '600' }}>{b.service?.title}</div>
                  <div style={{ fontSize: '0.85em', color: '#666' }}>
                    #{b.id.substring(0, 8)}
                  </div>
                </td>
                <td>
                  <div>{b.provider?.name || '—'}</div>
                  <div style={{ fontSize: '0.9em', color: '#555' }}>
                    <FaPhone size={12} style={{ marginRight: '4px' }} />
                    Contact
                  </div>
                </td>
                <td>
                  {new Date(b.startTime).toLocaleDateString()}<br />
                  <strong>{new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </td>
                <td>
                  <FaMapMarkerAlt size={12} style={{ marginRight: '4px' }} />
                  {b.isHomeService ? 'At Home' : 'At Shop'}
                </td>
                <td>
                  <strong>Ksh {parseFloat(b.price).toFixed(2)}</strong>
                </td>
                <td>
                  <FaMoneyBillWave size={12} style={{ marginRight: '4px' }} />
                  {b.paymentMethod?.replace('_', ' ') || '—'}
                </td>
                <td>{renderStatusBadge(b.status)}</td>
                <td>
                  {['pending', 'confirmed'].includes(b.status) && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '0.85em'
                      }}
                    >
                      <FaTimes size={10} style={{ marginRight: '4px' }} />
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientBookingsPage;