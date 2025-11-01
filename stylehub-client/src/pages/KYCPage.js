// src/pages/KYCPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getKYCStatus, submitKYC } from '../api/kycService';

function KYCPage() {
  const [kycStatus, setKycStatus] = useState(null);
  const [docType, setDocType] = useState('national_id'); // Default doc type
  const [documentFile, setDocumentFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { user, token } = useAuth();
  const navigate = useNavigate();

  // 1. Check for authorization and fetch current status
  useEffect(() => {
    if (!token || user?.role !== 'seller') {
      navigate('/login'); // Redirect non-sellers
      return;
    }

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const statusData = await getKYCStatus();
        setKycStatus(statusData);
        setError('');
      } catch (err) {
        // If status is 404 (not_submitted), API returns null, no error
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

  // 3. Handle form submission
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
    formData.append('document', documentFile); // This name must match the controller
    formData.append('selfie', selfieFile);     // This name must match the controller

    try {
      const newKyc = await submitKYC(formData);
      setKycStatus(newKyc); // Update status on success
      setSuccessMessage('Your KYC has been submitted! It is now pending approval.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // 4. Render UI based on status
  if (loading) return <p>Loading KYC Status...</p>;

  // If already submitted and approved
  if (kycStatus?.status === 'approved') {
    return (
      <div style={{ padding: '20px', color: 'green' }}>
        <h2>KYC Status: Approved</h2>
        <p>Your KYC is approved! You can now create products.</p>
      </div>
    );
  }

  // If already submitted and pending
  if (kycStatus?.status === 'pending') {
    return (
      <div style={{ padding: '20px', color: 'orange' }}>
        <h2>KYC Status: Pending</h2>
        <p>Your submission is currently under review by an admin.</p>
      </div>
    );
  }
  
  // If rejected, show form again (upsert will update it)
  if (kycStatus?.status === 'rejected') {
     setError("Your previous submission was rejected. Please re-submit.");
     setKycStatus(null); // Clear status to re-show the form
  }

  // If not submitted yet, show the form
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Seller KYC Submission</h2>
      <p>You must submit your KYC for approval before you can create products.</p>
      
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