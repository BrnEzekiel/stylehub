// src/pages/CreateProductPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/productService';
import { categories } from '../utils/categories'; // 1. Import the new category list

const CreateProductPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  // 2. 🛑 Set default category
  const [category, setCategory] = useState(categories[0]); 
  const [image, setImage] = useState(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', parseFloat(price).toFixed(2));
    formData.append('stock', parseInt(stock, 10));
    formData.append('category', category); // 3. 🛑 Category is now from the dropdown
    
    if (image) {
      formData.append('image', image);
    } else {
      setError("Image file is required.");
      setLoading(false);
      return;
    }

    try {
      const newProduct = await createProduct(formData);
      console.log('Product created!', newProduct);
      alert('Product created successfully!');
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Failed to create product. Check server logs.');
    } finally {
      setLoading(false);
    }
  };

  // 4. 🛑 Apply styles to match the admin theme
  return (
    <div className="admin-content"> {/* Use admin layout class */}
      <h2 style={{ color: '#0f35df', marginBottom: '20px' }}>Create New Product</h2>
      
      {/* Use a standard card for the form */}
      <div className="dashboard-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name:</label>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {/* Description */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              style={{ ...styles.input, minHeight: '100px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* Price */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Price:</label>
            <input
              style={styles.input}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          {/* Stock */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Stock:</label>
            <input
              style={styles.input}
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          {/* 5. 🛑 Category Dropdown */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Category:</label>
            <select
              style={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {/* Image */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Image:</label>
            <input
              style={styles.input}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

// 6. 🛑 Added styles for the form
const styles = {
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
    width: '100%',
    padding: '12px',
    fontSize: '1em',
    backgroundColor: '#0f35df',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '10px'
  }
};

export default CreateProductPage;