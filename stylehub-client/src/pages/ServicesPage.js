// src/pages/ServicesPage.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getServices } from '../api/serviceService';
import Container from '../components/Container';
import Card from '../components/Card';

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

  const servicesList = services.services || services || [];

  if (loading) {
    return (
      <div className="page-section">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="page-section">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-transition" style={{ paddingBottom: '80px' }}>
      <Container>
      <div className="page-section">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {category ? `Services in ${category}` : 'All Services'}
        </h1>
        {servicesList.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No services available.</p>
            {category && (
              <p className="text-gray-500 mt-2">Try browsing other categories or check back later.</p>
            )}
          </div>
        ) : (
          <div className="product-grid">
            {servicesList.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
      </Container>
    </div>
  );
}

function ServiceCard({ service }) {
  const isVerified = service.provider?.verificationStatus === 'approved';
  return (
    <div className="product-card card-hover">
      <Link to={`/services/${service.id}`} className="product-card-link">
        <div className="relative">
          {service.imageUrl ? (
            <img 
              src={service.imageUrl} 
              alt={service.title} 
              className="product-card-image"
              onError={(e) => { 
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400/dc3545/FFFFFF?text=Missing"; 
              }}
            />
          ) : (
            <div className="product-card-image flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)' }}>
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          {isVerified && (
            <div className="verified-badge">
              <i className="fas fa-check-circle"></i> Verified
            </div>
          )}
        </div>
        <div className="product-card-content">
          <h3 className="font-bold text-gray-800 mb-2">{service.title}</h3>
          <p className="text-green-600 font-bold text-lg mb-1">
            KSh {parseFloat(service.priceShopCents || 0).toFixed(2)} (Shop)
          </p>
          {service.offersHome && (
            <p className="text-sm text-gray-600">
              Home: KSh {parseFloat(service.priceHomeCents || 0).toFixed(2)}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ServicesPage;