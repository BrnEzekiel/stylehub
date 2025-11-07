// src/pages/PortfolioUploadPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getPortfolioStatus, submitPortfolio } from '../api/portfolioService'; // ✅ Will work once portfolioService.js exists

function PortfolioUploadPage() {
  const [statusData, setStatusData] = useState(null);
  const [bio, setBio] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== 'service_provider') {
      navigate('/login');
      return;
    }
    const fetchStatus = async () => {
      try {
        const data = await getPortfolioStatus();
        setStatusData(data);
      } catch (err) {
        // Not submitted yet
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('portfolioUrl', portfolioUrl);
    if (videoFile) formData.append('videoUrl', videoFile);

    try {
      await submitPortfolio(formData);
      setMessage('Portfolio submitted! Awaiting admin approval.');
      setStatusData({ status: 'pending' });
    } catch (err) {
      setMessage(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="admin-content">Loading...</p>;
  if (statusData?.status === 'approved') {
    return <p className="admin-content" style={{ color: 'green' }}>✅ Your portfolio is approved! You can now create services.</p>;
  }
  if (statusData?.status === 'pending') {
    return <p className="admin-content" style={{ color: 'orange' }}>⏳ Your portfolio is under review.</p>;
  }

  return (
    <div className="admin-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Submit Your Portfolio</h2>
      <p>Upload your portfolio to become an approved service provider.</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Bio (About you)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            style={{ width: '100%', height: '100px', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Portfolio URL (e.g., Behance, Instagram)</label>
          <input
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Optional Video Pitch</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px' }}>
          {submitting ? 'Submitting...' : 'Submit Portfolio'}
        </button>
        {message && <p style={{ marginTop: '10px', color: message.includes('approved') ? 'green' : 'red' }}>{message}</p>}
      </form>
    </div>
  );
}

export default PortfolioUploadPage;