
import React, { useState, useEffect } from 'react';
import {
  getFinancialSummary,
  getSellerPayoutSummaries,
  createPayout,
  markPayoutAsPaid,
} from '../api/adminService';
import Page from '../components/Page';
import GlassStatCard from '../components/GlassStatCard';
import { FaMoneyBillWave, FaClock, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

function formatCurrency(num) {
  const number = parseFloat(num);
  if (isNaN(number)) return 'Ksh 0.00';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KSH',
  }).format(number);
}

function PayoutHistory({ payouts, onMarkPaid, COLORS }) {
  if (payouts.length === 0) {
    return (
      <tr>
        <td colSpan="5" style={{ textAlign: 'center', padding: '16px' }}>
          No payout history for this seller.
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td colSpan="5" style={{ padding: 0, border: 'none' }}>
        <div style={{ margin: '8px', borderRadius: '16px', padding: '16px', background: 'rgba(0,0,0,0.2)' }}>
          <h3 style={{ marginBottom: '16px', color: COLORS.white }}>Payout History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${COLORS.skyBlue}` }}>Payout ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${COLORS.skyBlue}` }}>Date Created</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: `1px solid ${COLORS.skyBlue}` }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${COLORS.skyBlue}` }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${COLORS.skyBlue}` }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id}>
                  <td style={{ padding: '12px' }}>{payout.id.substring(0, 8)}...</td>
                  <td style={{ padding: '12px' }}>{new Date(payout.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(payout.amount)}</td>
                  <td style={{ padding: '12px' }}>{payout.status}</td>
                  <td style={{ padding: '12px' }}>
                    {payout.status === 'pending' && (
                      <button
                        onClick={() => onMarkPaid(payout.id)}
                        style={{ background: COLORS.green, color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
}

function FinancialsPage() {
  const [summary, setSummary] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);

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

  const handleCreatePayout = async (sellerId, sellerName) => {
    if (!window.confirm(`Create payout for all of ${sellerName}'s unpaid items?`)) {
      return;
    }
    try {
      await createPayout(sellerId);
      alert('Payout created successfully! It is now pending payment.');
      loadData();
      setSelectedSeller(null);
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
      loadData();
      setSelectedSeller(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
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
        <h1 style={{ marginLeft: '20px' }}>Loading Financials...</h1>
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
    <Page title="Financials & Payouts">
      {summary && (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(16px, 3vw, 24px)',
            marginBottom: 'clamp(24px, 4vw, 32px)'
        }}>
          <GlassStatCard
            title="Total Platform Revenue"
            value={formatCurrency(summary.totalPlatformRevenue)}
            icon={FaMoneyBillWave}
            gradient={`linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`}
            delay={0.1}
          />
          <GlassStatCard
            title="Total Owed to Sellers"
            value={formatCurrency(summary.totalOwedToSellers)}
            icon={FaClock}
            gradient={`linear-gradient(135deg, ${COLORS.yellow} 0%, ${COLORS.red} 100%)`}
            delay={0.2}
          />
          <GlassStatCard
            title="Total Paid to Sellers"
            value={formatCurrency(summary.totalPaidOutToSellers)}
            icon={FaCheckCircle}
            gradient={`linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.skyBlue} 100%)`}
            delay={0.3}
          />
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        border: '2px solid rgba(255, 255, 255, 0.12)',
      }}>
        <h2 style={{color: 'white', marginBottom: '24px'}}>Seller Payouts</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Seller</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Unpaid Earnings</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Total Paid</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <React.Fragment key={seller.id}>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <td style={{ padding: '16px' }}>
                    <div>{seller.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{seller.email}</div>
                  </td>
                  <td style={{ padding: '16px' }}>{formatCurrency(seller.unpaidEarnings)}</td>
                  <td style={{ padding: '16px' }}>
                    {formatCurrency(
                      seller.payouts
                        .filter((p) => p.status === 'paid')
                        .reduce((acc, p) => acc + parseFloat(p.amount), 0)
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button
                      disabled={parseFloat(seller.unpaidEarnings) <= 0}
                      onClick={() => handleCreatePayout(seller.id, seller.name)}
                      style={{ background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`, color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px' }}
                    >
                      Create Payout
                    </button>
                    <button
                      onClick={() => setSelectedSeller(selectedSeller?.id === seller.id ? null : seller)}
                      style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      {selectedSeller?.id === seller.id ? <FaChevronUp/> : <FaChevronDown/>} History
                    </button>
                  </td>
                </tr>
                {selectedSeller?.id === seller.id && (
                  <PayoutHistory
                    payouts={seller.payouts}
                    onMarkPaid={handleMarkAsPaid}
                    COLORS={COLORS}
                  />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

export default FinancialsPage;

