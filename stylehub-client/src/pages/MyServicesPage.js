// src/pages/MyServicesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyServices } from '../api/serviceService';

function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyServices();
        setServices(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="admin-content">Loading your services...</p>;

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Services</h2>
        <Link to="/my-services/create" style={{ background: 'var(--color-primary)', color: 'white', padding: '8px 16px', borderRadius: '5px', textDecoration: 'none' }}>
          + Create Service
        </Link>
      </div>
      {services.length === 0 ? (
        <p>You haven’t created any services yet.</p>
      ) : (
        <div className="product-grid">
          {services.map((s) => (
            <div key={s.id} className="product-card">
              <img src={s.imageUrl} alt={s.title} className="product-card-image" />
              <div className="product-card-content">
                <h3>{s.title}</h3>
                <p>Ksh {parseFloat(s.priceShopCents).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyServicesPage;