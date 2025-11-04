// src/pages/OrderManagement.js

import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, adminDeleteOrder } from '../api/adminService'; // 1. 🛑 Import adminDeleteOrder
import { Link } from 'react-router-dom';

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
      fetchOrders();
    }
  };

  // 2. 🛑 Add Delete Handler
  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      try {
        await adminDeleteOrder(orderId);
        // Refresh list by filtering state
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      } catch (err) {
        alert(`Failed to delete order: ${err.message}`);
        setError(err.message);
      }
    }
  };

  if (loading) return <p style={styles.loading}>Loading all orders...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Order Management</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.cell}>Order ID</th>
              <th style={styles.cell}>Customer</th>
              <th style={styles.cell}>Date</th>
              <th style={styles.cell}>Total</th>
              <th style={styles.cell}>Status</th>
              <th style={styles.cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={styles.row}>
                <td style={styles.cell}>
                  <Link to={`/order/${order.id}`} style={{ color: '#0f35df', fontWeight: '500' }}>
                    {order.id.substring(0, 8)}...
                  </Link>
                </td>
                <td style={styles.cell}>{order.user?.name || 'N/A'}</td>
                <td style={styles.cell}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={styles.cell}>
                  Ksh {parseFloat(order.totalAmount).toFixed(2)}
                </td>
                <td style={styles.cell}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                      ...styles.badge, 
                      ...styles[order.status], 
                      padding: '8px 12px', 
                      border: 'none', 
                      cursor: 'pointer',
                      appearance: 'none'
                    }}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                {/* 3. 🛑 Add Delete Button */}
                <td style={{...styles.cell, display: 'flex', gap: '5px'}}>
                  <Link to={`/order/${order.id}`}>
                    <button style={styles.buttonView}>View</button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(order.id)}
                    style={styles.buttonDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4. 🛑 Add buttonDelete style
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: '"Poppins", sans-serif',
    color: '#000',
  },
  title: {
    fontSize: '1.8rem',
    color: '#0f35df',
    textAlign: 'center',
    marginBottom: '20px',
    borderBottom: '3px solid #fa0f8c',
    display: 'inline-block',
    paddingBottom: '5px',
    fontWeight: '600',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
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
  row: {
    transition: 'background 0.3s ease',
  },
  badge: {
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  pending: {
    backgroundColor: '#f4d40f',
    color: '#000',
  },
  paid: {
    backgroundColor: '#0f35df',
    color: '#fff',
  },
  shipped: {
    backgroundColor: '#fa0f8c',
    color: '#fff',
  },
  delivered: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  cancelled: {
    backgroundColor: '#000000',
    color: '#fff',
  },
  loading: {
    textAlign: 'center',
    color: '#0f35df',
    fontWeight: '500',
  },
  error: {
    textAlign: 'center',
    color: '#fa0f8c',
    fontWeight: '600',
  },
  buttonView: {
    background: '#0f35df',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  buttonDelete: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  }
};

export default OrderManagement;