// src/components/SlideInCart.js

import React, { useState, useEffect } from 'react';
import { fetchCart, removeItemFromCart } from '../api/cartService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// Helper to format currency
function formatCurrency(num) {
  const number = parseFloat(num);
  if (isNaN(number)) return 'Ksh 0.00';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KSH',
  }).format(number);
}

export function SlideInCart({ isOpen, onClose }) {
  const [cartData, setCartData] = useState({ items: [], subtotal: 0, shippingFee: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState(null);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!token) {
      setLoading(false);
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
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      loadCart();
    }
  }, [isOpen, token]);

  const handleRemoveItem = async (cartItemId) => {
    setRemovingItemId(cartItemId);
    try {
      await removeItemFromCart(cartItemId);
      loadCart(); // Reload cart to update totals
    } catch (err) {
      alert(err.message);
    } finally {
      setRemovingItemId(null);
    }
  };
  
  const handleCheckout = () => {
    onClose();
    navigate('/cart'); // Navigate to the full cart/checkout page
  };

  const { items, subtotal, shippingFee, total } = cartData;

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`slide-in-cart ${isOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Cart ({items.length})</h2>
            <button onClick={onClose} className="text-gray-500 focus:outline-none">
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <p>Loading cart...</p>
            ) : items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              items.map(item => (
                <div key={item.id} className="mb-4 pb-4 border-b" style={{ opacity: removingItemId === item.id ? 0.5 : 1 }}>
                  <div className="flex items-center">
                    <img src={item.product?.imageUrl || 'logo192.png'} alt={item.product?.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product?.name}</h3>
                      <p className="text-sm text-gray-600">{formatCurrency(item.product?.price)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="mx-2 w-8 text-center">Qty: {item.quantity}</span>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-red-500"
                        disabled={removingItemId === item.id}
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}