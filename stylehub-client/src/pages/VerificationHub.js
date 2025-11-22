import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getKYCStatus } from '../api/kycService';
import { getPortfolioStatus } from '../api/portfolioService';
import { getVerificationStatus } from '../api/verificationService';

import { useAuth } from '../context/AuthContext'; // Import useAuth
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, Chip, Container
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

const VerificationHub = () => {
  const [kycStatus, setKycStatus] = useState(null);
  const [portfolioStatus, setPortfolioStatus] = useState(null);
  const [sellerVerificationStatus, setSellerVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth(); // Get user and authLoading from context

  useEffect(() => {
    if (authLoading || !user) {
      // Wait for user to be loaded from AuthContext
      return;
    }

    const fetchStatus = async () => {
      setLoading(true);
      const statuses = {};

      // Fetch KYC status for all roles
      try {
        let kyc = await getKYCStatus();
        // Similar heuristic for KYC
        if (kyc && kyc.status === 'pending' && !kyc.submissionId && !kyc.submittedAt) {
          kyc.status = 'unverified';
        }
        statuses.kyc = kyc;
      } catch (error) {
        console.error('Error fetching KYC status:', error);
        statuses.kyc = { status: 'error' };
      }

      // Fetch Portfolio status only for service_provider
      if (user.role === 'service_provider') {
        try {
          const portfolio = await getPortfolioStatus();
          statuses.portfolio = portfolio;
        } catch (error) {
          console.error('Error fetching Portfolio status:', error);
          statuses.portfolio = { status: 'error' };
        }
      }

      // Fetch Seller Verification status only for seller
      if (user.role === 'seller') {
        try {
          let sellerVerification = await getVerificationStatus();

          // Heuristic: If status is 'pending' but no submission record exists,
          // treat it as 'unverified' from the user's perspective.
          if (sellerVerification && sellerVerification.status === 'pending' && (!sellerVerification.submission || !sellerVerification.submission.id)) {
              sellerVerification.status = 'unverified';
          }
          statuses.sellerVerification = sellerVerification;
        } catch (error) {
          console.error('Error fetching Seller Verification status:', error);
          statuses.sellerVerification = { status: 'error' };
        }
      }

      setKycStatus(statuses.kyc);
      setPortfolioStatus(statuses.portfolio);
      setSellerVerificationStatus(statuses.sellerVerification);
      setLoading(false);
    };

    fetchStatus();
  }, [user, authLoading]); // Re-run effect when user or authLoading changes

  const renderStatusChip = (statusObj) => {
    if (!statusObj || !statusObj.status || statusObj.status === 'unverified' || statusObj.status === 'not_submitted' || statusObj.status === 'UNVERIFIED') {
      return <Chip label="Not Submitted" color="default" size="small" />;
    }
    switch (statusObj.status) {
      case 'pending':
        return <Chip label="Pending Review" color="warning" size="small" />;
      case 'approved':
      case 'verified':
        return <Chip label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      case 'error':
        return <Chip label="Error" color="error" size="small" />;
      default:
        return <Chip label={statusObj.status} size="small" />;
    }
  };

  const renderActionButton = (statusObj, linkTo, submitText, viewText = "View Details") => {
    if (!statusObj || !statusObj.status || statusObj.status === 'unverified' || statusObj.status === 'rejected' || statusObj.status === 'not_submitted' || statusObj.status === 'UNVERIFIED') { 
      return (
        <Button component={Link} to={linkTo} variant="outlined" size="small" sx={{color: COLOR_PRIMARY_BLUE, borderColor: COLOR_PRIMARY_BLUE}}>
          {submitText || 'Start Verification'}
        </Button>
      );
    }
    switch (statusObj.status) {
      case 'pending':
        return <Typography variant="body2" color="text.secondary">Reviewing...</Typography>;
      case 'approved':
      case 'verified':
        return (
          <Button component={Link} to={linkTo} variant="text" size="small" sx={{color: COLOR_PRIMARY_BLUE}}>
            {viewText}
          </Button>
        );
      default:
        return null; // No action for other statuses
    }
  };

  if (loading || authLoading || !user) {
    return (
      <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
        <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>
          {authLoading ? 'Loading user data...' : 'Loading verification statuses...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={pageSx}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{fontWeight: '900', color: COLOR_TEXT_DARK, mb: 3}}>Verification Hub</Typography>

        <Paper sx={{...paperSx, p: 2}}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Verification Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* KYC Verification for all roles (assuming identity verification is universal) */}
                <TableRow>
                  <TableCell>KYC Verification</TableCell>
                  <TableCell>{renderStatusChip(kycStatus)}</TableCell>
                  <TableCell>
                    {renderActionButton(kycStatus, '/kyc', 'Submit KYC', 'View KYC')}
                  </TableCell>
                </TableRow>

                {/* Portfolio Verification for Service Providers */}
                {user.role === 'service_provider' && (
                  <TableRow>
                    <TableCell>Portfolio Verification</TableCell>
                    <TableCell>{renderStatusChip(portfolioStatus)}</TableCell>
                    <TableCell>
                      {renderActionButton(portfolioStatus, '/portfolio', 'Submit Portfolio', 'View Portfolio')}
                    </TableCell>
                  </TableRow>
                )}

                {/* Seller Verification for Sellers */}
                {user.role === 'seller' && (
                  <TableRow>
                    <TableCell>Seller Verification</TableCell>
                    <TableCell>{renderStatusChip(sellerVerificationStatus)}</TableCell>
                    <TableCell>
                      {renderActionButton(sellerVerificationStatus, '/seller-verification-submit', 'Submit Seller Verification', 'View Seller Verification')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default VerificationHub;
