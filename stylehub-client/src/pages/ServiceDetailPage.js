// src/pages/ServiceDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, createBooking } from '../api/serviceService'; // ✅ Will work once serviceService.js exists
import { useAuth } from '../context/AuthContext';

function ServiceDetailPage() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [isHome, setIsHome] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const data = await getServiceById(id);
        setService(data);
        setError(null);
      } catch (err) {
        setError('Service not found.');
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [id]);

  const handleBook = async () => {
    if (!token) return navigate('/login');
    if (!bookingDate) return alert('Please select a date and time.');

    try {
      await createBooking({
        serviceId: id,
        startTime: bookingDate,
        isHomeService: isHome,
      });
      setBookingMessage('Booking request sent! Check your bookings page.');
    } catch (err) {
      setBookingMessage(err.message || 'Failed to book.');
    }
  };

  if (loading) return <p className="admin-content">Loading service...</p>;
  if (error) return <p className="admin-content" style={{ color: 'red' }}>{error}</p>;
  if (!service) return null;

  const price = isHome ? service.priceHomeCents : service.priceShopCents;
  const canBookHome = service.offersHome && service.priceHomeCents;

  return (
    <div className="product-detail-container">
      <div className="product-detail-layout">
        <div>
          <img src={service.imageUrl} alt={service.title} className="product-detail-image" />
        </div>
        <div className="product-detail-info">
          <h1>{service.title}</h1>
          {service.provider?.verificationStatus === 'approved' && (
            <div className="verified-seller-badge">✅ Verified Provider</div>
          )}
          <p className="price">Ksh {parseFloat(price).toFixed(2)}</p>
          <p>{service.description}</p>
          <p><strong>Duration:</strong> {service.durationMinutes} minutes</p>
          {canBookHome && (
            <label>
              <input
                type="checkbox"
                checked={isHome}
                onChange={(e) => setIsHome(e.target.checked)}
              /> Book at home
            </label>
          )}

          <div className="action-box">
            <label>Preferred Date & Time:</label>
            <input
              type="datetime-local"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <button onClick={handleBook} disabled={!bookingDate}>
              Book Now
            </button>
            {bookingMessage && (
              <p style={{ color: bookingMessage.includes('sent') ? 'green' : 'red', marginTop: '10px' }}>
                {bookingMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailPage;