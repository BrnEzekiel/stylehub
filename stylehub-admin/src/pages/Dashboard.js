
import React, { useState, useEffect, useCallback } from 'react';
import {
    getAdminStats, getRecentOrders, getAllUsers, getPendingSubmissions, getPendingVerifications, getPendingProviderPortfolios, getWithdrawalRequests
} from '../api/adminService';
import Page from '../components/Page';
import GlassStatCard from '../components/GlassStatCard';
import ActionCard from '../components/ActionCard';
import { FaMoneyBillWave, FaUsers, FaBoxOpen, FaUserCheck, FaUserShield, FaWallet, FaPlus, FaTasks, FaClipboardList } from 'react-icons/fa';

// --- HELPER FUNCTIONS ---
function formatCurrency(num) {
    const number = parseFloat(num);
    if (isNaN(number)) return 'Ksh 0.00';

    if (number < 1000) {
        return `Ksh ${number.toFixed(2)}`;
    } else if (number < 1000000) {
        return `Ksh ${(number / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    } else if (number < 1000000000) {
        return `Ksh ${(number / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    } else {
        return `Ksh ${(number / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
    }
}

function formatCount(num) {
    if (num === null || num === undefined) return '0';
    const number = parseInt(num);
    if (number < 1000) return number.toString();
    if (number < 1000000) return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    if (number < 1000000000) return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
}
// --- END HELPER FUNCTIONS ---

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingVerifications, setPendingVerifications] = useState(0);
    const [pendingProviderPortfolios, setPendingProviderPortfolios] = useState(0);
    const [withdrawalRequests, setWithdrawalRequests] = useState(0);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsData, kycData, verificationsData, portfoliosData, withdrawalsData] = await Promise.all([
                getAdminStats(),
                getPendingSubmissions(),
                getPendingVerifications(),
                getPendingProviderPortfolios(),
                getWithdrawalRequests(),
            ]);

            setStats({
                ...statsData,
                pendingKYC: kycData.length
            });

            setPendingVerifications(verificationsData.length);
            setPendingProviderPortfolios(portfoliosData.length);
            setWithdrawalRequests(withdrawalsData.length);

        } catch (err) {
            setError('Failed to load dashboard data. Check API endpoints.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

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
                <h1 style={{ marginLeft: '20px' }}>Loading Dashboard...</h1>
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

    const safeStats = stats || { totalRevenue: 0, totalUsers: 0, totalProducts: 0, pendingKYC: 0 };
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
        <Page title="Admin Control Center">
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: 'clamp(16px, 3vw, 24px)',
                marginBottom: 'clamp(24px, 4vw, 32px)'
            }}>
                <GlassStatCard
                    title="Total Revenue"
                    value={formatCurrency(safeStats.totalRevenue)}
                    icon={FaMoneyBillWave}
                    linkTo="/financials"
                    gradient={`linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`}
                    delay={0.1}
                />
                <GlassStatCard
                    title="Total Users"
                    value={formatCount(safeStats.totalUsers)}
                    icon={FaUsers}
                    linkTo="/users"
                    gradient={`linear-gradient(135deg, ${COLORS.skyBlue} 0%, ${COLORS.yellow} 100%)`}
                    delay={0.2}
                />
                <GlassStatCard
                    title="Total Products"
                    value={formatCount(safeStats.totalProducts)}
                    icon={FaBoxOpen}
                    linkTo="/products"
                    gradient={`linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.black} 100%)`}
                    delay={0.3}
                />
                <GlassStatCard
                    title="Pending KYC"
                    value={formatCount(safeStats.pendingKYC)}
                    icon={FaUserCheck}
                    linkTo="/kyc"
                    gradient={`linear-gradient(135deg, ${COLORS.yellow} 0%, ${COLORS.red} 100%)`}
                    delay={0.4}
                />
                <GlassStatCard
                    title="Pending Verifications"
                    value={formatCount(pendingVerifications)}
                    icon={FaUserShield}
                    linkTo="/verifications"
                    gradient={`linear-gradient(135deg, ${COLORS.red} 0%, ${COLORS.magenta} 100%)`}
                    delay={0.5}
                />
                <GlassStatCard
                    title="Pending Provider Portfolios"
                    value={formatCount(pendingProviderPortfolios)}
                    icon={FaClipboardList}
                    linkTo="/portfolios"
                    gradient={`linear-gradient(135deg, ${COLORS.magenta} 0%, ${COLORS.blue} 100%)`}
                    delay={0.6}
                />
                <GlassStatCard
                    title="Withdrawal Requests"
                    value={formatCount(withdrawalRequests)}
                    icon={FaWallet}
                    linkTo="/withdrawals"
                    gradient={`linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.skyBlue} 100%)`}
                    delay={0.7}
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                gap: 'clamp(16px, 3vw, 24px)',
                marginBottom: 'clamp(24px, 4vw, 32px)'
            }}>
                <ActionCard
                    title="Create User"
                    icon={FaPlus}
                    linkTo="/users/create"
                    gradient={`linear-gradient(135deg, ${COLORS.yellow} 0%, ${COLORS.skyBlue} 100%)`}
                    delay={0.4}
                />
                <ActionCard
                    title="Create Product"
                    icon={FaPlus}
                    linkTo="/products/create"
                    gradient={`linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`}
                    delay={0.5}
                />
                <ActionCard
                    title="Create Service"
                    icon={FaPlus}
                    linkTo="/services/create"
                    gradient={`linear-gradient(135deg, ${COLORS.skyBlue} 0%, ${COLORS.blue} 100%)`}
                    delay={0.6}
                />
                 <ActionCard
                    title="Order Management"
                    icon={FaTasks}
                    linkTo="/orders"
                    gradient={`linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.blue} 100%)`}
                    delay={0.7}
                />
            </div>
        </Page>
    );
}
