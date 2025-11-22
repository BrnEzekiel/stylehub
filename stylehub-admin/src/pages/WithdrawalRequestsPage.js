
import React, { useState, useEffect } from 'react';
import { getWithdrawalRequests, updateWithdrawalStatus } from '../api/adminService';
import Page from '../components/Page';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
      if (remarks === null) return;
    }

    const action = newStatus === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this request? This action is permanent.`)) {
      return;
    }

    try {
      await updateWithdrawalStatus(requestId, newStatus, remarks);
      alert(`Request ${action}ed successfully.`);
      loadRequests();
    } catch (err) {
      alert(`Error: ${err.message}`);
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
        <h1 style={{ marginLeft: '20px' }}>Loading Withdrawal Requests...</h1>
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
    <Page title="Withdrawal Requests">
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        border: '2px solid rgba(255, 255, 255, 0.12)',
      }}>
        <h2 style={{color: 'white', marginBottom: '24px'}}>Pending Withdrawal Requests</h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          color: 'white'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Seller</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Amount</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>M-Pesa Number</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '16px' }}>
                  No withdrawal requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <td style={{ padding: '16px' }}>{new Date(req.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '16px' }}>
                    <div>{req.seller?.name || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{req.seller?.email}</div>
                  </td>
                  <td style={{ padding: '16px' }}>{formatCurrency(req.amount)}</td>
                  <td style={{ padding: '16px' }}>{req.mpesaNumber}</td>
                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        backgroundColor:
                          req.status === 'pending'
                            ? COLORS.yellow
                            : req.status === 'approved'
                            ? COLORS.green
                            : COLORS.red,
                        color: COLORS.black,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {req.status || 'Unknown'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {req.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => handleUpdate(req.id, 'approved')}
                          style={{ background: COLORS.green, color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <FaCheck/> Approve
                        </button>
                        <button
                          onClick={() => handleUpdate(req.id, 'rejected')}
                          style={{ background: COLORS.red, color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <FaTimes/> Reject
                        </button>
                      </div>
                    ) : (
                      <div style={{color: 'white', fontSize: '12px'}}>
                        {req.adminRemarks || `Processed on ${new Date(req.processedAt).toLocaleDateString()}`}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

export default WithdrawalRequestsPage;
