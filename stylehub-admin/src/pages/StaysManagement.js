
import React, { useState, useEffect } from 'react';
import { getAllStays, deleteStay } from '../api/adminService';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

function StaysManagement() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStays();
  }, []);

  const fetchStays = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllStays();
      setStays(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stayId) => {
    if (window.confirm('Are you sure you want to permanently delete this stay?')) {
      try {
        await deleteStay(stayId);
        setStays((prev) => prev.filter((s) => s.id !== stayId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredStays = stays.filter((stay) =>
    stay.name && stay.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 style={{ marginLeft: '20px' }}>Loading Stays...</h1>
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
    <Page title="Stays & Accommodation">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <input
          type="text"
          placeholder="Search Stays"
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
        <Link to="/stay/create" style={{
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
          <FaPlus /> Create New Stay
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
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Stay Name</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Host</th>
              <th style={{ padding: '16px', textAlign: 'right', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Price per Night</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Location</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStays.map((stay) => (
              <tr key={stay.id} style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <td style={{ padding: '16px' }}>{stay.name}</td>
                <td style={{ padding: '16px' }}>{stay.host?.email || 'Platform-Owned'}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  Ksh {parseFloat(stay.price).toFixed(2)}
                </td>
                <td style={{ padding: '16px' }}>{stay.location}</td>
                <td style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                  <Link to={`/stay/${stay.id}/edit`} style={{
                    color: COLORS.yellow,
                    cursor: 'pointer'
                  }}>
                    <FaEdit size={20} />
                  </Link>
                  <button onClick={() => handleDelete(stay.id)} style={{
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

export default StaysManagement;