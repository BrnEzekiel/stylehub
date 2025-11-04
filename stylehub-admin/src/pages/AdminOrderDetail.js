// src/pages/AdminOrderDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // 1. 🛑 Import useNavigate
import { getAdminOrderDetails, adminDeleteOrder } from '../api/adminService'; // 2. 🛑 Import adminDeleteOrder

// Re-use the styles from OrderManagement
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    fontFamily: '"Poppins", sans-serif',
  },
  title: {
    fontSize: '1.8rem',
    color: '#0f35df',
    marginBottom: '20px',
    fontWeight: '600',
    borderBottom: '3px solid #fa0f8c',
    display: 'inline-block',
    paddingBottom: '5px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0f35df',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  infoList: {
    listStyleType: 'none',
    padding: 0,
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f9f9f9',
  },
  infoLabel: {
    fontWeight: '500',
    color: '#555',
  },
  infoValue: {
    fontWeight: '600',
    color: '#000',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
  },
  headerRow: {
    backgroundColor: '#0f35df',
    color: '#fff',
  },
  cell: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
    verticalAlign: 'middle',
  },
  badge: {
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '1em',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  pending: { backgroundColor: '#f4d40f', color: '#000' },
  paid: { backgroundColor: '#0f35df', color: '#fff' },
  shipped: { backgroundColor: '#fa0f8c', color: '#fff' },
  delivered: { backgroundColor: '#28a745', color: '#fff' },
  cancelled: { backgroundColor: '#000000', color: '#fff' },
  loading: { textAlign: 'center', color: '#0f35df', fontWeight: '500' },
  error: { textAlign: 'center', color: '#fa0f8c', fontWeight: '600' },
  // 3. 🛑 Add style for the delete button
  buttonDelete: {
    width: '100%',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1em',
    marginTop: '15px',
  }
};

function AdminOrderDetail() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate(); // 4. 🛑 Initialize useNavigate

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

  // 5. 🛑 Add Delete Handler
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      try {
        setLoading(true);
        await adminDeleteOrder(id);
        alert('Order deleted successfully.');
        navigate('/order-management'); // Navigate back to the list
      } catch (err) {
        alert(`Failed to delete order: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    }
  };


  if (loading) return <p style={styles.loading}>Loading order details...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;
  if (!order) return <p>Order not found.</p>;

  const { user, shippingAddress, items, totalAmount, status, createdAt } = order;

  return (
    <div style={styles.container}>
      <Link to="/order-management" style={{ textDecoration: 'none' }}>
        &larr; Back to All Orders
      </Link>
      <h2 style={styles.title}>Order Details: {order.id.substring(0, 8)}...</h2>

      <div style={styles.grid}>
        {/* --- Main Column --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Order Items */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Order Items ({items.length})</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.cell}>Product</th>
                  <th style={styles.cell}>Quantity</th>
                  <th style={styles.cell}>Unit Price</th>
                  <th style={styles.cell}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.cell}>{item.productName || item.product?.name}</td>
                    <td style={styles.cell}>{item.quantity}</td>
                    <td style={styles.cell}>Ksh {parseFloat(item.unitPrice).toFixed(2)}</td>
                    <td style={styles.cell}>Ksh {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Shipping Address</h3>
              <ul style={styles.infoList}>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>Name:</span>
                  <span style={styles.infoValue}>{shippingAddress.fullName}</span>
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>Phone:</span>
                  <span style={styles.infoValue}>{shippingAddress.phone}</span>
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>Address:</span>
                  <span style={styles.infoValue}>{shippingAddress.street}</span>
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>City:</span>
                  <span style={styles.infoValue}>{shippingAddress.city}</span>
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>Country:</span>
                  <span style={styles.infoValue}>{shippingAddress.country}</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* --- Sidebar Column --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Order Summary */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Order Summary</h3>
            <ul style={styles.infoList}>
              <li style={styles.infoItem}>
                <span style={styles.infoLabel}>Status:</span>
                <span style={{...styles.badge, ...styles[status]}}>{status}</span>
              </li>
              <li style={styles.infoItem}>
                <span style={styles.infoLabel}>Order Date:</span>
                <span style={styles.infoValue}>{new Date(createdAt).toLocaleString()}</span>
              </li>
              <li style={{...styles.infoItem, marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                <span style={{...styles.infoLabel, fontSize: '1.2em'}}>Grand Total:</span>
                <span style={{...styles.infoValue, fontSize: '1.2em', color: '#0f35df'}}>
                  Ksh {parseFloat(totalAmount).toFixed(2)}
                </span>
              </li>
            </ul>
            {/* 6. 🛑 Add Delete Button */}
            <button 
              onClick={handleDelete}
              style={styles.buttonDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Order'}
            </button>
          </div>
          
          {/* Customer Info */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Customer</h3>
            <ul style={styles.infoList}>
              <li style={styles.infoItem}>
                <span style={styles.infoLabel}>Name:</span>
                <span style={styles.infoValue}>{user.name}</span>
              </li>
              <li style={styles.infoItem}>
                <span style={styles.infoLabel}>Email:</span>
                <span style={styles.infoValue}>{user.email}</span>
              </li>
              <li style={styles.infoItem}>
                <span style={styles.infoLabel}>Phone:</span>
                <span style={styles.infoValue}>{user.phone}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;