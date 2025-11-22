
import React, { useState, useEffect } from 'react';
import { getAllUsers, adminDeleteUser } from '../api/adminService';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
        fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <h1 style={{ marginLeft: '20px' }}>Loading Users...</h1>
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
    <Page title="User Management">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <input
          type="text"
          placeholder="Search Users by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            padding: '12px 16px',
            fontSize: '16px',
            width: '40%',
            outline: 'none',
          }}
        />
        <Link to="/users/create" style={{
          background: `linear-gradient(135deg, ${COLORS.yellow} 0%, ${COLORS.skyBlue} 100%)`,
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaPlus /> Create New User
        </Link>
      </div>
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        border: '2px solid rgba(255, 255, 255, 0.12)',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          color: 'white'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Email</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Phone</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Role</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Joined On</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <td style={{ padding: '16px' }}>{user.name}</td>
                <td style={{ padding: '16px' }}>{user.email}</td>
                <td style={{ padding: '16px' }}>{user.phone}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    backgroundColor: user.role === 'admin' ? COLORS.red : user.role === 'seller' ? COLORS.blue : COLORS.skyBlue,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>{user.role}</span>
                </td>
                <td style={{ padding: '16px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                  <Link to={`/user/${user.id}/edit`} style={{
                    color: COLORS.yellow,
                    cursor: 'pointer'
                  }}>
                    <FaEdit size={20} />
                  </Link>
                  <button onClick={() => handleDelete(user.id, user.name)} style={{
                    background: 'none',
                    border: 'none',
                    color: COLORS.red,
                    cursor: 'pointer'
                  }}>
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

export default UserManagement;