// src/pages/OrderManagement.js

import React, { useState, useEffect } from 'react';
// 1. Import the new update function
import { getAllOrders, updateOrderStatus } from '../api/adminService';

// 2. Define possible order statuses
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

  // 3. Add handler to update status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Call the API
      await updateOrderStatus(orderId, newStatus);
      
      // Update the status in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      // If API call fails, show an alert and reload the data
      alert(`Failed to update status: ${err.message}`);
      fetchOrders();
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
              <th style={styles.cell}>Items</th>
              <th style={styles.cell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={styles.row}>
                <td style={styles.cell}>{order.id.substring(0, 8)}...</td>
                <td style={styles.cell}>{order.user?.name || 'N/A'}</td>
                <td style={styles.cell}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={styles.cell}>
                  Ksh {parseFloat(order.totalAmount).toFixed(2)}
                </td>
                <td style={styles.cell}>{order.items.length}</td>
                <td style={styles.cell}>
                  {/* 4. Replace span with select dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                      ...styles.badge, 
                      ...styles[order.status], 
                      padding: '8px 12px', 
                      border: 'none', 
                      cursor: 'pointer',
                      appearance: 'none' // Removes default arrow
                    }}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🎨 Your existing styles (unchanged)
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
    verticalAlign: 'middle', // Added for select
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
    color: '#fff', // Added for select
  },
  shipped: {
    backgroundColor: '#fa0f8c',
    color: '#fff', // Added for select
  },
  completed: {
    backgroundColor: '#28a745',
    color: '#fff', // Added for select
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
};

export default OrderManagement;