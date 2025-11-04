// src/pages/ProductManagement.js

import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct } from '../api/adminService';
import { Link } from 'react-router-dom';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this product?'
      )
    ) {
      try {
        await deleteProduct(productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p style={styles.loading}>Loading products...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      {/* 1. 🛑 Header with Create button */}
      <div style={styles.header}>
        <h2 style={styles.title}>Product Management</h2>
        <Link to="/product/create">
          <button style={styles.buttonCreate}>+ Create New Product</button>
        </Link>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.cell}>Product Name</th>
              <th style={styles.cell}>Seller</th>
              <th style={{...styles.cell, textAlign: 'right'}}>Price</th>
              <th style={{...styles.cell, textAlign: 'center'}}>Stock</th>
              <th style={{...styles.cell, textAlign: 'center'}}>Rating</th>
              <th style={styles.cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={styles.row}>
                <td style={styles.cell}>{product.name}</td>
                <td style={styles.cell}>{product.seller?.email || 'Platform-Owned'}</td>
                <td style={{...styles.cell, textAlign: 'right'}}>
                  Ksh {parseFloat(product.price).toFixed(2)}
                </td>
                <td style={{...styles.cell, textAlign: 'center'}}>{product.stock}</td>
                <td style={{...styles.cell, textAlign: 'center'}}>
                  {parseFloat(product.averageRating).toFixed(1)} / 5
                </td>
                <td style={{...styles.cell, display: 'flex', gap: '5px'}}>
                  <Link to={`/product/${product.id}/edit`}>
                    <button style={styles.buttonEdit}>Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={styles.buttonDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 2. 🛑 Added new styles for header and create button
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: '"Poppins", sans-serif',
    color: '#000000',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '1.8rem',
    textAlign: 'left',
    color: '#0f35df',
    fontWeight: '600',
    borderBottom: '3px solid #fa0f8c',
    display: 'inline-block',
    paddingBottom: '5px',
    margin: 0,
  },
  buttonCreate: {
    background: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1em',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
  },
  headerRow: {
    backgroundColor: '#0f35df',
    color: '#ffffff',
  },
  row: {
    transition: 'background 0.2s ease',
  },
  cell: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
    verticalAlign: 'middle',
  },
  buttonEdit: {
    background: '#0f35df',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  buttonDelete: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  loading: {
    textAlign: 'center',
    color: '#0f35df',
    fontWeight: '500',
  },
  error: {
    textAlign: 'center',
    color: '#fa0f8c',
    fontWeight: '600',
  },
};

export default ProductManagement;