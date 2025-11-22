// src/pages/ProviderWalletPage.js
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
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency

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

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading Wallet...</Typography>
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

  return (
    <Box sx={pageSx}>
      <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 3}}>My Wallet</Typography>
      <Paper sx={{ ...paperSx, p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK}}>Balance</Typography>
        <Typography variant="h3" sx={{fontWeight: 'bold', color: COLOR_PRIMARY_BLUE, my: 1}}>
          {formatCurrency(wallet.walletBalance)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          💡 You can request a withdrawal to your M-Pesa number.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Withdrawal Form */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ ...paperSx, p: 3 }}>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Request Withdrawal</Typography>
            <Box component="form" onSubmit={handleWithdrawal}>
              <TextField
                fullWidth
                label="Amount (Ksh)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 500"
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="M-Pesa Number"
                type="tel"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                placeholder="e.g., 0712345678"
                sx={{ mb: 2 }}
                required
              />
              {formError && <Typography color="error" sx={{ mb: 1 }}>{formError}</Typography>}
              {formSuccess && <Typography color="success.main" sx={{ mb: 1 }}>{formSuccess}</Typography>}
              <Button
                type="submit"
                disabled={formLoading}
                fullWidth
                variant="contained"
                sx={{ backgroundColor: COLOR_PRIMARY_BLUE }}
              >
                {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Request Withdrawal'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Transaction History */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ ...paperSx, p: 3 }}>
            <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Transaction History</Typography>
            {wallet.walletTransactions.length === 0 ? (
              <Typography>No transactions yet.</Typography>
            ) : (
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
                    {wallet.walletTransactions.map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                                            <TableCell align="right" sx={{ color: tx.type === 'credit' ? 'green' : 'red', fontWeight: 'bold' }}>
                                              {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount)}
                                            </TableCell>                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProviderWalletPage;