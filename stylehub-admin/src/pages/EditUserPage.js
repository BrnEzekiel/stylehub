
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAdminUserById, adminUpdateUser } from '../api/adminService';
import Page from '../components/Page';
import { FaArrowLeft } from 'react-icons/fa';

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'client',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getAdminUserById(id);
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await adminUpdateUser(id, formData);
      setSuccess('User updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
      return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white' }}>
              <div style={{
                  width: '80px',
                  height: '80px',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                  borderTop: '4px solid #FFD700',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
              }} />
              <h1 style={{ marginLeft: '20px' }}>Loading User...</h1>
          </div>
      );
  }

  if (error && !user) {
      return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'red' }}>
              <h1>Error: {error}</h1>
          </div>
      );
  }

  if (!user) return (
    <Page title="Error">
        <h2 style={{color: 'white'}}>User not found.</h2>
    </Page>
  );

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
    <Page title={`Edit User: ${user?.name}`}>
      <Link to="/users" style={{
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px'
      }}>
        <FaArrowLeft /> Back to User Management
      </Link>
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
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
                color: 'white',
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
                color: 'white',
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
                color: 'white',
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
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px',
                outline: 'none',
            }}
          >
            <option value="client" style={{color: 'black'}}>Client</option>
            <option value="seller" style={{color: 'black'}}>Seller</option>
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
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
            }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </Page>
  );
}

export default EditUserPage;

