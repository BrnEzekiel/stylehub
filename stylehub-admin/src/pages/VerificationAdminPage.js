
import React, { useState, useEffect } from 'react';
import { getPendingVerifications, updateVerificationStatus } from '../api/adminService';
import Page from '../components/Page';
import { FaCheck, FaTimes } from 'react-icons/fa';

function VerificationAdminPage() {
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
      const data = await getPendingVerifications();
      setSubmissions(data);
    } catch (err) {
      setError(`Failed to fetch pending verifications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (verificationId, newStatus) => {
    const action = newStatus === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this submission?`)) {
      return;
    }

    try {
      await updateVerificationStatus(verificationId, newStatus);
      setSubmissions((prev) => prev.filter((sub) => sub.id !== verificationId));
    } catch (err) {
      setError(`Failed to ${action} submission: ${err.message}`);
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
        <h1 style={{ marginLeft: '20px' }}>Loading Verifications...</h1>
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
    <Page title="Seller Verification Queue">
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
          <h2>No pending submissions found.</h2>
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
            <h2 style={{color: 'white', marginBottom: '24px'}}>Pending Verifications</h2>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: 'white'
            }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Seller</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Business Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Socials</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>License</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <td style={{ padding: '16px' }}>
                      <div>{sub.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{sub.user?.email}</div>
                    </td>
                    <td style={{ padding: '16px' }}>{sub.businessName}</td>
                    <td style={{ padding: '16px' }}>
                      <a href={sub.socialMediaUrl} target="_blank" rel="noopener noreferrer" style={{color: COLORS.skyBlue}}>
                        View Profile
                      </a>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <a href={sub.businessLicenseUrl} target="_blank" rel="noopener noreferrer" style={{color: COLORS.skyBlue}}>
                        View License
                      </a>
                    </td>
                    <td style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => handleUpdate(sub.id, 'approved')}
                        style={{ background: COLORS.green, color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <FaCheck/> Approve
                      </button>
                      <button
                        onClick={() => handleUpdate(sub.id, 'rejected')}
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

export default VerificationAdminPage;