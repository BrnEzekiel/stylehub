// src/pages/ClientWalletPage.js
import React, { useState, useEffect } from 'react';
import { getWalletDetails } from '../api/walletService';

function ClientWalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <p className="admin-content">Loading...</p>;
  if (error) return <p className="admin-content" style={{color:'red'}}>Error: {error}</p>;

  return (
    <div className="admin-content">
      <h2>My Wallet</h2>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Balance: Ksh {parseFloat(wallet.walletBalance).toFixed(2)}</h3>
        <p style={{ color: '#666', fontSize: '0.9em' }}>
          💡 Note: Wallet funding is not yet available. Bookings are currently free for testing.
        </p>
      </div>

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
  );
}

export default ClientWalletPage;