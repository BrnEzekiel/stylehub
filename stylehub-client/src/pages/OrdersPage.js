// src/pages/OrdersPage.js
import React, { useState, useEffect } from 'react';
import { fetchClientOrders, downloadOrderReceipt } from '../api/orderService';
import { getClientBookings, cancelBooking } from '../api/serviceService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimes, faCalendarAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import Container from '../components/Container';
import Card from '../components/Card';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'orders', 'bookings'

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, bookingsData] = await Promise.all([
        fetchClientOrders(),
        getClientBookings(),
      ]);
      setOrders(ordersData || []);
      setBookings(bookingsData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Could not load your orders and bookings.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      const bookingsData = await getClientBookings();
      setBookings(bookingsData || []);
      alert('Booking cancelled successfully.');
    } catch (err) {
      alert(`Failed to cancel booking: ${err.message}`);
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'confirmed') return 'bg-green-100 text-green-800';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (s === 'cancelled' || s === 'disputed') return 'bg-red-100 text-red-800';
    if (s === 'in_progress') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const canCancelBooking = (booking) => {
    return booking?.status === 'pending' || booking?.status === 'confirmed';
  };

  if (loading) {
    return (
      <div className="page-section">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading your orders and bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-section">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const totalItems = (orders?.length || 0) + (bookings?.length || 0);
  const showOrders = activeTab === 'all' || activeTab === 'orders';
  const showBookings = activeTab === 'all' || activeTab === 'bookings';

  return (
    <div className="page-transition">
      <div className="page-section">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Orders & Bookings</h1>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">Total</div>
            <div className="font-semibold text-lg">{totalItems}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-md text-sm ${activeTab === 'all' ? 'bg-primary text-white' : 'bg-white border text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-md text-sm ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-white border text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" /> Orders ({orders?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-2 rounded-md text-sm ${activeTab === 'bookings' ? 'bg-primary text-white' : 'bg-white border text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Bookings ({bookings?.length || 0})
            </button>
          </div>
        </div>

        {/* ORDERS - Desktop Table */}
        {showOrders && orders?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Product Orders</h2>

            <div className="hidden md:block bg-white shadow-sm rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Items</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700 font-mono">{(order.id || '').slice(0,10)}…</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 font-semibold">KSh {parseFloat(order.totalAmount || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusBadge(order.status)}`}>{order.status || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDownload(order.id)}
                              disabled={downloading === order.id}
                              className="inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50"
                            >
                              <FontAwesomeIcon icon={faDownload} />
                              <span>{downloading === order.id ? 'Downloading' : 'Receipt'}</span>
                            </button>
                            <Link to={`/orders/${order.id}`} className="inline-flex items-center px-3 py-1.5 bg-primary text-white rounded text-sm">Details</Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile - cards */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-500">Order</div>
                      <div className="font-mono text-sm">{(order.id || '').slice(0,10)}…</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="font-semibold">KSh {parseFloat(order.totalAmount || 0).toFixed(2)}</div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusBadge(order.status)}`}>{order.status || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">{(order.items || []).slice(0,3).map((it, idx) => (
                    <div key={idx}>{it.product?.name || 'Item'} × {it.quantity}</div>
                  ))}</div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(order.id)}
                      disabled={downloading === order.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      <span>{downloading === order.id ? 'Downloading' : 'Receipt'}</span>
                    </button>
                    <Link to={`/orders/${order.id}`} className="inline-flex items-center px-3 py-1.5 bg-primary text-white rounded text-sm">Details</Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* BOOKINGS */}
        {showBookings && bookings?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Service Bookings</h2>

            <div className="hidden md:block bg-white shadow-sm rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Booking</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">When</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Price</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700 font-mono">{(b.id || '').slice(0,10)}…</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{b.service?.title || 'Service'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(b.startTime).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 font-semibold">KSh {parseFloat(b.price || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusBadge(b.status)}`}>{b.status || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {canCancelBooking(b) ? (
                              <button
                                onClick={() => handleCancelBooking(b.id)}
                                disabled={cancelling === b.id}
                                className="inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                                <span>{cancelling === b.id ? 'Cancelling' : 'Cancel'}</span>
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">No actions</span>
                            )}
                            <Link to={`/bookings/${b.id}`} className="inline-flex items-center px-3 py-1.5 bg-primary text-white rounded text-sm">Details</Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-4">
              {bookings.map((b) => (
                <Card key={b.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-500">Booking</div>
                      <div className="font-mono text-sm">{(b.id || '').slice(0,10)}…</div>
                      <div className="text-xs text-gray-500">{new Date(b.startTime).toLocaleString()}</div>
                      <div className="text-sm text-gray-700 mt-2">{b.service?.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="font-semibold">KSh {parseFloat(b.price || 0).toFixed(2)}</div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusBadge(b.status)}`}>{b.status || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {canCancelBooking(b) ? (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={cancelling === b.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        <span>{cancelling === b.id ? 'Cancelling' : 'Cancel'}</span>
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">No actions</span>
                    )}
                    <Link to={`/bookings/${b.id}`} className="inline-flex items-center px-3 py-1.5 bg-primary text-white rounded text-sm">Details</Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* If no orders/bookings for current tab */}
        {((!showOrders || (orders?.length || 0) === 0) && (!showBookings || (bookings?.length || 0) === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-600">No items to show in this view.</p>
            <div className="mt-4 flex justify-center gap-3">
              <Link to="/products" className="btn btn-primary">Browse Products</Link>
              <Link to="/services" className="btn btn-outline">Browse Services</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
