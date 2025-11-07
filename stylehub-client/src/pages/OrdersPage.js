// src/pages/OrdersPage.js
import React, { useState, useEffect } from 'react';
import { fetchClientOrders, downloadOrderReceipt } from '../api/orderService'; // ✅ FIXED
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const loadOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await fetchClientOrders(); // ✅ FIXED
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Could not load order history.');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [token, navigate]);

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

  if (loading) return <p style={{ padding: '20px' }}>Loading your order history...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;

  return (
    <div className="admin-content">
      <h1>Your Order History ({orders.length} Orders)</h1>
      
      {orders.length === 0 ? (
        <p>You have no past orders 🙁</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <span style={{ fontSize: '0.8em', color: '#666' }}>{order.id.substring(0, 8)}...</span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>Ksh {parseFloat(order.totalAmount).toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                    {order.items.map((item, index) => ( 
                      <li key={index}>
                        {item.product ? (
                          <>
                            {item.product.name} &times; {item.quantity}
                          </>
                        ) : (
                          <span style={{ color: 'red' }}>Product Not Found</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    onClick={() => handleDownload(order.id)}
                    disabled={downloading === order.id}
                    style={{ fontSize: '0.9em', padding: '5px 10px' }}
                  >
                    {downloading === order.id ? '...' : 'Download'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrdersPage;