
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAdminOrderDetails, adminDeleteOrder } from '../api/adminService';
import Page from '../components/Page';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

function AdminOrderDetail() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        const data = await getAdminOrderDetails(id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      try {
        setLoading(true);
        await adminDeleteOrder(id);
        alert('Order deleted successfully.');
        navigate('/orders');
      } catch (err) {
        alert(`Failed to delete order: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white' }}>
            <div style={{
                width: '80px',
                height: '80px',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                borderTop: '4px solid #FFD700',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <h1 style={{ marginLeft: '20px' }}>Loading Order Details...</h1>
        </div>
    );
  }

  if (error) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'red' }}>
            <h1>Error: {error}</h1>
        </div>
    );
  }
  
  if (!order) return (
    <Page title="Error">
      <h2 style={{color: 'white'}}>Order not found.</h2>
    </Page>
  );

  const { user, shippingAddress, items, totalAmount, status, createdAt } = order;

  const COLORS = {
    blue: '#0066FF',
    skyBlue: '#00BFFF',
    yellow: '#FFD700',
    black: '#000000',
    white: '#FFFFFF',
    green: '#00FF00',
    red: '#EF4444',
    magenta: '#FF00FF'
  };

  return (
    <Page title={`Order Details: ${order.id.substring(0, 8)}...`}>
      <Link to="/orders" style={{
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px'
      }}>
        <FaArrowLeft /> Back to All Orders
      </Link>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: '32px',
          padding: 'clamp(24px, 4vw, 40px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.12)',
        }}>
          <h2 style={{color: 'white', marginBottom: '24px'}}>Order Items ({items.length})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Product</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Qty</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Unit Price</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <td style={{ padding: '16px' }}>{item.productName || item.product?.name}</td>
                  <td style={{ padding: '16px' }}>{item.quantity}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>Ksh {parseFloat(item.unitPrice).toFixed(2)}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>Ksh {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {shippingAddress && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: '32px',
            padding: 'clamp(24px, 4vw, 40px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.12)',
          }}>
            <h2 style={{color: 'white', marginBottom: '24px'}}>Shipping Address</h2>
            <p style={{color: 'white'}}><strong>Name:</strong> {shippingAddress.fullName}</p>
            <p style={{color: 'white'}}><strong>Phone:</strong> {shippingAddress.phone}</p>
            <p style={{color: 'white'}}><strong>Address:</strong> {shippingAddress.street}</p>
            <p style={{color: 'white'}}><strong>City:</strong> {shippingAddress.city}</p>
            <p style={{color: 'white'}}><strong>Country:</strong> {shippingAddress.country}</p>
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: '32px',
          padding: 'clamp(24px, 4vw, 40px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.12)',
        }}>
          <h2 style={{color: 'white', marginBottom: '24px'}}>Order Summary</h2>
          <p style={{color: 'white'}}><strong>Status:</strong> {status}</p>
          <p style={{color: 'white'}}><strong>Order Date:</strong> {new Date(createdAt).toLocaleString()}</p>
          <p style={{color: COLORS.yellow, fontSize: '24px', fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px', marginTop: '16px'}}>Grand Total: Ksh {parseFloat(totalAmount).toFixed(2)}</p>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
                marginTop: '16px',
                background: COLORS.red,
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
            }}
          >
            {loading ? 'Deleting...' : 'Delete Order'}
          </button>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: '32px',
          padding: 'clamp(24px, 4vw, 40px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.12)',
        }}>
          <h2 style={{color: 'white', marginBottom: '24px'}}>Customer</h2>
          <p style={{color: 'white'}}><strong>Name:</strong> {user.name}</p>
          <p style={{color: 'white'}}><strong>Email:</strong> {user.email}</p>
          <p style={{color: 'white'}}><strong>Phone:</strong> {user.phone}</p>
        </div>
      </div>
    </Page>
  );
}

export default AdminOrderDetail;