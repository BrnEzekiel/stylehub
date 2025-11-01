// src/pages/Register.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth to log in after register
import { register as apiRegister } from '../api/authService'; // Import the new register function

function Register() {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Make sure your API accepts this
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // Default role is 'client'
  
  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userData = {
      name,
      email,
      phone,
      password,
      role,
    };

    try {
      // 1. Call the register API
      const data = await apiRegister(userData);
      
      console.log('Registration successful!', data);

      // 2. Automatically log the user in
      // We use the data from the register response to update our AuthContext
      await login(email, password); 
      
      // 3. Redirect them
      if (role === 'seller') {
        // Sellers need to submit KYC
        alert('Registration successful! Please log in and submit your KYC documents to start selling.');
        navigate('/login'); // Send them to login (or a new KYC page)
      } else {
        // Clients can start shopping
        navigate('/'); // Redirect clients to the homepage
      }

    } catch (err) {
      // Show errors from the API (e.g., "Email already in use")
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Name Input */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Phone Input */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            id="password"
            minLength="8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Role Selector */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '5px' }}>I am a:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="client">Client (I want to buy)</option>
            <option value="seller">Seller (I want to sell)</option>
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}

export default Register;