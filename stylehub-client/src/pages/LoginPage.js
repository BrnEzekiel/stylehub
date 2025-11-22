// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK, paperSx } from '../styles/theme';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const loggedInUser = await login(email, password); 
      
      if (loggedInUser.role === 'seller') {
        navigate('/dashboard/seller');
      } else if (loggedInUser.role === 'client') {
        navigate('/dashboard/client');
      } else if (loggedInUser.role === 'service_provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        fontFamily: '"Poppins", sans-serif',
        minHeight: '100vh', // Ensure it takes full viewport height
        background: 'linear-gradient(135deg, #0066FF 0%, #00BFFF 50%, #000000 100%)', // Apply the blend of blue gradient
      }}
    >
      <Paper
        sx={{
          ...paperSx, // Apply glassmorphism from theme
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: '#0f35df',
            mb: 3,
            borderBottom: '3px solid #fa0f8c',
            display: 'inline-block',
            pb: 0.5,
            fontWeight: '600',
          }}
        >
          Login to StyleHub
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: COLOR_PRIMARY_BLUE,
              color: COLOR_TEXT_DARK,
              fontWeight: '700',
              '&:hover': {
                backgroundColor: COLOR_PRIMARY_BLUE, // Keep same color on hover or a lighter shade
                opacity: 0.9 // Add slight opacity change for hover effect
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, color: COLOR_TEXT_DARK }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: COLOR_PRIMARY_BLUE, fontWeight: '600', textDecoration: 'none' }}>
            Register here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginPage;