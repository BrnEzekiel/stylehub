
import React, { useState, useEffect } from 'react';
import { getPendingProviderPortfolios, updatePortfolioStatus } from '../api/adminService';
import Page from '../components/Page';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
      const data = await getPendingProviderPortfolios();
      setPortfolios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (portfolioId, newStatus) => {
    const action = newStatus === 'verified' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this portfolio?`)) {
      return;
    }
    try {
      await updatePortfolioStatus(portfolioId, newStatus);
      fetchPortfolios();
    } catch (err) {
      setError(`Failed to ${newStatus} portfolio. Please try again.`);
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
              <h1 style={{ marginLeft: '20px' }}>Loading Portfolios...</h1>
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
    <Page title="Service Provider Portfolio Review">
      {portfolios.length === 0 ? (
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
          <h2>No pending portfolios to review.</h2>
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
            <h2 style={{color: 'white', marginBottom: '24px'}}>Service Provider Portfolios</h2>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: 'white'
            }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Provider Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Bio</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Portfolio</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Video Pitch</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((portfolio) => (
                  <tr key={portfolio.id} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <td style={{ padding: '16px' }}>
                      <div>{portfolio.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{portfolio.user?.email}</div>
                    </td>
                    <td style={{ padding: '16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {portfolio.bio}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {portfolio.portfolioUrl ? (
                        <a href={portfolio.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{color: COLORS.skyBlue}}>
                          View Portfolio
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {portfolio.videoUrl ? (
                        <a href={portfolio.videoUrl} target="_blank" rel="noopener noreferrer" style={{color: COLORS.skyBlue}}>
                          Watch Video
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => handleUpdateStatus(portfolio.id, 'verified')}
                        style={{ background: COLORS.green, color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <FaCheck/> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(portfolio.id, 'rejected')}
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

export default PortfolioManagementPage;