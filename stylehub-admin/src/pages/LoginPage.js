
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Page from '../components/Page'; // Import the Page component

function LoginPage() {
  const [email, setEmail] = useState('brianonyango229@gmail.com');
  const [password, setPassword] = useState('@Kawangware1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const COLORS = {
    blue: '#0066FF',
    skyBlue: '#00BFFF',
    yellow: '#FFD700',
    black: '#000000',
    white: '#FFFFFF',
    green: '#00FF00',
    red: '#EF4444',
    magenta: '#FF00FF'
  };

  return (
    <Page title="Admin Login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: '32px',
          padding: 'clamp(24px, 4vw, 40px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.12)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          color: 'black',
        }}
      >
        <h2
          style={{
            color: 'black',
            marginBottom: '24px',
            borderBottom: `3px solid ${COLORS.yellow}`,
            display: 'inline-block',
            paddingBottom: '8px',
          }}
        >
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'black',
                padding: '12px 16px',
                fontSize: '16px',
                outline: 'none',
              }}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'black',
                padding: '12px 16px',
                fontSize: '16px',
                width: '100%',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'black',
                cursor: 'pointer',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && (
            <p style={{ color: COLORS.red, marginTop: '8px', marginBottom: '8px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
                marginTop: '16px',
                background: `linear-gradient(135deg, ${COLORS.yellow} 0%, ${COLORS.skyBlue} 100%)`,
                color: 'black',
                padding: '12px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </Page>
  );
}

export default LoginPage;

