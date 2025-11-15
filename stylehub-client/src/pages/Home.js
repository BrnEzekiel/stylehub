// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faStar, faMapMarkerAlt, faCrown, faGift, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { getProducts } from '../api/productService';
import { getServices } from '../api/serviceService';
import { getWalletDetails } from '../api/walletService';
import { getAllAvailableCategories } from '../api/categoryService';
import { useAuth } from '../context/AuthContext';
import 'swiper/css';
import 'swiper/css/pagination';
import Container from '../components/Container';
import Card from '../components/Card';

function Home() {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [availableCategories, setAvailableCategories] = useState({ products: [], services: [] });
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load categories first to know what to show
        const categories = await getAllAvailableCategories();
        setAvailableCategories(categories);

        // Load products for clients and sellers
        if (!user || user.role === 'client' || user.role === 'seller') {
          try {
            const productsData = await getProducts({ limit: 4, page: 1 });
            setFeaturedProducts(productsData.products || productsData || []);
          } catch (err) {
            console.error('Error loading products:', err);
          }
        }

        // Load services only if categories exist and user is client
        if ((!user || user.role === 'client') && categories.services.length > 0) {
          try {
            const servicesData = await getServices({ limit: 3 });
            setPopularServices(servicesData.services || servicesData || []);
          } catch (err) {
            console.error('Error loading services:', err);
          }
        }

        // Load wallet if user is logged in
        if (user) {
          try {
            const walletData = await getWalletDetails();
            setWallet(walletData);
          } catch (err) {
            // Wallet might not be available, ignore
          }
        }
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);
  if (loading) {
    return (
      <div className="page-transition pb-20">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition" style={{ paddingBottom: '100px' }}>
      <Container>
      {/* --- Hero Banner --- */}
      <div className="hero-banner">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          className="h-40 md:h-56"
        >
          <SwiperSlide>
            <div className="h-full rounded-xl flex items-center relative" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-blue))' }}>
              <div className="p-6 z-10">
                <h2 className="text-white text-xl md:text-2xl font-bold mb-2">Welcome to StyleHub</h2>
                <p className="text-white text-sm md:text-base mb-4">Your all-in-one platform for services & products</p>
                <Link to="/products" className="bg-white px-4 py-2 rounded-md text-sm font-medium inline-block" style={{ color: 'var(--color-primary)' }}>Explore Now</Link>
              </div>
            </div>
          </SwiperSlide>
          {(!user || user.role === 'client') && availableCategories.services.length > 0 && (
          <SwiperSlide>
              <div className="h-full rounded-xl flex items-center relative" style={{ background: 'linear-gradient(to right, var(--color-blue), var(--color-secondary))' }}>
                <div className="p-6 z-10">
                <h2 className="text-white text-xl md:text-2xl font-bold mb-2">Earn Loyalty Points</h2>
                <p className="text-white text-sm md:text-base mb-4">Get rewards with every purchase and booking</p>
                  <Link to="/services" className="bg-white px-4 py-2 rounded-md text-sm font-medium inline-block" style={{ color: 'var(--color-blue)' }}>Browse Services</Link>
                </div>
              </div>
            </SwiperSlide>
          )}
          {user && user.role === 'service_provider' && (
            <SwiperSlide>
              <div className="h-full rounded-xl flex items-center relative" style={{ background: 'linear-gradient(to right, var(--color-blue), var(--color-secondary))' }}>
                <div className="p-6 z-10">
                  <h2 className="text-white text-xl md:text-2xl font-bold mb-2">Manage Your Services</h2>
                  <p className="text-white text-sm md:text-base mb-4">Create and manage your service offerings</p>
                  <Link to="/my-services" className="bg-white px-4 py-2 rounded-md text-sm font-medium inline-block" style={{ color: 'var(--color-blue)' }}>My Services</Link>
                </div>
              </div>
            </SwiperSlide>
          )}
          {user && user.role === 'seller' && (
            <SwiperSlide>
              <div className="h-full rounded-xl flex items-center relative" style={{ background: 'linear-gradient(to right, var(--color-blue), var(--color-secondary))' }}>
                <div className="p-6 z-10">
                  <h2 className="text-white text-xl md:text-2xl font-bold mb-2">Sell Your Products</h2>
                  <p className="text-white text-sm md:text-base mb-4">Add products and reach more customers</p>
                  <Link to="/create-product" className="bg-white px-4 py-2 rounded-md text-sm font-medium inline-block" style={{ color: 'var(--color-blue)' }}>Add Product</Link>
              </div>
            </div>
          </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* --- Service Categories Section (Only for clients, only if categories exist) --- */}
      {(!user || user.role === 'client') && availableCategories.services.length > 0 && (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Service Categories</h2>
            <Link to="/services" className="text-primary text-sm font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableCategories.services.slice(0, 4).map(cat => (
              <Link key={cat} to={`/services?category=${cat}`} className="category-card bg-white rounded-xl shadow overflow-hidden">
                <div className="relative h-32 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #f3e8ff)' }}>
                  <span className="text-gray-800 font-medium text-lg">{cat}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      )}

      {/* --- Popular Services Section (Only for clients, only if services exist) --- */}
      {(!user || user.role === 'client') && popularServices.length > 0 && (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Popular Services</h2>
            <Link to="/services" className="text-primary text-sm font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularServices.map(service => (
              <div key={service.id} className="bg-white rounded-xl shadow overflow-hidden card-hover">
                <Link to={`/services/${service.id}`}>
              <div className="relative">
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.title} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #f3e8ff)' }}>
                        <span className="text-gray-500">No Image</span>
                  </div>
                )}
                    {service.provider?.verificationStatus === 'approved' && (
                      <div className="verified-badge">
                        <FontAwesomeIcon icon={faShieldAlt} /> Verified
                </div>
                    )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-800 truncate">{service.title}</h3>
                      <span className="text-green-600 font-bold whitespace-nowrap ml-2">
                        KSh {parseFloat(service.priceShopCents || 0).toFixed(2)}
                      </span>
                </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{service.category}</span>
                      <span className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm">Book Now</span>
                </div>
              </div>
                </Link>
            </div>
          ))}
        </div>
      </div>
      )}
      
      {/* --- Featured Products Section (For clients and sellers) --- */}
      {(!user || user.role === 'client' || user.role === 'seller') && featuredProducts.length > 0 && (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/products" className="text-primary text-sm font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow overflow-hidden card-hover">
              <Link to={`/products/${product.id}`}>
                <div className="relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-36 object-cover" />
                    ) : (
                      <div className="w-full h-36 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)' }}>
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center">
                      <span className="text-green-600 font-bold">KSh {parseFloat(product.price || 0).toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* --- New Features Section: Products & Services Near You --- */}
      {(!user || user.role === 'client') && featuredProducts.length > 0 && (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">New Products Around You</h2>
          <Link to="/products" className="text-primary text-sm font-medium">View All</Link>
        </div>
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 text-center">
          <p className="text-gray-700 font-medium">Discover products added recently near your location</p>
          <p className="text-sm text-gray-600 mt-2">Browse new listings from verified sellers</p>
        </div>
      </div>
      )}

      {(!user || user.role === 'client') && popularServices.length > 0 && (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">New Services Around You</h2>
          <Link to="/services" className="text-primary text-sm font-medium">View All</Link>
        </div>
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-6 text-center">
          <p className="text-gray-700 font-medium">Explore services recently added in your area</p>
          <p className="text-sm text-gray-600 mt-2">Find new service providers and book with ease</p>
        </div>
      </div>
      )}

      {/* --- Did You Know Feature --- */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-l-4" style={{ borderLeftColor: 'var(--color-primary)' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-2">💡 Did You Know?</h3>
          <p className="text-gray-700">StyleHub connects you with talented professionals and exclusive products. Whether you're looking for services or shopping for unique items, you're in the right place!</p>
        </div>
      </div>

      {/* --- Wallet/Loyalty Section (Only for logged in users) --- */}
      {user && wallet && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Current balance and transaction history</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-blue))' }}>
              <FontAwesomeIcon icon={faCrown} className="text-white text-xl" />
            </div>
          </div>

          <div className="mb-4">
            <div className="text-2xl font-bold text-indigo-600 mb-2">
              KSh {parseFloat(wallet.walletBalance || 0).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Available Balance</p>
          </div>

          <Link to="/my-wallet" className="btn btn-primary w-full flex items-center justify-center">
            <FontAwesomeIcon icon={faGift} className="mr-2" /> View Wallet Details
          </Link>
        </Card>
      )}

      </Container>

    </div>
  );
}

export default Home;