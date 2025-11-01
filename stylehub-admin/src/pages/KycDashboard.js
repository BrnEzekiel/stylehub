import React, { useState, useEffect } from 'react';
import { getPendingSubmissions, updateKycStatus } from '../api/adminService';

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (kycId, newStatus) => {
    try {
      setSubmissions((prev) => prev.filter((sub) => sub.id !== kycId));
      await updateKycStatus(kycId, newStatus);
    } catch (err) {
      setError(`Failed to ${newStatus} submission ${kycId}. Please refresh.`);
      fetchSubmissions();
    }
  };

  if (loading) return <p style={styles.loading}>Loading pending submissions...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>KYC Admin Dashboard</h2>
      {submissions.length === 0 ? (
        <p style={styles.noData}>No pending KYC submissions found. ✅</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.cell}>User Name</th>
                <th style={styles.cell}>User Email</th>
                <th style={styles.cell}>Document Type</th>
                <th style={styles.cell}>Documents</th>
                <th style={styles.cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} style={styles.row}>
                  <td style={styles.cell}>{sub.user?.name || 'N/A'}</td>
                  <td style={styles.cell}>{sub.user?.email || 'N/A'}</td>
                  <td style={styles.cell}>{sub.doc_type}</td>
                  <td style={styles.cell}>
                    <a
                      href={sub.doc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                    >
                      View ID
                    </a>
                    <span style={styles.divider}>|</span>
                    <a
                      href={sub.selfie_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                    >
                      View Selfie
                    </a>
                  </td>
                  <td style={styles.cell}>
                    <button
                      onClick={() => handleUpdateStatus(sub.id, 'approved')}
                      style={styles.buttonApprove}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(sub.id, 'rejected')}
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

// 🎨 Styling: Blue, Yellow, Magenta, Black, White Only
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    color: '#000000',
    fontFamily: '"Poppins", sans-serif',
  },
  title: {
    color: '#0f35df', // Blue
    fontSize: '1.8rem',
    marginBottom: '20px',
    textAlign: 'center',
    borderBottom: '3px solid #fa0f8c', // Magenta underline
    paddingBottom: '8px',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    color: '#0f35df',
    fontWeight: '500',
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noData: {
    textAlign: 'center',
    color: '#fa0f8c',
    fontWeight: '500',
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
    color: '#ffffff',
  },
  row: {
    borderBottom: '1px solid #ddd',
    transition: 'background 0.3s ease',
  },
  cell: {
    padding: '12px 15px',
    textAlign: 'left',
  },
  link: {
    color: '#0f35df',
    fontWeight: '500',
    textDecoration: 'none',
  },
  divider: {
    margin: '0 6px',
    color: '#fa0f8c',
  },
  buttonApprove: {
    background: '#f4d40f', // Yellow
    color: '#000000',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  buttonReject: {
    background: '#fa0f8c', // Magenta
    color: '#ffffff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};

// Hover effects (via inline JS for simplicity)
Object.assign(styles.buttonApprove, {
  ':hover': {
    background: '#ffe44d',
  },
});
Object.assign(styles.buttonReject, {
  ':hover': {
    background: '#ff4fcf',
  },
});

export default KycDashboard;
