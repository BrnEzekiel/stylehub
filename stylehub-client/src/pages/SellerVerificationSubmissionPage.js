// src/pages/VerificationPage.js

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getVerificationStatus, submitVerification } from '../api/verificationService';
import {
  Box, Typography, Button, Paper, TextField, CircularProgress, Container, Alert, Grid
} from '@mui/material';
import { CheckCircle, HourglassEmpty, ErrorOutline } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

function SellerVerificationSubmissionPage() {
  console.log('SellerVerificationSubmissionPage component started.');
  const { user } = useAuth();
  const [status, setStatus] = useState('unverified');
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [socialMediaUrl, setSocialMediaUrl] = useState('');
  const [businessLicense, setBusinessLicense] = useState(null);
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getVerificationStatus();
        setStatus(data.status);
        setSubmission(data.submission);
      } catch (error) {
        console.error('Error fetching verification status:', error.message);
        setStatus('unverified'); // Assume unverified if status cannot be fetched
      } finally {
        setLoading(false);
        console.log('loadStatus finished. loading set to false.');
      }
    };
    loadStatus();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!businessLicense) {
      setFormError('Please upload your business license file.');
      return;
    }

    setFormLoading(true);
    const formData = new FormData();
    formData.append('businessName', businessName);
    formData.append('socialMediaUrl', socialMediaUrl);
    formData.append('businessLicense', businessLicense);

    try {
      await submitVerification(formData);
      setFormSuccess('Submission successful! Your documents are now under review.');
      setStatus('pending');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const renderStatus = () => {
    if (loading) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: 'red' }} />
        <Typography variant="h6" sx={{ ml: 2, color: 'red' }}>LOADING SELLER VERIFICATION STATUS... (Check Network Tab!)</Typography>
      </Box>
    );
    
    switch (status) {
      case 'approved':
        return (
          <Paper sx={{...paperSx, p: 4, textAlign: 'center'}}>
            <CheckCircle sx={{fontSize: 48, color: 'green', mb: 1}} />
            <Typography variant="h5" sx={{fontWeight: 'bold', mb: 1}}>Congratulations, you are a Verified Seller!</Typography>
            <Typography color="text.secondary">The "Local Authenticity Badge" will now appear on your profile and products.</Typography>
          </Paper>
        );
      case 'pending':
        return (
          <Paper sx={{...paperSx, p: 4, textAlign: 'center'}}>
            <HourglassEmpty sx={{fontSize: 48, color: 'orange', mb: 1}} />
            <Typography variant="h5" sx={{fontWeight: 'bold', mb: 1}}>Submission Under Review</Typography>
            <Typography color="text.secondary">Your verification documents have been received and are currently being reviewed by our team. This may take 2-3 business days.</Typography>
          </Paper>
        );
      case 'rejected':
        return (
          <Paper sx={{...paperSx, p: 4}}>
            <ErrorOutline sx={{fontSize: 48, color: 'red', mb: 1}} />
            <Typography variant="h5" sx={{fontWeight: 'bold', mb: 1, color: 'error.main'}}>Submission Rejected</Typography>
            <Typography color="text.secondary" sx={{mb: 3}}>Unfortunately, your verification submission could not be approved. Please review your documents and resubmit.</Typography>
            {renderForm()}
          </Paper>
        );
      case 'unverified':
      default:
        return renderForm();
    }
  };

  const StatusDisplay = ({icon, title, message, children}) => (
      <Box sx={{textAlign: 'center'}}>
          <Paper sx={{...paperSx, p: 4, display: 'inline-block'}}>
              {icon}
              <Typography variant="h5" sx={{fontWeight: 'bold', my: 1}}>{title}</Typography>
              <Typography color="text.secondary">{message}</Typography>
              {children}
          </Paper>
      </Box>
  );

  const renderForm = () => (
    <Paper sx={{...paperSx, p: 4}}>
      <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Submit for Verification</Typography>
      <Typography color="text.secondary" sx={{mb: 3}}>Submit your business documents to get the "Local Authenticity Badge". This helps build trust with buyers.</Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Registered Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Social Media or Website (Optional)"
              type="url"
              placeholder="https://instagram.com/mybusiness"
              value={socialMediaUrl}
              onChange={(e) => setSocialMediaUrl(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
                Upload Business License / Permit
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setBusinessLicense(e.target.files[0])} required hidden />
            </Button>
            {businessLicense && <Typography variant="body2" sx={{mt: 1}}>{businessLicense.name}</Typography>}
          </Grid>

          {formError && <Grid item xs={12}><Alert severity="error">{formError}</Alert></Grid>}
          {formSuccess && <Grid item xs={12}><Alert severity="success">{formSuccess}</Alert></Grid>}

          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" sx={{backgroundColor: COLOR_PRIMARY_BLUE}} disabled={formLoading}>
              {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit for Verification'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );

  return (
    <Box sx={pageSx}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{fontWeight: '900', color: COLOR_TEXT_DARK, mb: 3}}>Seller Verification</Typography>
        {renderStatus()}
      </Container>
    </Box>
  );
}

export default SellerVerificationSubmissionPage;