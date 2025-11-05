// src/pages/SellerWalletPage.js

import React, { useState, useEffect } from 'react';
import { getWalletDetails, requestWithdrawal } from '../api/walletService';

// --- Helper to format currency ---
function formatCurrency(num) {
  const number = parseFloat(num);
  if (isNaN(number)) return 'Ksh 0.00';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KSH',
  }).format(number);
}

// --- Main Page Component ---
function SellerWalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [amount, setAmount] = useState('');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadWallet = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getWalletDetails();
      setWallet(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Please enter a valid amount.');
      }
      if (numericAmount < 100) {
        throw new Error('Minimum withdrawal amount is Ksh 100.');
      }
      if (numericAmount > wallet.walletBalance) {
        throw new Error('Insufficient funds.');
      }

      await requestWithdrawal({ amount: numericAmount, mpesaNumber });
      setFormSuccess('Withdrawal request successful! It will be processed by an admin.');
      setAmount('');
      setMpesaNumber('');
      loadWallet(); // Refresh wallet
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <p style={styles.loading}>Loading your wallet...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;
  if (!wallet) return <p>Could not load wallet details.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Earnings & Wallet</h2>

      {/* --- Stat Cards --- */}
      <div className="stats-grid">
        <StatCard
          title="Available Balance"
          value={formatCurrency(wallet.walletBalance)}
          icon="💰"
          className="balance"
        />
      </div>

      <div style={styles.grid}>
        {/* --- Withdrawal Form --- */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Request Withdrawal</h3>
          <p>Request a payout to your M-Pesa. Requests are processed by an admin.</p>
          <form onSubmit={handleWithdrawal}>
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="amount">Amount (Ksh)</label>
              <input
                style={styles.input}
                type="number"
                id="amount"
                placeholder="e.g., 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="mpesaNumber">M-Pesa Phone Number</label>
              <input
                style={styles.input}
                type="tel"
                id="mpesaNumber"
                placeholder="e.g., 0712345678"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                required
              />
            </div>
            
            {formError && <p style={styles.error}>{formError}</p>}
            {formSuccess && <p style={styles.success}>{formSuccess}</p>}

            <button type="submit" style={styles.button} disabled={formLoading}>
              {formLoading ? 'Submitting...' : 'Request Withdrawal'}
            </button>
          </form>
        </div>

        {/* --- Transaction History (Receipts) --- */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Transaction History</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.cell}>Date</th>
                  <th style={styles.cell}>Description</th>
                  <th style={styles.cell}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {wallet.walletTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{...styles.cell, textAlign: 'center'}}>
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  wallet.walletTransactions.map((tx) => (
                    <tr key={tx.id} style={styles.row}>
                      <td style={styles.cell}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td style={styles.cell}>{tx.description}</td>
                      <td style={{
                        ...styles.cell, 
                        fontWeight: '600',
                        color: tx.type === 'credit' ? '#15803d' : '#991b1b'
                      }}>
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Reusable Stat Card Component ---
function StatCard({ title, value, icon, className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p>{title}</p>
        <h3 style={{ wordWrap: 'break-word', fontSize: '2.5rem' }}>{value}</h3>
      </div>
    </div>
  );
}

// --- Styles ---
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  title: {
    fontSize: '1.8rem',
    color: '#0f35df',
    marginBottom: '20px',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    background: '#fff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0f35df',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '1em',
    backgroundColor: '#0f35df',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  tableWrapper: {
    overflowX: 'auto',
    maxHeight: '400px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
  },
  headerRow: {
    backgroundColor: '#0f35df',
    color: '#fff',
    position: 'sticky',
    top: 0,
  },
  cell: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  row: {
    transition: 'background 0.2s ease',
  },
  loading: {
    textAlign: 'center',
    color: '#0f35df',
    fontWeight: '500',
  },
  error: {
    color: '#dc3545',
    marginBottom: '10px',
  },
  success: {
    color: '#28a745',
    marginBottom: '10px',
  },
};

export default SellerWalletPage;