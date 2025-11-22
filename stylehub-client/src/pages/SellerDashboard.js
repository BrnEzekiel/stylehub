import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
// Placeholder imports - these components will be created/adapted later
import RevenueChart from '../components/RevenueChart';
import RecentOrdersTable from '../components/RecentOrdersTable';
import ProductList from '../components/ProductList';
import Page from '../components/Page';

// New components for design
import GlassStatCard from '../components/GlassStatCard';
import ActionCard from '../components/ActionCard';
import { FaStar, FaShoppingCart, FaChartLine, FaBoxOpen, FaPlus, FaTruck, FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa'; // Using react-icons for icons


// Brand colors - must be consistent with other glassmorphism components
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


const formatCurrency = (value) => {
    if (!value) return 'Ksh 0.00';
    const numericValue = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericValue)) return value;
  
    if (numericValue >= 1000000) {
      return `Ksh ${(numericValue / 1000000).toFixed(1)}M`;
    }
    if (numericValue >= 1000) {
      return `Ksh ${(numericValue / 1000).toFixed(1)}K`;
    }
    return `Ksh ${numericValue.toFixed(2)}`;
  };
  
  const SellerDashboard = () => {
  const { user } = useAuth();

  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });
  const [recentActivities, setRecentActivities] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months'); // Default period for chart
  const [chartType, setChartType] = useState('line'); // Default chart type

  const fetchRevenueDataForPeriod = async (period) => {
    try {
      // Assuming a new API endpoint or a modified existing one
      const response = await apiClient.get(`/stats/seller-revenue?period=${period}`);
      setRevenueData(response.data);
    } catch (error) {
      console.error(`Error fetching revenue data for ${period}:`, error);
      // Optionally set empty data or error state for the chart
      setRevenueData({ labels: [], datasets: [] });
    }
  };

  useEffect(() => {
    const getGreetingInfo = () => {
      const currentHour = new Date().getHours();
      let newGreeting = '';
      if (currentHour < 6) {
        newGreeting = 'Good night';
      } else if (currentHour < 10) {
        newGreeting = 'Good morning';
      } else if (currentHour < 12) {
        newGreeting = 'Good mid-morning';
      } else if (currentHour < 18) {
        newGreeting = 'Good afternoon';
      } else {
        newGreeting = 'Good evening';
      }
      setGreeting(newGreeting);
    };

    getGreetingInfo();

    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/stats/seller-dashboard');
        // Assuming the API returns 'activities' which is an array of recent events
        const { stats, recentOrders: activities, products } = response.data;
        setStats(stats);
        setRecentActivities(activities);
        setProducts(products);
      } catch (error) {
        console.error('Error fetching seller dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
    fetchRevenueDataForPeriod(selectedPeriod); // Initial fetch for revenue chart

  }, [user, selectedPeriod]); // Re-fetch when selectedPeriod changes

  // Loading state with animation
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '4px solid rgba(255, 255, 255, 0.2)',
          borderTop: `4px solid ${COLORS.yellow}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  // Find total products, total orders, total revenue from stats array
  const totalProductsStat = stats.find(stat => stat.title === 'Total Products');
  const totalOrdersStat = stats.find(stat => stat.title === 'Total Orders');
  const totalRevenueStat = stats.find(stat => stat.title === 'Total Revenue');
  
  // Example for pending orders - Assuming the API returns this
  const pendingOrdersCount = recentActivities.filter(order => order.status === 'pending').length;

  return (
    <Page title="SELLER DASHBOARD">
      <div style={{
        fontSize: 'clamp(22px, 5vw, 36px)',
        fontWeight: '900',
        color: COLORS.white,
        lineHeight: '1.1',
      }}>
        {greeting}, <span style={{color: 'lightgreen'}}>{user?.username || 'Seller'}</span>!
      </div>
      <div style={{
        fontSize: 'clamp(14px, 2.5vw, 17px)',
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '600',
        marginBottom: '32px'
      }}>
        Here's what's happening with your store today
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 'clamp(16px, 3vw, 24px)',
        marginBottom: 'clamp(24px, 4vw, 32px)'
      }}>
        <GlassStatCard
          title={totalRevenueStat?.title || 'Total Revenue'}
          value={formatCurrency(totalRevenueStat?.value)}
          growth={totalRevenueStat?.growth}
          icon={FaChartLine}
          linkTo="/seller/wallet"
          gradient={`linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`}
          delay={0.1}
        />
        <GlassStatCard
          title={totalProductsStat?.title || 'Total Products'}
          value={totalProductsStat?.value || '0'}
          growth={totalProductsStat?.growth}
          icon={FaBoxOpen}
          linkTo="/products"
          gradient={`linear-gradient(135deg, ${COLORS.skyBlue} 0%, ${COLORS.yellow} 100%)`}
          delay={0.2}
        />
        <GlassStatCard
          title={totalOrdersStat?.title || 'Total Orders'}
          value={totalOrdersStat?.value || '0'}
          growth={totalOrdersStat?.growth}
          icon={FaShoppingCart}
          linkTo="/seller/orders"
          gradient={`linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.black} 100%)`}
          delay={0.3}
        />
      </div>

      {/* Action Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
        gap: 'clamp(16px, 3vw, 24px)',
        marginBottom: 'clamp(24px, 4vw, 32px)'
      }}>
        <ActionCard
          title="Add New Product"
          icon={FaPlus}
          linkTo="/create-product"
          gradient={`linear-gradient(135deg, ${COLORS.yellow} 0%, ${COLORS.skyBlue} 100%)`}
          delay={0.4}
        />
        <ActionCard
          title="Manage Orders"
          icon={FaTruck}
          linkTo="/seller/orders"
          gradient={`linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`}
          delay={0.5}
        />
        <ActionCard
          title="Verification Hub"
          icon={FaCheckCircle}
          linkTo="/verification-hub"
          gradient={`linear-gradient(135deg, ${COLORS.skyBlue} 0%, ${COLORS.blue} 100%)`}
          delay={0.6}
        />
      </div>

      {/* Revenue Chart */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        border: '2px solid rgba(255, 255, 255, 0.12)',
        animation: 'slideUp 0.6s ease-out 0.7s both',
        marginBottom: 'clamp(24px, 4vw, 32px)'
      }}>
        <h2 style={{
          fontSize: 'clamp(22px, 4vw, 30px)',
          fontWeight: '900',
          color: COLORS.white,
          marginBottom: '24px',
        }}>Revenue Overview</h2>

        {/* Period Selection Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          {['1day', '1week', '1month', '6months', '1year'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                background: selectedPeriod === period ? `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)` : 'rgba(255, 255, 255, 0.1)',
                color: COLORS.white,
                padding: '8px 15px',
                borderRadius: '12px',
                border: `1px solid ${selectedPeriod === period ? COLORS.blue : 'rgba(255, 255, 255, 0.2)'}`,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedPeriod === period ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
              }}
            >
              {period.replace('1', '1 ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Chart Type Selection Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          {['line', 'bar'].map(type => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              style={{
                background: chartType === type ? `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.blue} 100%)` : 'rgba(255, 255, 255, 0.1)',
                color: COLORS.white,
                padding: '8px 15px',
                borderRadius: '12px',
                border: `1px solid ${chartType === type ? COLORS.green : 'rgba(255, 255, 255, 0.2)'}`,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: chartType === type ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        <RevenueChart data={revenueData} chartType={chartType} />
      </div>
      {/* Recent Activity */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        border: '2px solid rgba(255, 255, 255, 0.12)',
        animation: 'slideUp 0.6s ease-out 0.7s both'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'clamp(24px, 4vw, 32px)',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: '900',
              color: COLORS.white,
              marginBottom: '8px',
            }}>
              Recent Activity
            </div>
            <div style={{
              fontSize: 'clamp(13px, 2vw, 15px)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '600'
            }}>
              Latest updates from your store (orders, views, reviews, and more will appear here)
            </div>
          </div>
          {pendingOrdersCount > 0 && (
            <div style={{
              padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 22px)',
              borderRadius: '18px',
              background: 'rgba(239, 68, 68, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              color: COLORS.red,
              fontSize: 'clamp(13px, 2vw, 15px)',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'pulse 2s ease-in-out infinite',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}>
              <FaExclamationCircle size={20} />
              {pendingOrdersCount} pending orders
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
          {recentActivities.map((activity, index) => (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'clamp(16px, 3vw, 22px)',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                animation: `slideUp 0.4s ease-out ${0.8 + index * 0.1}s both`,
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 16px)', flex: '1 1 200px' }}>
                <div style={{
                  width: 'clamp(48px, 8vw, 56px)',
                  height: 'clamp(48px, 8vw, 56px)',
                  borderRadius: '18px',
                  background: activity.status === 'pending' ? `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)` :
                             activity.status === 'paid' ? `linear-gradient(135deg, ${COLORS.yellow} 0%, ${COLORS.skyBlue} 100%)` :
                             `linear-gradient(135deg, ${COLORS.skyBlue} 0%, ${COLORS.blue} 100%)`, // Default for other statuses
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}>
                  {activity.status === 'pending' && <FaShoppingCart size={24} color={COLORS.white} strokeWidth={2.5} />}
                  {activity.status === 'paid' && <FaChartLine size={24} color={COLORS.white} strokeWidth={2.5} />}
                  {(activity.status !== 'pending' && activity.status !== 'paid') && <FaBoxOpen size={24} color={COLORS.white} strokeWidth={2.5} />}
                </div>
                <div>
                  <div style={{
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    fontWeight: '800',
                    color: COLORS.white,
                    marginBottom: '6px',
                  }}>
                    Order {activity.id} - {activity.status}
                  </div>
                  <div style={{
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <FaClock size={14} />
                    {/* Assuming activity object has a timestamp */}
                    {/* For now, just a placeholder or you can add `activity.time` if available from backend */}
                    {`Customer: ${activity.customer}`}
                  </div>
                </div>
              </div>
              {activity.amount && (
                <div style={{
                  fontSize: 'clamp(15px, 2.5vw, 18px)',
                  fontWeight: '900',
                  color: COLORS.green,
                  padding: 'clamp(8px, 2vw, 12px) clamp(14px, 3vw, 18px)',
                  borderRadius: '16px',
                  background: 'rgba(0, 255, 0, 0.2)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '2px solid rgba(0, 255, 0, 0.5)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}>
                  {formatCurrency(activity.amount)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* My Products List */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        border: '2px solid rgba(255, 255, 255, 0.12)',
        animation: 'slideUp 0.6s ease-out 0.9s both',
        marginTop: 'clamp(24px, 4vw, 32px)'
      }}>
        <h2 style={{
          fontSize: 'clamp(22px, 4vw, 30px)',
          fontWeight: '900',
          color: COLORS.white,
          marginBottom: '24px',
        }}>My Products</h2>
        <ProductList products={products} />
      </div>
    </Page>
  );
};

export default SellerDashboard;