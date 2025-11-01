import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('super@stylehub.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// 🎨 Shared Palette — Blue, Yellow, Magenta, Black, White
const styles = {
  container: {
    background: 'linear-gradient(135deg, #0f35df 40%, #fa0f8c 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    color: '#000',
    fontFamily: '"Poppins", sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px 25px',
    borderRadius: '12px',
    boxShadow: '0 5px 25px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    color: '#0f35df',
    fontSize: '1.8rem',
    marginBottom: '20px',
    borderBottom: '3px solid #fa0f8c',
    display: 'inline-block',
    paddingBottom: '6px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    color: '#000000',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  error: {
    color: '#fa0f8c',
    fontWeight: '500',
    fontSize: '0.9rem',
    marginTop: '5px',
  },
  button: {
    backgroundColor: '#f4d40f', // Yellow
    color: '#000000',
    border: 'none',
    padding: '12px 0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    marginTop: '10px',
    transition: 'all 0.3s ease',
  },
};

// 💫 Add hover styles dynamically (inline JS approach)
Object.assign(styles.input, {
  ':focus': {
    borderColor: '#0f35df',
    boxShadow: '0 0 5px rgba(15, 53, 223, 0.4)',
  },
});

Object.assign(styles.button, {
  ':hover': {
    backgroundColor: '#ffe44d',
  },
});

export default LoginPage;
