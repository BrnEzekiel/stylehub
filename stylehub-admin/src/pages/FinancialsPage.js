// src/pages/FinancialsPage.js

import React, { useState, useEffect } from 'react';
import {
  getFinancialSummary,
  getSellerPayoutSummaries,
  createPayout,
  markPayoutAsPaid,
} from '../api/adminService';

// --- Helper to format numbers ---
function formatCurrency(num) {
  const number = parseFloat(num);
  if (isNaN(number)) return 'Ksh 0.00';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KSH',
  }).format(number);
}

// --- Main Page Component ---
function FinancialsPage() {
  const [summary, setSummary] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null); // To show payout history

  // Fetch all financial data on load
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [summaryData, sellersData] = await Promise.all([
        getFinancialSummary(),
        getSellerPayoutSummaries(),
      ]);
      setSummary(summaryData);
      setSellers(sellersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Handlers ---
  const handleCreatePayout = async (sellerId, sellerName) => {
    if (!window.confirm(`Create payout for all of ${sellerName}'s unpaid items?`)) {
      return;
    }
    try {
      await createPayout(sellerId);
      alert('Payout created successfully! It is now pending payment.');
      loadData(); // Refresh all data
      setSelectedSeller(null); // Close detail view
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleMarkAsPaid = async (payoutId) => {
    if (!window.confirm(`Mark this payout as PAID? This action is permanent.`)) {
      return;
    }
    try {
      await markPayoutAsPaid(payoutId);
      alert('Payout marked as paid.');
      loadData(); // Refresh all data
      setSelectedSeller(null); // Close detail view
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p style={styles.loading}>Loading financials...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Financials & Payouts</h2>

      {/* --- Stat Cards --- */}
      {summary && (
        <div className="stats-grid">
          <StatCard
            title="Total Platform Revenue"
            value={formatCurrency(summary.totalPlatformRevenue)}
            icon="💰"
          />
          <StatCard
            title="Total Owed to Sellers"
            value={formatCurrency(summary.totalOwedToSellers)}
            icon="⏳"
            className="pending"
          />
          <StatCard
            title="Total Paid to Sellers"
            value={formatCurrency(summary.totalPaidOutToSellers)}
            icon="✅"
          />
        </div>
      )}

      {/* --- Seller Payouts Table --- */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Seller Payouts</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.cell}>Seller</th>
                <th style={styles.cell}>Unpaid Earnings</th>
                <th style={styles.cell}>Total Paid</th>
                <th style={styles.cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <React.Fragment key={seller.id}>
                  <tr style={styles.row}>
                    <td style={styles.cell}>{seller.name} ({seller.email})</td>
                    <td style={styles.cell}>{formatCurrency(seller.unpaidEarnings)}</td>
                    <td style={styles.cell}>
                      {formatCurrency(
                        seller.payouts
                          .filter((p) => p.status === 'paid')
                          .reduce((acc, p) => acc + parseFloat(p.amount), 0)
                      )}
                    </td>
                    <td style={{...styles.cell, display: 'flex', gap: '5px'}}>
                      <button
                        style={styles.buttonCreate}
                        disabled={parseFloat(seller.unpaidEarnings) <= 0}
                        onClick={() => handleCreatePayout(seller.id, seller.name)}
                      >
                        Create Payout
                      </button>
                      <button
                        style={styles.buttonEdit}
                        onClick={() => setSelectedSeller(selectedSeller?.id === seller.id ? null : seller)}
                      >
                        {selectedSeller?.id === seller.id ? 'Hide' : 'View'} History
                      </button>
                    </td>
                  </tr>
                  {/* --- Payout History (Collapsible Row) --- */}
                  {selectedSeller?.id === seller.id && (
                    <PayoutHistory
                      payouts={seller.payouts}
                      onMarkPaid={handleMarkAsPaid}
                    />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Sub-component for Payout History ---
function PayoutHistory({ payouts, onMarkPaid }) {
  if (payouts.length === 0) {
    return (
      <tr>
        <td colSpan="4" style={{...styles.cell, textAlign: 'center', background: '#f9f9f9'}}>
          No payout history for this seller.
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td colSpan="4" style={{...styles.cell, background: '#f9f9f9', padding: '20px'}}>
        <h4 style={{...styles.cardTitle, margin: 0, fontSize: '1.1em'}}>Payout History</h4>
        <table style={{...styles.table, marginTop: '10px'}}>
          <thead>
            <tr style={{...styles.headerRow, background: '#555'}}>
              <th style={styles.cell}>Payout ID</th>
              <th style={styles.cell}>Date Created</th>
              <th style={styles.cell}>Amount</th>
              <th style={styles.cell}>Status</th>
              <th style={styles.cell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(payout => (
              <tr key={payout.id}>
                <td style={styles.cell}>{payout.id.substring(0, 8)}...</td>
                <td style={styles.cell}>{new Date(payout.createdAt).toLocaleDateString()}</td>
                <td style={styles.cell}>{formatCurrency(payout.amount)}</td>
                <td style={styles.cell}>
                  <span style={{...styles.badge, ...styles[payout.status]}}>
                    {payout.status}
                  </span>
                </td>
                <td style={styles.cell}>
                  {payout.status === 'pending' && (
                    <button 
                      style={{...styles.buttonCreate, fontSize: '0.9em'}}
                      onClick={() => onMarkPaid(payout.id)}
                    >
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}

// --- Reusable Stat Card Component ---
function StatCard({ title, value, icon, className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p>{title}</p>
        <h3 style={{ wordWrap: 'break-word' }}>{value}</h3>
      </div>
    </div>
  );
}

// --- Styles (using a mix of global and local) ---
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    fontFamily: '"Poppins", sans-serif',
  },
  title: {
    fontSize: '1.8rem',
    color: '#0f35df',
    marginBottom: '20px',
    fontWeight: '600',
  },
  card: {
    background: '#fff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    marginTop: '30px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0f35df',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  tableWrapper: {
    overflowX: 'auto',
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
  paid: {
    backgroundColor: '#28a745',
    color: '#fff',
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
  buttonCreate: {
    background: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  buttonEdit: {
    background: '#0f35df',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default FinancialsPage;