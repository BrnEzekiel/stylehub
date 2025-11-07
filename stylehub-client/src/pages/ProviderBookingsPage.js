// src/pages/ProviderBookingsPage.js
import React, { useState, useEffect } from 'react';
import { getMyProviderBookings, updateBookingStatus } from '../api/serviceService'; // ✅ Will work once serviceService.js exists

function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyProviderBookings();
        setBookings(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="admin-content">Loading bookings...</p>;

  return (
    <div className="admin-content">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.client?.name || '—'}</td>
                <td>{b.service?.title}</td>
                <td>{new Date(b.startTime).toLocaleString()}</td>
                <td>Ksh {parseFloat(b.price).toFixed(2)}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatusChange(b.id, 'confirmed')} style={{ marginRight: '5px' }}>Confirm</button>
                      <button onClick={() => handleStatusChange(b.id, 'cancelled')} style={{ background: '#dc3545' }}>Cancel</button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => handleStatusChange(b.id, 'completed')} style={{ background: '#28a745' }}>Mark Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProviderBookingsPage;