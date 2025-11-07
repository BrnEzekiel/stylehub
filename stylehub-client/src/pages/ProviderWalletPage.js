// src/pages/ProviderWalletPage.js
import React, { useState, useEffect } from 'react';
import { getWalletDetails, requestWithdrawal } from '../api/walletService';

function ProviderWalletPage() {
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
      const data = await getWalletDetails();
      setWallet(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWallet(); }, []);

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
      loadWallet();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <p className="admin-content">Loading...</p>;
  if (error) return <p className="admin-content" style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="admin-content">
      <h2>My Wallet</h2>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Balance: Ksh {parseFloat(wallet.walletBalance).toFixed(2)}</h3>
        <p style={{ color: '#666', fontSize: '0.9em' }}>
          💡 You can request a withdrawal to your M-Pesa number.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Withdrawal Form */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Request Withdrawal</h3>
          <form onSubmit={handleWithdrawal}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Amount (Ksh)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 500"
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>M-Pesa Number</label>
              <input
                type="tel"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                placeholder="e.g., 0712345678"
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            {formError && <p style={{ color: 'red', fontSize: '0.9em' }}>{formError}</p>}
            {formSuccess && <p style={{ color: '#28a745', fontSize: '0.9em' }}>{formSuccess}</p>}
            <button
              type="submit"
              disabled={formLoading}
              style={{
                width: '100%',
                padding: '10px',
                background: '#0f35df',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontWeight: '600',
              }}
            >
              {formLoading ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Transaction History</h3>
          {wallet.walletTransactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {wallet.walletTransactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td>{tx.description}</td>
                    <td style={{ color: tx.type === 'credit' ? 'green' : 'red' }}>
                      {parseFloat(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProviderWalletPage;