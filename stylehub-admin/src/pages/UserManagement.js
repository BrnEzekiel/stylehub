// src/pages/UserManagement.js

import React, { useState, useEffect } from 'react';
import { getAllUsers, adminDeleteUser } from '../api/adminService';
import { Link } from 'react-router-dom';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This will delete all their products, orders, and reviews.`)) {
      try {
        await adminDeleteUser(userId);
        // Refresh the list
        fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p style={styles.loading}>Loading users...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      {/* 1. 🛑 Header with Create User button */}
      <div style={styles.header}>
        <h2 style={styles.title}>User Management</h2>
        <Link to="/user/create">
          <button style={styles.buttonCreate}>+ Create New User</button>
        </Link>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.cell}>Name</th>
              <th style={styles.cell}>Email</th>
              <th style={styles.cell}>Phone</th>
              <th style={styles.cell}>Role</th>
              <th style={styles.cell}>Joined On</th>
              <th style={styles.cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.row}>
                <td style={styles.cell}>{user.name}</td>
                <td style={styles.cell}>{user.email}</td>
                <td style={styles.cell}>{user.phone}</td>
                <td style={styles.cell}>
                  <span style={{ ...styles.badge, ...styles[user.role] }}>
                    {user.role}
                  </span>
                </td>
                <td style={styles.cell}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{...styles.cell, display: 'flex', gap: '5px'}}>
                  <Link to={`/user/${user.id}/edit`}>
                    <button style={styles.buttonEdit}>Edit</button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(user.id, user.name)}
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
    color: '#000',
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
  cell: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
    verticalAlign: 'middle',
  },
  row: {
    transition: 'background 0.2s ease',
  },
  badge: {
    padding: '5px 10px',
    borderRadius: '16px',
    fontSize: '0.85em',
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  admin: {
    backgroundColor: '#fa0f8c',
  },
  seller: {
    backgroundColor: '#f4d40f',
    color: '#333',
  },
  client: {
    backgroundColor: '#0f35df',
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
  }
};

export default UserManagement;