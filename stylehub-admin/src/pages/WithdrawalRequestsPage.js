// src/pages/WithdrawalRequestsPage.js

import React, { useState, useEffect } from 'react';
import { getWithdrawalRequests, updateWithdrawalStatus } from '../api/adminService';

// --- Helper to format currency ---
function formatCurrency(num) {
  const number = parseFloat(num);
  if (isNaN(number)) return 'Ksh 0.00';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KSH',
  }).format(number);
}

function WithdrawalRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getWithdrawalRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdate = async (requestId, newStatus) => {
    let remarks = '';
    if (newStatus === 'rejected') {
      remarks = prompt('Please provide a reason for rejection (this will be logged):');
      if (remarks === null) return; // User cancelled prompt
    }
    
    const action = newStatus === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this request? This action is permanent.`)) {
      return;
    }
    
    try {
      await updateWithdrawalStatus(requestId, newStatus, remarks);
      alert(`Request ${action}ed successfully.`);
      loadRequests(); // Refresh the list
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p style={styles.loading}>Loading withdrawal requests...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Withdrawal Requests</h2>
      {error && <p style={styles.error}>Error: {error}</p>}
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.cell}>Date</th>
              <th style={styles.cell}>Seller</th>
              <th style={styles.cell}>Amount</th>
              <th style={styles.cell}>M-Pesa Number</th>
              <th style={styles.cell}>Status</th>
              <th style={styles.cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" style={{...styles.cell, textAlign: 'center'}}>
                  No withdrawal requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} style={styles.row}>
                  <td style={styles.cell}>{new Date(req.createdAt).toLocaleString()}</td>
                  <td style={styles.cell}>
                    {req.seller?.name || 'N/A'}<br/>
                    <small style={{ color: '#555' }}>{req.seller?.email}</small>
                  </td>
                  <td style={styles.cell}>{formatCurrency(req.amount)}</td>
                  <td style={styles.cell}>{req.mpesaNumber}</td>
                  <td style={styles.cell}>
                    <span style={{...styles.badge, ...styles[req.status]}}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ ...styles.cell, display: 'flex', gap: '5px' }}>
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleUpdate(req.id, 'approved')}
                          style={styles.buttonApprove}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdate(req.id, 'rejected')}
                          style={styles.buttonReject}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <small>{req.adminRemarks || `Processed on ${new Date(req.processedAt).toLocaleDateString()}`}</small>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Re-using styles from other admin pages
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
    marginBottom: '20px',
    fontWeight: '600',
    borderBottom: '3px solid #fa0f8c',
    display: 'inline-block',
    paddingBottom: '5px',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
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
    transition: 'background 0.2s ease',
  },
  buttonApprove: {
    background: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  buttonReject: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
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
  badge: {
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#000',
  },
  pending: {
    backgroundColor: '#f4d40f',
  },
  approved: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  rejected: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
};

export default WithdrawalRequestsPage;