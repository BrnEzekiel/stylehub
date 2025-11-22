// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../api/authService';
import { Box, TextField, Button, Typography, Paper, CircularProgress, IconButton, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK, paperSx } from '../styles/theme';

function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userData = { name, username, email, phone, password, role };

    try {
      await apiRegister(userData);
      await login(email, password);

      if (role === 'seller' || role === 'service_provider') {
        navigate('/verification-hub');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
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
          Create Your Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            type="text"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Username"
            type="text"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
            label="Phone Number"
            type="tel"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <TextField
            label="Password (min 8 chars)"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
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
          <FormControl fullWidth variant="outlined">
            <InputLabel id="role-select-label">I am a:</InputLabel>
            <Select
              labelId="role-select-label"
              id="role"
              value={role}
              label="I am a:"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="client">Client (I want to buy)</MenuItem>
              <MenuItem value="seller">Seller (I want to sell products)</MenuItem>
              <MenuItem value="service_provider">Service Provider (I offer services)</MenuItem>
            </Select>
          </FormControl>

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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, color: COLOR_TEXT_DARK }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: COLOR_PRIMARY_BLUE, fontWeight: '600', textDecoration: 'none' }}>
            Log In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;