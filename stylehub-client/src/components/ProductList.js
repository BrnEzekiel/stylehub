import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Icons for CRUD operations

const COLORS = {
  blue: '#0066FF',
  skyBlue: '#00BFFF',
  yellow: '#FFD700',
  black: '#000000',
  white: '#FFFFFF',
  green: '#00FF00',
  red: '#EF4444'
};

const ProductList = ({ products, onProductChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // To get token or user info for API calls

  const formatCurrency = (value) => {
    if (!value) return 'Ksh 0.00';
    const numericValue = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericValue)) return value;
  
    if (numericValue >= 1000000) {
      return `Ksh ${(numericValue / 1000000).toFixed(1)}M`;
    }
    if (numericValue >= 1000) {
      return `Ksh ${(numericValue / 1000).toFixed(1)}K`;
    }
    return `Ksh ${numericValue.toFixed(2)}`;
  };

  const handleCreateProduct = () => {
    navigate('/create-product');
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Assuming an API endpoint for deleting products
        await apiClient.delete(`/products/${productId}`);
        // Refresh product list in parent component
        if (onProductChange) {
          onProductChange(); 
        }
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <button 
          onClick={handleCreateProduct}
          style={{
            background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`,
            color: COLORS.white,
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <FaPlus size={16} /> Add New Product
        </button>
      </div>

      {products && products.length > 0 ? (
        <table 
          style={{
            minWidth: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: '28px',
            overflow: 'hidden',
            border: `2px solid rgba(255, 255, 255, 0.12)`,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          <thead>
            <tr>
              <th style={{ 
                padding: '12px 24px', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
                textAlign: 'left', 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: COLORS.white,
                background: 'rgba(255, 255, 255, 0.1)'
              }}>Product Name</th>
              <th style={{ 
                padding: '12px 24px', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
                textAlign: 'left', 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: COLORS.white,
                background: 'rgba(255, 255, 255, 0.1)'
              }}>Price</th>
              <th style={{ 
                padding: '12px 24px', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
                textAlign: 'left', 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: COLORS.white,
                background: 'rgba(255, 255, 255, 0.1)'
              }}>Stock</th>
              <th style={{ 
                padding: '12px 24px', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
                textAlign: 'left', 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: COLORS.white,
                background: 'rgba(255, 255, 255, 0.1)'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ transition: 'background-color 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: COLORS.white }}>{product.name}</td>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: COLORS.white }}>{formatCurrency(product.price)}</td>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: COLORS.white }}>{product.stock}</td>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: COLORS.white }}>
                  <button 
                    onClick={() => handleEditProduct(product.id)}
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.skyBlue} 100%)`,
                      color: COLORS.white,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      marginRight: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <FaEdit size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.red} 0%, ${COLORS.yellow} 100%)`,
                      color: COLORS.white,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <FaTrash size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div 
          style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: '28px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            border: `2px solid rgba(255, 255, 255, 0.12)`,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>No products to display.</p>
          <button 
            onClick={handleCreateProduct}
            style={{
              marginTop: '20px',
              background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.skyBlue} 100%)`,
              color: COLORS.white,
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <FaPlus size={16} /> Create Your First Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
