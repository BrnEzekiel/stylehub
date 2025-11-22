// src/pages/SellerWalletPage.js

import React, { useState, useEffect } from 'react';
import { getWalletDetails, requestWithdrawal } from '../api/walletService';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  TextField,
  Grid,
  Container
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import StatCard from '../components/StatCard';
import { formatCurrency } from '../utils/styleUtils';

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

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading your wallet...</Typography>
        </Box>
    );
  }
  if (error) {
      return (
          <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography color="error" variant="h6">Error: {error}</Typography>
          </Box>
      );
  }
  if (!wallet) return <Box sx={pageSx}><Typography>Could not load wallet details.</Typography></Box>;


  return (
    <Box sx={pageSx}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 3}}>My Earnings & Wallet</Typography>

        {/* --- Stat Cards --- */}
        <Grid container spacing={3} sx={{mb: 4}}>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard
                title="Available Balance"
                value={formatCurrency(wallet.walletBalance)}
                icon="💰"
                />
            </Grid>
        </Grid>

        <Grid container spacing={3}>
            {/* --- Withdrawal Form --- */}
            <Grid item xs={12} md={4}>
                <Paper sx={paperSx}>
                    <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Request Withdrawal</Typography>
                    <Typography color="text.secondary" sx={{mb: 2}}>Request a payout to your M-Pesa. Requests are processed by an admin.</Typography>
                    <Box component="form" onSubmit={handleWithdrawal}>
                        <TextField
                            fullWidth
                            label="Amount (Ksh)"
                            type="number"
                            placeholder="e.g., 5000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="M-Pesa Phone Number"
                            type="tel"
                            placeholder="e.g., 0712345678"
                            value={mpesaNumber}
                            onChange={(e) => setMpesaNumber(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />
                        
                        {formError && <Typography color="error" sx={{ mb: 1 }}>{formError}</Typography>}
                        {formSuccess && <Typography color="success.main" sx={{ mb: 1 }}>{formSuccess}</Typography>}

                        <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: COLOR_PRIMARY_BLUE }} disabled={formLoading}>
                            {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Request Withdrawal'}
                        </Button>
                    </Box>
                </Paper>
            </Grid>

            {/* --- Transaction History (Receipts) --- */}
            <Grid item xs={12} md={8}>
                <Paper sx={paperSx}>
                    <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Transaction History</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {wallet.walletTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ textAlign: 'center' }}>
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    wallet.walletTransactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{tx.description}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: tx.type === 'credit' ? 'green' : 'red' }}>
                                            {tx.type === 'credit' ? '+' : '-'} Ksh {parseFloat(tx.amount).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default SellerWalletPage;