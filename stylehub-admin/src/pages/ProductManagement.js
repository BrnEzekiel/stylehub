import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct } from '../api/adminService';

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
        'Are you sure you want to permanently delete this product? This will remove it from all carts and reviews. This cannot be undone.'
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
      <h2 style={styles.title}>Product Management</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.cell}>Product Name</th>
              <th style={styles.cell}>Seller</th>
              <th style={styles.cell}>Price</th>
              <th style={styles.cell}>Stock</th>
              <th style={styles.cell}>Rating</th>
              <th style={styles.cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={styles.row}>
                <td style={styles.cell}>{product.name}</td>
                <td style={styles.cell}>{product.seller?.email || 'N/A'}</td>
                <td style={styles.cell}>
                  Ksh {parseFloat(product.price).toFixed(2)}
                </td>
                <td style={styles.cell}>{product.stock}</td>
                <td style={styles.cell}>
                  {parseFloat(product.averageRating).toFixed(1)} / 5
                </td>
                <td style={styles.cell}>
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

// 🎨 THEME: Blue, Yellow, Magenta, Black, White
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: '"Poppins", sans-serif',
    color: '#000000',
  },
  title: {
    fontSize: '1.8rem',
    textAlign: 'center',
    color: '#0f35df', // Blue
    marginBottom: '20px',
    fontWeight: '600',
    borderBottom: '3px solid #fa0f8c', // Magenta
    display: 'inline-block',
    paddingBottom: '5px',
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
  },
  buttonDelete: {
    background: '#fa0f8c', // Magenta
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
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

// Add hover interactions dynamically
Object.assign(styles.row, {
  ':hover': {
    backgroundColor: '#f9f9f9',
  },
});
Object.assign(styles.buttonDelete, {
  ':hover': {
    backgroundColor: '#ff4fcf',
  },
});

export default ProductManagement;
