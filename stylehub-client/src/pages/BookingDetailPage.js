import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTimes, faCheck, faClock } from '@fortawesome/free-solid-svg-icons';
import { getClientBookings, cancelBooking } from '../api/serviceService';
import Card from '../components/Card';

function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        const bookings = await getClientBookings();
        const foundBooking = bookings?.find((b) => b.id === id);
        if (!foundBooking) {
          setError('Booking not found');
        } else {
          setBooking(foundBooking);
        }
      } catch (err) {
        setError(err.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await cancelBooking(id);
      alert('Booking cancelled successfully.');
      navigate('/orders');
    } catch (err) {
      alert(`Failed to cancel booking: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'confirmed') return <FontAwesomeIcon icon={faCheck} className="text-green-600" />;
    if (s === 'pending') return <FontAwesomeIcon icon={faClock} className="text-yellow-600" />;
    if (s === 'cancelled') return <FontAwesomeIcon icon={faTimes} className="text-red-600" />;
    return null;
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'confirmed') return 'bg-green-100 text-green-800';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (s === 'cancelled') return 'bg-red-100 text-red-800';
    if (s === 'in_progress') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const canCancelBooking = (b) => {
    return b?.status === 'pending' || b?.status === 'confirmed';
  };

  if (loading) {
    return (
      <div className="page-section">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-section">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-primary hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="page-section">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-primary hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <p className="text-gray-600">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="page-section">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-primary hover:underline">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Bookings
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Booking Info */}
        <div className="md:col-span-2">
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{booking.service?.title || 'Service Booking'}</h1>
                <p className="text-gray-500 font-mono text-sm mt-1">{booking.id}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-md ${getStatusBadge(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="font-semibold">{booking.status || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div>
                <div className="text-xs text-gray-500 uppercase">Booking Date</div>
                <div className="text-sm font-medium">{new Date(booking.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Service Date</div>
                <div className="text-sm font-medium">{new Date(booking.startTime).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Time</div>
                <div className="text-sm font-medium">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </Card>

          {/* Service Details */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Service Details</h2>

            {booking.service?.imageUrl && (
              <img src={booking.service.imageUrl} alt={booking.service.title} className="w-full h-64 object-cover rounded-md mb-4" />
            )}

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 uppercase">Description</div>
                <div className="text-gray-700 mt-1">{booking.service?.description || 'No description'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 uppercase">Provider</div>
                  <div className="text-gray-700 font-medium mt-1">{booking.provider?.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 uppercase">Duration</div>
                  <div className="text-gray-700 font-medium mt-1">{booking.duration || 'N/A'} hours</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Price Breakdown */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Price Breakdown</h2>
            <div className="space-y-2">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Service Price</span>
                <span>KSh {parseFloat(booking.price || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t text-gray-900 font-semibold text-lg">
                <span>Total</span>
                <span>KSh {parseFloat(booking.price || 0).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - Actions & Info */}
        <div>
          <Card className="p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Actions</h2>

            {canCancelBooking(booking) && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full btn btn-outline mb-3 border-red-300 text-red-600"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}

            <button
              onClick={() => navigate('/orders')}
              className="w-full btn btn-primary"
            >
              Back to Bookings
            </button>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t space-y-4">
              {booking.notes && (
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Notes</div>
                  <div className="text-sm text-gray-700">{booking.notes}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">Booked On</div>
                <div className="text-sm text-gray-700">{new Date(booking.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailPage;
