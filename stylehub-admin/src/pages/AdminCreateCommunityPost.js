
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminCreateCommunityPost } from '../api/adminService';
import Page from '../components/Page';
import { FaArrowLeft } from 'react-icons/fa';

function AdminCreateCommunityPost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!image) {
      setError('Community post image is required.');
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('image', image);

    try {
      await adminCreateCommunityPost(data);
      setSuccess('Community post created successfully! You can create another or go back.');
      setFormData({ title: '', description: '' });
      setImage(null);
      document.getElementById('image').value = null;
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
    <Page title="Create New Community Post (Admin)">
      <Link to="/community" style={{
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px'
      }}>
        <FaArrowLeft /> Back to Community Management
      </Link>
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        border: '2px solid rgba(255, 255, 255, 0.12)',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
          This community post will be created by the admin.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <input
            placeholder="Post Title"
            name="title"
            value={formData.title}
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
          <textarea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical',
            }}
          />
          <div>
            <label htmlFor="image" style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Community Post Image</label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%', background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
            />
          </div>

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
            {loading ? 'Creating...' : 'Create Community Post'}
          </button>
        </form>
      </div>
    </Page>
  );
}

export default AdminCreateCommunityPost;