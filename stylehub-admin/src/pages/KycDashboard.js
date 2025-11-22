
import React, { useState, useEffect } from 'react';
import { getPendingSubmissions, updateKycStatus } from '../api/adminService';
import Page from '../components/Page';
import { FaCheck, FaTimes } from 'react-icons/fa';

function KycDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPendingSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError(`Failed to fetch pending KYC submissions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (kycId, newStatus) => {
    const action = newStatus === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this KYC submission?`)) {
      return;
    }
    try {
      setSubmissions((prev) => prev.filter((sub) => sub.id !== kycId));
      await updateKycStatus(kycId, newStatus);
    } catch (err)
 {
      setError(`Failed to ${newStatus} submission: ${err.message}`);
      fetchSubmissions();
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
              <h1 style={{ marginLeft: '20px' }}>Loading KYC Submissions...</h1>
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
    <Page title="KYC Admin Dashboard">
      {submissions.length === 0 ? (
        <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: '32px',
            padding: 'clamp(24px, 4vw, 40px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.12)',
            textAlign: 'center',
            color: 'white'
        }}>
          <h2>No pending KYC submissions found.</h2>
        </div>
      ) : (
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
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>User Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>User Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Document Type</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Documents</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <td style={{ padding: '16px' }}>{sub.user?.name || 'N/A'}</td>
                    <td style={{ padding: '16px' }}>{sub.user?.email || 'N/A'}</td>
                    <td style={{ padding: '16px' }}>{sub.docType}</td>
                    <td style={{ padding: '16px' }}>
                      <a href={sub.docUrl} target="_blank" rel="noopener noreferrer" style={{ marginRight: '16px', color: COLORS.skyBlue }}>
                        View ID
                      </a>
                      <a href={sub.selfieUrl} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.skyBlue }}>
                        View Selfie
                      </a>
                    </td>
                    <td style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => handleUpdateStatus(sub.id, 'approved')}
                        style={{ background: COLORS.green, color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <FaCheck/> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(sub.id, 'rejected')}
                        style={{ background: COLORS.red, color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <FaTimes/> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
    </Page>
  );
}

export default KycDashboard;
