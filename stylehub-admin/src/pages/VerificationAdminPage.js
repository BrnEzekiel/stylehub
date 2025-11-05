// src/pages/VerificationAdminPage.js

import React, { useState, useEffect } from 'react';
import { getPendingVerifications, updateVerificationStatus } from '../api/adminService';

function VerificationAdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data on load
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve/reject actions
  const handleUpdate = async (verificationId, newStatus) => {
    const action = newStatus === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this submission?`)) {
      return;
    }
    
    try {
      await updateVerificationStatus(verificationId, newStatus);
      // Remove from the list on success
      setSubmissions((prev) => prev.filter((sub) => sub.id !== verificationId));
    } catch (err) {
      setError(`Failed to ${action} submission: ${err.message}`);
    }
  };

  if (loading) return <p style={styles.loading}>Loading pending verifications...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Seller Verification Queue</h2>
      {error && <p style={styles.error}>Error: {error}</p>}
      
      {submissions.length === 0 ? (
        <p style={styles.loading}>No pending submissions found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.cell}>Seller</th>
                <th style={styles.cell}>Business Name</th>
                <th style={styles.cell}>Socials</th>
                <th style={styles.cell}>License</th>
                <th style={styles.cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} style={styles.row}>
                  <td style={styles.cell}>
                    {sub.user?.name || 'N/A'}<br/>
                    <small style={{ color: '#555' }}>{sub.user?.email}</small>
                  </td>
                  <td style={styles.cell}>{sub.businessName}</td>
                  <td style={styles.cell}>
                    <a href={sub.socialMediaUrl} target="_blank" rel="noopener noreferrer">
                      View Profile
                    </a>
                  </td>
                  <td style={styles.cell}>
                    <a href={sub.businessLicenseUrl} target="_blank" rel="noopener noreferrer">
                      View License
                    </a>
                  </td>
                  <td style={{ ...styles.cell, display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => handleUpdate(sub.id, 'approved')}
                      style={styles.buttonApprove}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(sub.id, 'rejected')}
                      style={styles.buttonReject}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
};

export default VerificationAdminPage;