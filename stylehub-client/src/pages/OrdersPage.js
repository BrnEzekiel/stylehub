// src/pages/OrdersPage.js
import React, { useState, useEffect } from 'react';
import { fetchClientOrders, downloadOrderReceipt } from '../api/orderService';
import { getClientBookings, cancelBooking } from '../api/serviceService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Box, Typography, Paper, CircularProgress, Container, ToggleButtonGroup, ToggleButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, useMediaQuery, useTheme, Chip
} from '@mui/material';
import { Download, Close, ShoppingBag, CalendarMonth } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency
import OrderCard from '../components/OrderCard';
import BookingCard from '../components/BookingCard';

const OrdersTable = ({ orders, onDownload, isDownloading }) => (
    <TableContainer component={Paper} sx={{...paperSx, p: 2}}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id} hover>
                        <TableCell><Typography variant="body2" fontFamily="monospace">{(order.id || '').slice(0,10)}…</Typography></TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{(order.items || []).length} item(s)</TableCell>
                        <TableCell align="right"><Typography sx={{fontWeight: 'bold'}}>{formatCurrency(order.totalAmount)}</Typography></TableCell>
                        <TableCell align="center"><Chip label={order.status} size="small" /></TableCell>
                        <TableCell align="right">
                            <Button size="small" startIcon={<Download />} onClick={() => onDownload(order.id)} disabled={isDownloading === order.id}>Receipt</Button>
                            <Button size="small" component={Link} to={`/orders/${order.id}`} sx={{ml: 1}}>Details</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

const BookingsTable = ({ bookings, onCancel, isCancelling }) => (
     <TableContainer component={Paper} sx={{...paperSx, p: 2}}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Booking</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>When</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {bookings.map((b) => (
                    <TableRow key={b.id} hover>
                        <TableCell><Typography variant="body2" fontFamily="monospace">{(b.id || '').slice(0,10)}…</Typography></TableCell>
                        <TableCell>{b.service?.title || 'Service'}</TableCell>
                        <TableCell>{new Date(b.startTime).toLocaleString()}</TableCell>
                        <TableCell align="right"><Typography sx={{fontWeight: 'bold'}}>{formatCurrency(b.price)}</Typography></TableCell>
                        <TableCell align="center"><Chip label={b.status} size="small" /></TableCell>
                        <TableCell align="right">
                            {(b.status === 'pending' || b.status === 'confirmed') && <Button size="small" color="error" startIcon={<Close />} onClick={() => onCancel(b.id)} disabled={isCancelling === b.id}>Cancel</Button>}
                            <Button size="small" component={Link} to={`/bookings/${b.id}`} sx={{ml: 1}}>Details</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);


function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const { token } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, bookingsData] = await Promise.all([ fetchClientOrders(), getClientBookings() ]);
      setOrders(ordersData || []);
      setBookings(bookingsData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Could not load your orders and bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (orderId) => {
    setDownloading(orderId);
    try { await downloadOrderReceipt(orderId); } catch (err) { alert(`Failed to download receipt: ${err.message}`); } finally { setDownloading(null); }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      const bookingsData = await getClientBookings();
      setBookings(bookingsData || []);
      alert('Booking cancelled successfully.');
    } catch (err) {
      alert(`Failed to cancel booking: ${err.message}`);
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading your history...</Typography>
        </Box>
    );
  }

  if (error) { return <Box sx={pageSx}><Typography color="error">{error}</Typography></Box>; }

  const showOrders = activeTab === 'all' || activeTab === 'orders';
  const showBookings = activeTab === 'all' || activeTab === 'bookings';

  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 2}}>Orders & Bookings</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">Total: {(orders?.length || 0) + (bookings?.length || 0)}</Typography>
          <ToggleButtonGroup value={activeTab} exclusive onChange={(e, newTab) => newTab && setActiveTab(newTab)} size="small">
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="orders"><ShoppingBag sx={{mr: 1, fontSize: 16}}/>Orders</ToggleButton>
            <ToggleButton value="bookings"><CalendarMonth sx={{mr: 1, fontSize: 16}}/>Bookings</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {isMobile ? (
            <>
                {showOrders && orders.map(o => <OrderCard key={o.id} order={o} onDownload={handleDownload} isDownloading={downloading === o.id} />)}
                {showBookings && bookings.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancelBooking} isCancelling={cancelling === b.id} />)}
            </>
        ) : (
            <>
                {showOrders && orders.length > 0 && <Box sx={{mb:3}}><OrdersTable orders={orders} onDownload={handleDownload} isDownloading={downloading} /></Box>}
                {showBookings && bookings.length > 0 && <BookingsTable bookings={bookings} onCancel={handleCancelBooking} isCancelling={cancelling} />}
            </>
        )}

        {((!showOrders || (orders?.length || 0) === 0) && (!showBookings || (bookings?.length || 0) === 0)) && (
          <Paper sx={{...paperSx, p: 4, textAlign: 'center'}}>
            <Typography variant="h6">No items to show in this view.</Typography>
            <Box sx={{mt: 2, display: 'flex', justifyContent: 'center', gap: 2}}>
                <Button component={Link} to="/products" variant="contained" sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>Browse Products</Button>
                <Button component={Link} to="/services" variant="outlined">Browse Services</Button>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default OrdersPage;
