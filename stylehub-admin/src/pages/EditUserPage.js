// src/pages/EditUserPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAdminUserById, adminUpdateUser } from '../api/adminService';

// Re-use admin styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    fontFamily: '"Poppins", sans-serif',
    color: '#000',
  },
  title: {
    fontSize: '1.8rem',
    color: '#0f35df',
    marginBottom: '20px',
    fontWeight: '600',
  },
  card: {
    background: '#fff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    maxWidth: '600px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  button: {
    padding: '12px 20px',
    fontSize: '1em',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '10px'
  },
  error: {
    color: '#dc3545',
    marginBottom: '10px',
  },
  success: {
    color: '#28a745',
    marginBottom: '10px',
  },
  loading: {
    color: '#0f35df',
  }
};

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
    setFormData(prev => ({
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

  if (loading && !user) return <p style={styles.loading}>Loading user data...</p>;
  if (error && !user) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <Link to="/user-management" style={{ textDecoration: 'none' }}>
        &larr; Back to User Management
      </Link>
      <h2 style={styles.title}>Edit User: {user?.name}</h2>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="name">Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="phone">Phone</label>
            <input
              style={styles.input}
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="role">Role</label>
            <select
              style={styles.input}
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="client">Client</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUserPage;