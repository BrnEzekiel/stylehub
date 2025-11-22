import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// Brand colors (for consistent styling with other glassmorphism components)
const COLORS = {
  blue: '#0066FF',
  skyBlue: '#00BFFF',
  yellow: '#FFD700',
  black: '#000000',
  white: '#FFFFFF',
  green: '#00FF00',
  red: '#EF4444'
};

const EditProductPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '', // Assuming an imageUrl field
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Assuming an API endpoint to fetch a single product by ID
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data);
        setFormData({
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          stock: response.data.stock,
          imageUrl: response.data.imageUrl || '',
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchProduct();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming an API endpoint to update a product
      await apiClient.patch(`/products/${id}`, formData);
      alert('Product updated successfully!');
      navigate('/seller-dashboard'); // Navigate back to seller dashboard
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || 'Failed to update product.');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.white
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '4px solid rgba(255, 255, 255, 0.2)',
          borderTop: `4px solid ${COLORS.yellow}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{marginLeft: '20px'}}>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.red
      }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.white
      }}>
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontSize: 'clamp(32px, 7vw, 56px)',
          fontWeight: '900',
          color: COLORS.white,
          marginBottom: '30px',
          borderBottom: `4px solid ${COLORS.red}`,
          paddingBottom: '8px',
          display: 'inline-block'
        }}>
          Edit Product: {product.name}
        </h1>

        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: '28px',
          padding: 'clamp(24px, 4vw, 36px)',
          border: `2px solid rgba(255, 255, 255, 0.12)`,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          color: COLORS.white
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: COLORS.white,
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: COLORS.white,
                fontSize: '1rem',
                resize: 'vertical'
              }}
            ></textarea>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="price" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Price (Ksh)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: COLORS.white,
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="stock" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: COLORS.white,
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Image URL</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: COLORS.white,
                fontSize: '1rem'
              }}
            />
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Product Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginTop: '15px' }} />
            )}
          </div>

          <button
            type="submit"
            style={{
              background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.blue} 100%)`,
              color: COLORS.white,
              padding: '12px 25px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              fontSize: '1.1rem',
              width: '100%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
