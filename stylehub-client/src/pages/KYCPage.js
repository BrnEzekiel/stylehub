// src/pages/KYCPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getKycStatus, submitKyc } from '../api/kycService';
import Container from '../components/Container';
import Card from '../components/Card';

function KYCPage() {
  const [kycStatus, setKycStatus] = useState(null);
  const [docType, setDocType] = useState('national_id');
  const [documentFile, setDocumentFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔥 FIXED: Allow both 'seller' and 'service_provider'
    if (!token || (user?.role !== 'seller' && user?.role !== 'service_provider')) {
      navigate('/login');
      return;
    }

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const statusData = await getKYCStatus();
        setKycStatus(statusData);
        setError('');
      } catch (err) {
        if (err.message.includes('404')) {
          setKycStatus(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [token, user, navigate]);

  const handleDocumentChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };
  
  const handleSelfieChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentFile || !selfieFile) {
      setError('Please upload BOTH your ID document and a selfie.');
      return;
    }

    setSubmitLoading(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('doc_type', docType);
    formData.append('document', documentFile);
    formData.append('selfie', selfieFile);

    try {
      const newKyc = await submitKYC(formData);
      setKycStatus(newKyc);
      setSuccessMessage('Your KYC has been submitted! It is now pending approval.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p>Loading KYC Status...</p>;

  if (kycStatus?.status === 'approved') {
    return (
      <div style={{ padding: '20px', color: 'green' }}>
        <h2>KYC Status: Approved</h2>
        <p>Your KYC is approved! You can now create products or services.</p>
      </div>
    );
  }

  if (kycStatus?.status === 'pending') {
    return (
      <div style={{ padding: '20px', color: 'orange' }}>
        <h2>KYC Status: Pending</h2>
        <p>Your submission is currently under review by an admin.</p>
      </div>
    );
  }
  
  if (kycStatus?.status === 'rejected') {
    setError("Your previous submission was rejected. Please re-submit.");
    setKycStatus(null);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>KYC Submission</h2>
      <p>You must submit your KYC for approval before you can create products or services.</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="doc_type" style={{ display: 'block', marginBottom: '5px' }}>Document Type</label>
          <select
            id="doc_type"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="national_id">National ID</option>
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="document" style={{ display: 'block', marginBottom: '5px' }}>ID Document Image</label>
          <input
            type="file"
            id="document"
            accept="image/png, image/jpeg"
            onChange={handleDocumentChange}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="selfie" style={{ display: 'block', marginBottom: '5px' }}>Selfie Image</label>
          <input
            type="file"
            id="selfie"
            accept="image/png, image/jpeg"
            onChange={handleSelfieChange}
            required
            style={{ width: '100%' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        
        <button type="submit" disabled={submitLoading} style={{ width: '100%', padding: '10px' }}>
          {submitLoading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
}

export default KYCPage;