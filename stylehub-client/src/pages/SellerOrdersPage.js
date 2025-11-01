// src/pages/SellerOrdersPage.js

import React, { useState, useEffect } from 'react';
import { fetchAllOrders } from '../api/cartService'; // This now fetches the summary too
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SellerOrdersPage() {
  // 1. Update state to hold the new data structure
  const [data, setData] = useState({ orders: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 2. Check for token and correct role
    if (!token || user?.role !== 'seller') {
      navigate('/login');
      return;
    }
    
    const loadSellerData = async () => {
      try {
        setLoading(true);
        // 3. fetchAllOrders() now returns { orders: [], summary: {} }
        const sellerData = await fetchAllOrders(); 
        setData(sellerData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Could not load seller dashboard.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSellerData();
  }, [token, user, navigate]);

  if (loading) return <p style={{ padding: '20px' }}>Loading your dashboard...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;

  // 4. Destructure the data for easier use
  const { orders, summary } = data;

  return (
    <div style={{ padding: '20px' }}>
      <h1>📈 Seller Dashboard</h1>
      
      {/* 5. Summary Cards Section */}
      {summary && (
        <div style={styles.summaryContainer}>
          <SummaryCard 
            title="Total Revenue" 
            value={`Ksh ${parseFloat(summary.totalRevenue).toFixed(2)}`}
            color="#28a745"
          />
          <SummaryCard 
            title="Total Orders" 
            value={summary.totalOrders}
            color="#007bff"
          />
          <SummaryCard 
            title="Pending Orders" 
            value={summary.pendingOrders}
            color="#ffc107"
          />
        </div>
      )}
      
      <hr style={{ margin: '30px 0' }} />

      {/* 6. Orders List Section */}
      <h2>Incoming Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <h4>Order ID: {order.id.substring(0, 8)}...</h4>
                <span style={{...styles.statusBadge, ...styles[order.status]}}>
                  {order.status}
                </span>
              </div>
              <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
              <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              
              <h5 style={{ marginTop: '15px' }}>Your Items in this Order:</h5>
              <ul style={{ paddingLeft: '20px' }}>
                {order.items.map((item) => (
                  <li key={item.id} style={{ marginBottom: '5px' }}>
                    {item.product?.name || 'Product'} &times; {item.quantity} 
                    <span style={{ float: 'right' }}>
                      Ksh {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 7. Component for the summary cards
function SummaryCard({ title, value, color }) {
  return (
    <div style={{...styles.card, borderLeft: `5px solid ${color}`}}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardValue}>{value}</p>
    </div>
  );
}

// 8. Styles for the page
const styles = {
  summaryContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: '200px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1em',
    color: '#666',
  },
  cardValue: {
    margin: '10px 0 0',
    fontSize: '2em',
    fontWeight: 'bold',
  },
  orderList: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    padding: '20px',
    border: '1px solid #eee',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '0.9em',
    fontWeight: 'bold',
    color: '#fff',
  },
  pending: {
    backgroundColor: '#ffc107',
    color: '#333',
  },
  paid: {
    backgroundColor: '#28a745',
  },
  completed: {
    backgroundColor: '#28a745',
  },
  shipped: {
    backgroundColor: '#17a2b8',
  },
  // Add other statuses if you have them
  cancelled: {
    backgroundColor: '#dc3545',
  }
};

export default SellerOrdersPage;