// src/pages/CreateServicePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService } from '../api/serviceService';

const CATEGORIES = ['Hair', 'Nails', 'Makeup', 'Skincare', 'Barber'];

export default function CreateServicePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Hair',
    priceShopCents: '',
    priceHomeCents: '',
    offersHome: false,
    durationMinutes: 60,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== '') finalData.append(key, val);
    });
    if (imageFile) finalData.append('image', imageFile);

    setLoading(true);
    setMessage('');
    try {
      await createService(finalData);
      alert('Service created successfully!');
      navigate('/my-services');
    } catch (err) {
      // 🔥 Better error handling for production
      let msg = 'Failed to create service.';
      if (err.response) {
        // Server responded with error (4xx/5xx)
        msg = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Network error (no response)
        msg = 'Network error. Please check your internet connection.';
      } else {
        // Other errors
        msg = err.message || 'An unknown error occurred.';
      }
      setMessage(msg);
      console.error('Create service error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create a New Service</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: '100%', height: '100px', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Price (Shop) - Ksh</label>
          <input type="number" step="0.01" name="priceShopCents" value={formData.priceShopCents} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input type="checkbox" name="offersHome" checked={formData.offersHome} onChange={handleChange} />
            Offers Home Service
          </label>
          {formData.offersHome && (
            <input
              type="number"
              step="0.01"
              name="priceHomeCents"
              placeholder="Home service price"
              value={formData.priceHomeCents}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '8px' }}
            />
          )}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Duration (minutes)</label>
          <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Service Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required style={{ width: '100%' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px' }}>
          {loading ? 'Creating...' : 'Create Service'}
        </button>
      </form>
    </div>
  );
}