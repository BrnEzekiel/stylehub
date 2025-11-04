// src/pages/AdminCreateProduct.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminCreateProduct } from '../api/adminService';
import { categories } from '../utils/categories'; // We need the category list

// Re-use styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    fontFamily: '"Poppins", sans-serif',
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
    maxWidth: '700px',
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
  error: { color: '#dc3545', marginBottom: '10px' },
  success: { color: '#28a745', marginBottom: '10px' },
};

function AdminCreateProduct() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: categories[0],
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
      setError('Product image is required.');
      return;
    }

    setLoading(true);

    // Build the FormData
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', parseFloat(formData.price));
    data.append('stock', parseInt(formData.stock));
    data.append('category', formData.category);
    data.append('image', image);
    // Note: We don't append sellerId, so it defaults to null (platform-owned)

    try {
      await adminCreateProduct(data);
      setSuccess('Product created successfully! You can create another or go back.');
      // Clear form
      setFormData({ name: '', description: '', price: '', stock: '', category: categories[0] });
      setImage(null);
      // Clear the file input visually (optional but good UX)
      document.getElementById('image').value = null;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Link to="/product-management" style={{ textDecoration: 'none' }}>
        &larr; Back to Product Management
      </Link>
      <h2 style={styles.title}>Create New Product (Admin)</h2>
      <p>This product will be owned by the platform (no seller).</p>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="name">Product Name</label>
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
          {/* Description */}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="description">Description</label>
            <textarea
              style={{ ...styles.input, minHeight: '100px' }}
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          {/* Price */}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="price">Price (Ksh)</label>
            <input
              style={styles.input}
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          {/* Stock */}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="stock">Stock</label>
            <input
              style={styles.input}
              type="number"
              name="stock"
              id="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          {/* Category */}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="category">Category</label>
            <select
              style={styles.input}
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {/* Image */}
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="image">Image</label>
            <input
              style={styles.input}
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateProduct;