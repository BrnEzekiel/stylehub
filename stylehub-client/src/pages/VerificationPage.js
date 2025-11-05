// src/pages/VerificationPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVerificationStatus, submitVerification } from '../api/verificationService';

// Re-using styles from KYCPage.js
const styles = {
  container: {
    maxWidth: '700px',
    margin: '20px auto',
    padding: '25px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: '1.8rem',
    color: '#0f35df',
    marginBottom: '20px',
  },
  statusCard: {
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  pending: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f4d40f',
    color: '#713f12',
  },
  approved: {
    backgroundColor: '#dcfce7',
    border: '1px solid #22c55e',
    color: '#15803d',
  },
  rejected: {
    backgroundColor: '#fee2e2',
    border: '1px solid #ef4444',
    color: '#991b1b',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  button: {
    padding: '12px 20px',
    fontSize: '1em',
    backgroundColor: '#0f35df',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  error: { color: '#dc3545', marginBottom: '10px' },
  success: { color: '#28a745', marginBottom: '10px' },
  loading: { color: '#0f35df' },
};

function VerificationPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState('unverified');
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [socialMediaUrl, setSocialMediaUrl] = useState('');
  const [businessLicense, setBusinessLicense] = useState(null);
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getVerificationStatus();
        setStatus(data.status);
        setSubmission(data.submission);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadStatus();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!businessLicense) {
      setFormError('Please upload your business license file.');
      return;
    }

    setFormLoading(true);
    const formData = new FormData();
    formData.append('businessName', businessName);
    formData.append('socialMediaUrl', socialMediaUrl);
    formData.append('businessLicense', businessLicense);

    try {
      await submitVerification(formData);
      setFormSuccess('Submission successful! Your documents are now under review.');
      setStatus('pending'); // Update UI
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const renderStatus = () => {
    if (loading) return <p style={styles.loading}>Loading verification status...</p>;
    
    switch (status) {
      case 'approved':
        return (
          <div style={{...styles.statusCard, ...styles.approved}}>
            <h3>Congratulations, you are a Verified Seller!</h3>
            <p>The "Local Authenticity Badge" will now appear on your profile and products.</p>
          </div>
        );
      case 'pending':
        return (
          <div style={{...styles.statusCard, ...styles.pending}}>
            <h3>Submission Under Review</h3>
            <p>Your verification documents have been received and are currently being reviewed by our team. This may take 2-3 business days.</p>
          </div>
        );
      case 'rejected':
        return (
          <div>
            <div style={{...styles.statusCard, ...styles.rejected}}>
              <h3>Submission Rejected</h3>
              <p>Unfortunately, your verification submission could not be approved. Please review your documents and resubmit.</p>
              {/* This will show the form again */}
            </div>
            {renderForm()}
          </div>
        );
      case 'unverified':
      default:
        return renderForm();
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <p>Submit your business documents to get the "Local Authenticity Badge". This helps build trust with buyers.</p>
      
      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="businessName">Registered Business Name</label>
        <input
          style={styles.input}
          type="text"
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="socialMediaUrl">Social Media or Website (Optional)</label>
        <input
          style={styles.input}
          type="url"
          id="socialMediaUrl"
          placeholder="https://instagram.com/mybusiness"
          value={socialMediaUrl}
          onChange={(e) => setSocialMediaUrl(e.target.value)}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="businessLicense">Business License / Permit (PDF, PNG, JPG)</label>
        <input
          style={styles.input}
          type="file"
          id="businessLicense"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setBusinessLicense(e.target.files[0])}
          required
        />
      </div>

      {formError && <p style={styles.error}>{formError}</p>}
      {formSuccess && <p style={styles.success}>{formSuccess}</p>}

      <button type="submit" style={styles.button} disabled={formLoading}>
        {formLoading ? 'Submitting...' : 'Submit for Verification'}
      </button>
    </form>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Seller Verification</h2>
      {renderStatus()}
    </div>
  );
}

export default VerificationPage;