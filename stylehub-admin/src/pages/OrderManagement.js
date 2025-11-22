
import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, adminDeleteOrder } from '../api/adminService';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import { FaEye, FaTrash } from 'react-icons/fa';

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      try {
        await adminDeleteOrder(orderId);
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      } catch (err) {
        alert(`Failed to delete order: ${err.message}`);
        setError(err.message);
      }
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <h1 style={{ marginLeft: '20px' }}>Loading Orders...</h1>
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
    <Page title="Order Management">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <input
          type="text"
          placeholder="Search Orders by ID or Customer Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            padding: '12px 16px',
            fontSize: '16px',
            width: '40%',
            outline: 'none',
          }}
        />
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
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          color: 'white'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Order ID</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Customer</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Total</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <td style={{ padding: '16px' }}>
                  <Link to={`/order/${order.id}`} style={{ color: COLORS.yellow }}>{order.id.substring(0, 8)}...</Link>
                </td>
                <td style={{ padding: '16px' }}>{order.user?.name || 'N/A'}</td>
                <td style={{ padding: '16px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>Ksh {parseFloat(order.totalAmount).toFixed(2)}</td>
                <td style={{ padding: '16px' }}>
                <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        padding: '8px 12px',
                        fontSize: '14px',
                        outline: 'none',
                    }}
                >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status} style={{color: 'black'}}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                  <Link to={`/order/${order.id}`} style={{
                    color: COLORS.skyBlue,
                    cursor: 'pointer'
                  }}>
                    <FaEye size={20} />
                  </Link>
                  <button onClick={() => handleDelete(order.id)} style={{
                    background: 'none',
                    border: 'none',
                    color: COLORS.red,
                    cursor: 'pointer'
                  }}>
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

export default OrderManagement;