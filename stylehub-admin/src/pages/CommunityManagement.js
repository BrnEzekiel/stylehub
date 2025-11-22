
import React, { useState, useEffect } from 'react';
import { getAllCommunityPosts, deleteCommunityPost } from '../api/adminService';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

function CommunityManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllCommunityPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to permanently delete this community post?')) {
      try {
        await deleteCommunityPost(postId);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 style={{ marginLeft: '20px' }}>Loading Community Posts...</h1>
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
    <Page title="Community Management">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <input
          type="text"
          placeholder="Search Posts"
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
        <Link to="/community/create" style={{
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
          <FaPlus /> Create New Post
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
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Title</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Author</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <td style={{ padding: '16px' }}>{post.title}</td>
                <td style={{ padding: '16px' }}>{post.author?.email || 'Admin'}</td>
                <td style={{ padding: '16px' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                  <Link to={`/community/${post.id}/edit`} style={{
                    color: COLORS.yellow,
                    cursor: 'pointer'
                  }}>
                    <FaEdit size={20} />
                  </Link>
                  <button onClick={() => handleDelete(post.id)} style={{
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

export default CommunityManagement;