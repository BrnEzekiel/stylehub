// src/pages/ServicesPage.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getServices } from '../api/serviceService'; // ✅ Will work once serviceService.js exists

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = useQuery();
  const category = query.get('category');

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const params = category ? { category } : {};
        const data = await getServices(params);
        setServices(data);
        setError(null);
      } catch (err) {
        setError('Failed to load services.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [category]);

  if (loading) return <p className="admin-content">Loading services...</p>;
  if (error) return <p className="admin-content" style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="admin-content">
      <h2>{category ? `Services in ${category}` : 'All Services'}</h2>
      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <div className="product-grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceCard({ service }) {
  const isVerified = service.provider?.verificationStatus === 'approved';
  return (
    <div className="product-card">
      <Link to={`/services/${service.id}`} className="product-card-link">
        <img 
          src={service.imageUrl || 'https://placehold.co/600x400/007bff/FFFFFF?text=Service'} 
          alt={service.title} 
          className="product-card-image"
          onError={(e) => { e.target.src = "https://placehold.co/600x400/dc3545/FFFFFF?text=Missing"; }}
        />
        <div className="product-card-content">
          {isVerified && (
            <div className="verified-seller-badge" style={{ fontSize: '0.8em', marginBottom: '8px' }}>
              ✅ Verified Provider
            </div>
          )}
          <h3>{service.title}</h3>
          <p>Ksh {parseFloat(service.priceShopCents).toFixed(2)} (Shop)</p>
          {service.offersHome && (
            <p style={{ fontSize: '0.9em', color: '#555' }}>
              Home: Ksh {parseFloat(service.priceHomeCents).toFixed(2)}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ServicesPage;