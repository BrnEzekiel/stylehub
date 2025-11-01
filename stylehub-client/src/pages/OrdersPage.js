// src/pages/OrdersPage.js

import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../api/cartService'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        const ordersData = await fetchOrders(); 
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

  if (loading) return <p style={{ padding: '20px' }}>Loading your order history...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;
  if (orders.length === 0) return <h2 style={{ padding: '20px' }}>You have no past orders 🙁</h2>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Order History ({orders.length} Orders)</h1>
      
      <div style={{ display: 'grid', gap: '25px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {orders.map((order) => {
          
          // 🛑 1. Get the first item's name for the header
          const firstItemName = order.items?.[0]?.product?.name || 'Order';
          const totalItems = order.items?.length || 0;

          return (
            <div 
              key={order.id} 
              style={{ 
                border: '1px solid #FF149330', /* Light Magenta Pink border */
                padding: '20px', 
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                borderBottom: '2px solid #00BFFF50', /* Light Sky Blue separator */
                paddingBottom: '10px', 
                marginBottom: '15px' 
              }}>
                {/* 🛑 2. Update Header to show item name */}
                <h3 style={{ margin: 0, color: '#FF1493' }}>
                  {firstItemName}
                  {totalItems > 1 ? ` (and ${totalItems - 1} more)` : ''}
                </h3>
                {/* 🛑 3. Change currency to Ksh */}
                <p style={{ margin: 0, fontWeight: 'bold', color: '#00BFFF', fontSize: '1.3em' }}>
                  Ksh {parseFloat(order.totalAmount).toFixed(2)}
                </p>
              </div>
              
              <p style={{ fontSize: '0.9em', color: '#777' }}>
                **Date Placed:** {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p style={{ fontSize: '0.8em', color: '#aaa' }}>
                Order ID: {order.id.substring(0, 8)}...
              </p>

              <h4 style={{ marginTop: '20px', marginBottom: '10px', color: '#333' }}>Items Purchased:</h4>
              <ul style={{ listStyle: 'none', paddingLeft: '0', fontSize: '0.95em' }}>
                {order.items && order.items.map((item, index) => ( 
                  <li key={index} style={{ marginBottom: '8px', padding: '5px 0', borderLeft: '4px solid #FFD700' /* Yellow stripe */ }}>
                    {item.product ? (
                      <span style={{ marginLeft: '10px' }}>
                        **{item.product.name}** &times; {item.quantity} 
                        <span style={{ float: 'right', color: '#00BFFF' }}>
                          {/* 🛑 4. Change currency to Ksh */}
                          Ksh {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </span>
                    ) : (
                      <span style={{ marginLeft: '10px', color: 'red' }}>
                        Product Not Found (ID: {item.productId.substring(0, 8)}...)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersPage;