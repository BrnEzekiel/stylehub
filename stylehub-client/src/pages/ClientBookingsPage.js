// src/pages/ClientBookingsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ClientBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // src/pages/ClientBookingsPage.js
useEffect(() => {
  const load = async () => {
    try {
      const res = await fetch('/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });

      // 🔥 Detect HTML error page
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok) setBookings(data);
        else throw new Error(data.message || 'Failed to load bookings');
      } else {
        // Server returned HTML (e.g., 403, 500 page)
        const text = await res.text();
        console.error("Server returned HTML:", text.substring(0, 200));
        throw new Error("Server error: Please check your login status.");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);

  if (loading) return <p className="admin-content">Loading your bookings...</p>;

  return (
    <div className="admin-content">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>You haven’t booked any services yet. <Link to="/services">Browse services</Link></p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Service</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.provider?.name || '—'}</td>
                <td>{b.service?.title}</td>
                <td>{new Date(b.startTime).toLocaleString()}</td>
                <td>Ksh {parseFloat(b.price).toFixed(2)}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClientBookingsPage;