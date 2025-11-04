// src/pages/EditProductPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAdminProductById, adminUpdateProduct } from '../api/adminService';
// 1. 🛑 THE FIX: Corrected the path to go up one more level
import { categories } from '../utils/categories'; 

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
  loading: { color: '#0f35df' },
};

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getAdminProductById(id);
        setProduct(data);
        setFormData({
          name: data.name,
          description: data.description || '',
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
          category: data.category,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
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
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
      };
      await adminUpdateProduct(id, updateData);
      setSuccess('Product updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) return <p style={styles.loading}>Loading product data...</p>;
  if (error && !product) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <Link to="/product-management" style={{ textDecoration: 'none' }}>
        &larr; Back to Product Management
      </Link>
      <h2 style={styles.title}>Edit Product: {product?.name}</h2>
      <p>Sold by: <strong>{product?.seller?.name || 'N/A'}</strong> ({product?.seller?.email})</p>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          {/* ... (rest of the form is unchanged) ... */}
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

export default EditProductPage;