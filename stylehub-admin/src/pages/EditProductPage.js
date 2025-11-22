import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAdminProductById, adminUpdateProduct, deleteProduct } from '../api/adminService';
import { categories } from '../utils/categories';
import Page from '../components/Page';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';


function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme(); // Access the Material-UI theme

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetails(id);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category,
        });
        setCurrentImageUrl(data.imageUrl);
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
    data.append('stock', parseInt(formData.stock));
    data.append('category', formData.category);
    if (image) {
      data.append('image', image);
    }

    try {
      await adminUpdateProduct(id, data);
      setSuccess('Product updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      try {
        setLoading(true);
        await adminDeleteProduct(id);
        alert('Product deleted successfully.');
        navigate('/products');
      } catch (err) {
        alert(`Failed to delete product: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    }
  };

  if (loading) {
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
        <h1 style={{ marginLeft: '20px' }}>Loading Product...</h1>
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
    <Page title="Edit Product">
      <Link to="/products" style={{
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px'
      }}>
        <FaArrowLeft /> Back to Product Management
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
            placeholder="Product Name"
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
          <input
            placeholder="Stock"
            name="stock"
            type="number"
            value={formData.stock}
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
            name="category"
            value={formData.category}
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
            {categories.map((cat) => (
              <option key={cat} value={cat} style={{color: 'black'}}>
                {cat}
              </option>
            ))}
          </select>
          <div>
            <label htmlFor="image" style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Product Image</label>
            {currentImageUrl && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{color: 'white', marginBottom: '8px'}}>Current Image:</p>
                <img src={currentImageUrl} alt="Current Product" style={{ maxWidth: '100%', height: '100px', objectFit: 'contain' }} />
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
            {loading ? 'Updating...' : 'Update Product'}
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
            {loading ? 'Deleting...' : 'Delete Product'}
          </button>
        </form>
      </div>
    </Page>
  );
}

export default EditProductPage;
