import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../api/adminService';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
    fetchUsers();
  }, []);

  if (loading) return <p style={styles.loading}>Loading users...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Management</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.cell}>Name</th>
              <th style={styles.cell}>Email</th>
              <th style={styles.cell}>Phone</th>
              <th style={styles.cell}>Role</th>
              <th style={styles.cell}>Joined On</th>
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
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td style={styles.cell}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: '"Poppins", sans-serif',
    color: '#000',
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
    backgroundColor: '#0f35df', // Primary blue
    color: '#ffffff',
  },
  cell: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
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
    backgroundColor: '#fa0f8c', // Magenta
  },
  seller: {
    backgroundColor: '#f4d40f', // Yellow/gold
    color: '#333',
  },
  client: {
    backgroundColor: '#0f35df', // Blue
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

export default UserManagement;
