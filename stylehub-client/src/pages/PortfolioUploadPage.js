// src/pages/PortfolioUploadPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getPortfolioStatus, submitPortfolio } from '../api/portfolioService';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import { CheckCircle, HourglassEmpty, ErrorOutline } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

function PortfolioUploadPage() {
  const [statusData, setStatusData] = useState(null);
  const [bio, setBio] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== 'service_provider') {
      navigate('/login');
      return;
    }
    const fetchStatus = async () => {
      try {
        const data = await getPortfolioStatus();
        setStatusData(data);
      } catch (err) {
        // Not submitted yet
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('portfolioUrl', portfolioUrl);
    if (videoFile) formData.append('videoUrl', videoFile);

    try {
      await submitPortfolio(formData);
      setMessage('Portfolio submitted! Awaiting admin approval.');
      setStatusData({ status: 'pending' });
    } catch (err) {
      setMessage(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading...</Typography>
        </Box>
    );
  }

  const StatusDisplay = ({icon, title, message, children}) => (
      <Box sx={{...pageSx, textAlign: 'center'}}>
          <Paper sx={{...paperSx, p: 4, display: 'inline-block'}}>
              {icon}
              <Typography variant="h5" sx={{fontWeight: 'bold', my: 1}}>{title}</Typography>
              <Typography color="text.secondary">{message}</Typography>
              {children}
          </Paper>
      </Box>
  );

  if (statusData?.status === 'approved') {
    return <StatusDisplay icon={<CheckCircle sx={{fontSize: 48, color: 'green'}} />} title="Portfolio Approved" message="Your portfolio is approved! You can now create services." />;
  }

  if (statusData?.status === 'pending') {
    return (
        <StatusDisplay icon={<HourglassEmpty sx={{fontSize: 48, color: 'orange'}} />} title="Portfolio Under Review" message="In the meantime, you can check your other verification statuses.">
             <Button component={Link} to="/verification-hub" variant="contained" sx={{mt: 2, backgroundColor: COLOR_PRIMARY_BLUE}}>Verification Hub</Button>
        </StatusDisplay>
    );
  }

  return (
    <Box sx={pageSx}>
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 1}}>Submit Your Portfolio</Typography>
            <Typography color="text.secondary" sx={{mb: 1}}>Upload your portfolio to become an approved service provider.</Typography>
             <Typography color="text.secondary" sx={{mb: 3}}>
                You can also check your other verification statuses in the <Link to="/verification-hub" style={{color: COLOR_PRIMARY_BLUE}}>Verification Hub</Link>.
            </Typography>

            <Paper sx={{...paperSx, p: 4}}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Bio (About you)" value={bio} onChange={(e) => setBio(e.target.value)} required multiline rows={4} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Portfolio URL (e.g., Behance, Instagram)" type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} required />
                        </Grid>
                         <Grid item xs={12}>
                            <Button variant="contained" component="label" fullWidth>
                                Upload Optional Video Pitch
                                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} hidden />
                            </Button>
                            {videoFile && <Typography variant="body2" sx={{mt: 1}}>{videoFile.name}</Typography>}
                        </Grid>

                        {message && <Grid item xs={12}><Typography color={message.includes('approved') ? 'success.main' : 'error'}>{message}</Typography></Grid>}

                        <Grid item xs={12}>
                            <Button type="submit" disabled={submitting} variant="contained" size="large" fullWidth sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Portfolio'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    </Box>
  );
}

export default PortfolioUploadPage;