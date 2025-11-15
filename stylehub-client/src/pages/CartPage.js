// src/pages/CartPage.js

import React, { useState, useEffect } from 'react';
import { fetchCart, createOrder, removeItemFromCart } from '../api/cartService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Container from '../components/Container';
import Card from '../components/Card';

// Helper to format currency
function formatCurrency(num) {
  const number = parseFloat(num);
  if (isNaN(number)) return 'Ksh 0.00';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KSH',
  }).format(number);
}

function CartPage() {
  const [cartData, setCartData] = useState({ items: [], subtotal: 0, shippingFee: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Kenya',
  });

  const loadCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const apiResponse = await fetchCart();
      setCartData({
        items: apiResponse.cart.items || [],
        subtotal: apiResponse.subtotal,
        shippingFee: apiResponse.shippingFee,
        total: apiResponse.total,
      });
      // Pre-fill address
      if (user) {
        setAddress(prev => ({ 
          ...prev, 
          fullName: user.name || '', 
          phone: user.phone || '' 
        }));
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartData.items.length === 0) return;
    
    setCheckoutLoading(true);
    setCheckoutMessage('');
    try {
      const newOrder = await createOrder(address);
      setCheckoutMessage(`Order #${newOrder.orderId.substring(0,8)} created! Total: ${formatCurrency(newOrder.totalAmount)}`);
      setCartData({ items: [], subtotal: 0, shippingFee: 0, total: 0 }); 
    } catch (err) {
      setCheckoutMessage(err.message || 'Checkout failed. Please review your address and cart items.');
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="page-transition" style={{ paddingBottom: '80px' }}>
        <Container>
        <div className="page-section">
          <p className="text-gray-600">Loading your cart...</p>
        </div>
        </Container>
      </div>
    );
  }

  const { items, subtotal, shippingFee, total } = cartData;

  if (checkoutMessage.includes('created!')) {
    return (
      <div className="page-transition" style={{ paddingBottom: '80px' }}>
        <Container>
        <div className="page-section text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Checkout Successful! 🎉</h2>
          <p className="text-lg text-green-600 mb-6">{checkoutMessage}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-transition" style={{ paddingBottom: '80px' }}>
      <Container>
      <div className="page-section">
        <button onClick={() => navigate(-1)} className="text-primary mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Address Form */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
            <form onSubmit={handleCheckout}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={address.fullName} 
                  onChange={handleAddressChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  style={{ 
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--color-primary)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={address.phone} 
                  onChange={handleAddressChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--color-primary)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input 
                  type="text" 
                  name="street" 
                  value={address.street} 
                  onChange={handleAddressChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--color-primary)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={address.city} 
                    onChange={handleAddressChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--color-primary)'}
                    onBlur={(e) => e.target.style.boxShadow = ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State / County</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={address.state} 
                    onChange={handleAddressChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--color-primary)'}
                    onBlur={(e) => e.target.style.boxShadow = ''}
                  />
                </div>
              </div>
              
              {checkoutMessage && !checkoutMessage.includes('created!') && (
                <div className="alert alert-error mb-4">{checkoutMessage}</div>
              )}
              
              <button 
                type="submit"
                disabled={checkoutLoading || items.length === 0} 
                className="btn btn-primary w-full"
              >
                {checkoutLoading ? 'Processing...' : `Pay ${formatCurrency(total)}`}
              </button>
            </form>
          </div>
          
          {/* Right Side: Order Summary */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center">
                  <img src={item.product?.imageUrl} alt={item.product?.name} className="w-12 h-12 object-cover rounded-md mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.product?.name}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(item.product?.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Container>
    </div>
  );
}

export default CartPage;