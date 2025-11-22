
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminCreateUser } from '../api/adminService';
import Page from '../components/Page';
import { FaArrowLeft } from 'react-icons/fa';

function CreateUserPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'client',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      await adminCreateUser(formData);
      setSuccess('User created successfully!');
      setFormData({ name: '', email: '', phone: '', password: '', role: 'client' });
    } catch (err) {
      setError(err.message);
    } finally {
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
    <Page title="Create New User">
      <Link to="/users" style={{
          color: 'black',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px'
      }}>
        <FaArrowLeft /> Back to User Management
      </Link>
      <div style={{
        borderRadius: '32px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        border: '2px solid rgba(255, 255, 255, 0.12)',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <input
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
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
          <input
            placeholder="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
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
          <input
            placeholder="Password (min 8 chars)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
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
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
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
          >
            <option value="client" style={{color: 'black'}}>Client</option>
            <option value="seller" style={{color: 'black'}}>Seller</option>
            <option value="service_provider" style={{color: 'black'}}>Service Provider</option>
            <option value="admin" style={{color: 'black'}}>Admin</option>
          </select>

          {error && (
            <p style={{ color: COLORS.red, marginTop: '8px' }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ color: COLORS.green, marginTop: '8px' }}>
              {success}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
                marginTop: '16px',
                background: `linear-gradient(135deg, ${COLORS.yellow} 0%, ${COLORS.skyBlue} 100%)`,
                color: 'black',
                padding: '12px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
            }}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </Page>
  );
}

export default CreateUserPage;