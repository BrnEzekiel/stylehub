// src/pages/ClientWalletPage.js
import React, { useState, useEffect } from 'react';
import { getWalletDetails } from '../api/walletService';
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
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';
import { formatCurrency } from '../utils/styleUtils'; // Import formatCurrency

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
          💡 Note: Wallet funding is not yet available. Bookings are currently free for testing.
        </Typography>
      </Paper>

      <Paper sx={{...paperSx, p: 3}}>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

export default ClientWalletPage;