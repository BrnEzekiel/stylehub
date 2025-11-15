import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload, faCheck, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchClientOrders, downloadOrderReceipt } from '../api/orderService';
import Container from '../components/Container';
import Card from '../components/Card';

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const orders = await fetchClientOrders();
        const foundOrder = orders?.find((o) => o.id === id);
        if (!foundOrder) {
          setError('Order not found');
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadOrderReceipt(id);
    } catch (err) {
      alert(`Failed to download receipt: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return <FontAwesomeIcon icon={faCheck} className="text-green-600" />;
    if (s === 'pending') return <FontAwesomeIcon icon={faClock} className="text-yellow-600" />;
    if (s === 'cancelled') return <FontAwesomeIcon icon={faTimes} className="text-red-600" />;
    return null;
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return 'bg-green-100 text-green-800';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (s === 'cancelled') return 'bg-red-100 text-red-800';
    if (s === 'in_progress') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="page-section">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading order details...</p>
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

  if (!order) {
    return (
      <div className="page-section">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-primary hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="page-section">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-primary hover:underline">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Orders
      </button>

      {/* Grid layout: sidebar on right for desktop, below for mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Info - Takes 2 cols on desktop, 1 on mobile */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                <p className="text-gray-500 font-mono text-sm mt-1">{order.id}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-md ${getStatusBadge(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-semibold">{order.status || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div>
                <div className="text-xs text-gray-500 uppercase">Order Date</div>
                <div className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Total Amount</div>
                <div className="text-sm font-semibold">KSh {parseFloat(order.totalAmount || 0).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Items</div>
                <div className="text-sm font-medium">{(order.items || []).length}</div>
              </div>
            </div>
          </Card>

          {/* Items List */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-4">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.product?.name || 'Product'}</div>
                    <div className="text-sm text-gray-500">{item.product?.description?.slice(0, 100)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Qty: <span className="font-semibold">{item.quantity}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Price: <span className="font-semibold">KSh {parseFloat(item.price || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800 mt-1">
                      KSh {(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-end">
                <div className="w-full md:w-64">
                  <div className="flex justify-between py-2 text-gray-600">
                    <span>Subtotal</span>
                    <span>KSh {parseFloat(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-gray-600 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">KSh {parseFloat(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - Actions & Info (Appears below on mobile, right on desktop) */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky lg:top-20">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Actions</h2>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full btn btn-primary mb-3"
              style={{
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              {downloading ? 'Downloading...' : 'Download Receipt'}
            </button>

            <button
              onClick={() => navigate('/orders')}
              className="w-full btn btn-outline"
            >
              Back to Orders
            </button>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">Shipping Address</div>
                <div className="text-sm text-gray-700">{order.shippingAddress || 'Not provided'}</div>
              </div>
              {order.trackingNumber && (
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Tracking Number</div>
                  <div className="text-sm font-mono text-gray-700">{order.trackingNumber}</div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
