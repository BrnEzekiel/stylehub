// src/pages/KYCPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getKYCStatus, submitKYC } from '../api/kycService';
import {
  Box,
  Typography,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Container,
  Grid
} from '@mui/material';
import { CheckCircle, HourglassEmpty, ErrorOutline } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

function KYCPage() {
  const [kycStatus, setKycStatus] = useState(null);
  const [docType, setDocType] = useState('national_id');
  const [documentFile, setDocumentFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (user?.role !== 'seller' && user?.role !== 'service_provider')) {
      navigate('/login');
      return;
    }
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const statusData = await getKYCStatus();
        setKycStatus(statusData);
        setError('');
      } catch (err) {
        if (err.message.includes('404')) {
          setKycStatus(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [token, user, navigate]);

  const handleDocumentChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };
  
  const handleSelfieChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentFile || !selfieFile) {
      setError('Please upload BOTH your ID document and a selfie.');
      return;
    }
    setSubmitLoading(true);
    setError('');
    setSuccessMessage('');
    const formData = new FormData();
    formData.append('doc_type', docType);
    formData.append('document', documentFile);
    formData.append('selfie', selfieFile);
    try {
      const newKyc = await submitKYC(formData);
      setKycStatus(newKyc);
      setSuccessMessage('Your KYC has been submitted! It is now pending approval.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading KYC Status...</Typography>
        </Box>
    );
  }
  
  const StatusDisplay = ({icon, title, message, color}) => (
      <Box sx={{...pageSx, textAlign: 'center'}}>
          <Paper sx={{...paperSx, p: 4, display: 'inline-block', borderColor: color, borderTopWidth: 4, borderTopStyle: 'solid'}}>
              {icon}
              <Typography variant="h5" sx={{fontWeight: 'bold', my: 1}}>{title}</Typography>
              <Typography color="text.secondary">{message}</Typography>
          </Paper>
      </Box>
  );

  if (kycStatus?.status === 'approved') {
    return <StatusDisplay icon={<CheckCircle sx={{fontSize: 48, color: 'green'}} />} title="KYC Approved" message="Your KYC is approved! You can now create products or services." color="green" />;
  }

  if (kycStatus?.status === 'pending' || successMessage) {
    return <StatusDisplay icon={<HourglassEmpty sx={{fontSize: 48, color: 'orange'}} />} title="KYC Pending" message={successMessage || "Your submission is currently under review by an admin."} color="orange" />;
  }
  
  if (kycStatus?.status === 'rejected' && !error) {
    setError("Your previous submission was rejected. Please re-submit.");
    setKycStatus(null);
  }

  return (
    <Box sx={pageSx}>
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 1}}>KYC Submission</Typography>
            <Typography color="text.secondary" sx={{mb: 3}}>You must submit your KYC for approval before you can create products or services.</Typography>
            <Paper sx={{...paperSx, p: 4}}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                             <FormControl fullWidth required>
                                <InputLabel>Document Type</InputLabel>
                                <Select value={docType} onChange={(e) => setDocType(e.target.value)} label="Document Type">
                                    <MenuItem value="national_id">National ID</MenuItem>
                                    <MenuItem value="passport">Passport</MenuItem>
                                    <MenuItem value="drivers_license">Driver's License</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label" fullWidth>
                                Upload ID Document
                                <input type="file" accept="image/*" onChange={handleDocumentChange} required hidden />
                            </Button>
                            {documentFile && <Typography variant="body2" sx={{mt: 1}}>{documentFile.name}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label" fullWidth>
                                Upload Selfie
                                <input type="file" accept="image/*" onChange={handleSelfieChange} required hidden />
                            </Button>
                            {selfieFile && <Typography variant="body2" sx={{mt: 1}}>{selfieFile.name}</Typography>}
                        </Grid>

                        {error && <Grid item xs={12}><Typography color="error">{error}</Typography></Grid>}

                        <Grid item xs={12}>
                            <Button type="submit" disabled={submitLoading} variant="contained" size="large" fullWidth sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                                {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit KYC'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    </Box>
  );
}

export default KYCPage;