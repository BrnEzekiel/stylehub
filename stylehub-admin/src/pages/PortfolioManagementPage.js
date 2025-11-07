// src/pages/PortfolioManagementPage.js
import React, { useState, useEffect } from 'react';
import { getPendingProviderPortfolios, updatePortfolioStatus } from '../api/adminService'; // ✅ Updated import

function PortfolioManagementPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPendingProviderPortfolios(); // ✅ New function
      setPortfolios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (portfolioId, newStatus) => {
    try {
      await updatePortfolioStatus(portfolioId, newStatus); // ✅ New function
      fetchPortfolios();
    } catch (err) {
      setError(`Failed to ${newStatus} portfolio. Please try again.`);
    }
  };

  if (loading) return <p style={styles.loading}>Loading pending portfolios...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Service Provider Portfolio Review</h2>
      {portfolios.length === 0 ? (
        <p style={styles.noData}>No pending portfolios to review. ✅</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.cell}>Provider Name</th>
                <th style={styles.cell}>Bio</th>
                <th style={styles.cell}>Portfolio</th>
                <th style={styles.cell}>Video Pitch</th>
                <th style={styles.cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map((portfolio) => (
                <tr key={portfolio.id} style={styles.row}>
                  <td style={styles.cell}>
                    {portfolio.user?.name || 'N/A'}<br />
                    <small style={{ color: '#555' }}>{portfolio.user?.email}</small>
                  </td>
                  <td style={styles.cell}>
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {portfolio.bio}
                    </div>
                  </td>
                  <td style={styles.cell}>
                    {portfolio.portfolioUrl ? (
                      <a
                        href={portfolio.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        View Portfolio
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={styles.cell}>
                    {portfolio.videoUrl ? (
                      <a
                        href={portfolio.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        Watch Video
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={styles.cell}>
                    <button
                      onClick={() => handleUpdateStatus(portfolio.id, 'approved')}
                      style={styles.buttonApprove}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(portfolio.id, 'rejected')}
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

// 🎨 Reuse your existing admin styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    color: '#000000',
    fontFamily: '"Poppins", sans-serif',
  },
  title: {
    color: '#0f35df',
    fontSize: '1.8rem',
    marginBottom: '20px',
    textAlign: 'center',
    borderBottom: '3px solid #fa0f8c',
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
    verticalAlign: 'top',
  },
  link: {
    color: '#0f35df',
    fontWeight: '500',
    textDecoration: 'none',
  },
  buttonApprove: {
    background: '#f4d40f',
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
    background: '#fa0f8c',
    color: '#ffffff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};

export default PortfolioManagementPage;