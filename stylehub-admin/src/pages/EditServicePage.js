
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAdminServiceById, adminUpdateService, deleteService } from '../api/adminService';
import Page from '../components/Page';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

function EditServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const data = await getAdminServiceById(id);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
        });
        setCurrentImageUrl(data.imageUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

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
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', parseFloat(formData.price));
    if (image) {
      data.append('image', image);
    }

    try {
      await adminUpdateService(id, data);
      setSuccess('Service updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this service?')) {
      try {
        setLoading(true);
        await deleteService(id);
        alert('Service deleted successfully.');
        navigate('/services');
      } catch (err) {
        alert(`Failed to delete service: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    }
  };

  if (loading && !error) {
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
        <h1 style={{ marginLeft: '20px' }}>Loading Service...</h1>
    </div>
    );
  }

  if (error) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'red' }}>
            <h1>Error: {error}</h1>
        </div>
    );
  }

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
    <Page title="Edit Service">
      <Link to="/services" style={{
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px'
      }}>
        <FaArrowLeft /> Back to Service Management
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <input
            placeholder="Service Name"
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
          <textarea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
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
          <input
            placeholder="Price (Ksh)"
            name="price"
            type="number"
            value={formData.price}
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
          <div>
            <label htmlFor="image" style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Service Image</label>
            {currentImageUrl && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{color: 'white', marginBottom: '8px'}}>Current Image:</p>
                <img src={currentImageUrl} alt="Current Service" style={{ maxWidth: '100%', height: '100px', objectFit: 'contain' }} />
              </div>
            )}
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
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
            {loading ? 'Updating...' : 'Update Service'}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
                background: COLORS.red,
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
            }}
          >
            {loading ? 'Deleting...' : 'Delete Service'}
          </button>
        </form>
      </div>
    </Page>
  );
}

export default EditServicePage;