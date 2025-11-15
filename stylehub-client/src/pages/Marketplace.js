// src/pages/Marketplace.js

import React, { useState, useEffect } from 'react';
import Container from '../components/Container';
import Card from '../components/Card';
import { getProducts } from '../api/productService';
import { getServices } from '../api/serviceService';
import { Link } from 'react-router-dom';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [pResp, sResp] = await Promise.all([
          getProducts({ limit: 12 }),
          getServices({ limit: 12 })
        ]);
        setProducts(pResp.products || pResp || []);
        setServices(sResp.services || sResp || []);
      } catch (err) {
        console.error('Failed loading marketplace:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="page-section">
      <div className="text-center py-20">Loading marketplace…</div>
    </div>
  );

  return (
    <div className="page-transition" style={{ paddingBottom: '100px' }}>
      <Container>
        <div className="page-section">
          <h1 className="text-2xl font-bold mb-4">Marketplace</h1>

          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Products</h2>
              <Link to="/products" className="text-sm text-primary">View All</Link>
            </div>
            {products.length === 0 ? (
              <div className="text-gray-600">No products found.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => (
                  <Card key={p.id} className="p-3">
                    <Link to={`/products/${p.id}`} className="block">
                      <div className="w-full h-36 mb-3 overflow-hidden rounded-md">
                        {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                      </div>
                      <div className="font-medium text-gray-800">{p.name}</div>
                      <div className="text-sm text-green-600">KSh {parseFloat(p.price || 0).toFixed(2)}</div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Services</h2>
              <Link to="/services" className="text-sm text-primary">View All</Link>
            </div>
            {services.length === 0 ? (
              <div className="text-gray-600">No services found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(s => (
                  <Card key={s.id} className="p-3">
                    <Link to={`/services/${s.id}`} className="block">
                      <div className="w-full h-36 mb-3 overflow-hidden rounded-md">
                        {s.imageUrl ? <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                      </div>
                      <div className="font-medium text-gray-800">{s.title}</div>
                      <div className="text-sm text-gray-600">{s.category || ''} • KSh {parseFloat(s.priceShopCents || 0).toFixed(2)}</div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
