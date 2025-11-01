// src/pages/CartPage.js

import React, { useState, useEffect } from 'react';
// 1. Import removeItemFromCart
import { fetchCart, createOrder, removeItemFromCart } from '../api/cartService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  // 2. Add state to track which specific item is being removed
  const [removingItemId, setRemovingItemId] = useState(null); 
  const [error, setError] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  
  const { token } = useAuth();
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const apiResponse = await fetchCart(); 
      const cartObject = apiResponse.cart || apiResponse; 
      setCart(cartObject.items ? cartObject : { items: [] });
      setError(null);
    } catch (err) {
      setError(err.message || 'Could not load cart. Please try again.');
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [token, navigate]);

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    setCheckoutLoading(true);
    setCheckoutMessage('');
    try {
      const newOrder = await createOrder();
      // 3. Change currency to Ksh
      setCheckoutMessage(`Order #${newOrder.id.substring(0,8)} created successfully! Total: Ksh ${newOrder.totalAmount}`);
      setCart({ items: [] }); 
    } catch (err) {
      setCheckoutMessage(err.message || 'Checkout failed. Please review cart items.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // 4. Add a handler for removing an item
  const handleRemoveItem = async (productId) => {
    // Note: We use productId because your backend route is /api/cart/:productId
    setRemovingItemId(productId); 
    setError(null); 

    try {
      await removeItemFromCart(productId);
      // 5. Update state locally to remove the item instantly
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.productId !== productId),
      }));
    } catch (err) {
      setError(err.message || 'Failed to remove item.');
    } finally {
      setRemovingItemId(null); // Hide spinner
    }
  };

  if (loading) return <p>Loading your cart...</p>;
  
  if (checkoutMessage.includes('successfully')) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🎉 Checkout Successful! 🎉</h2>
        <p style={{ color: 'green', fontSize: '1.2em' }}>{checkoutMessage}</p>
        <button onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  if (!cart.items || cart.items.length === 0) {
    return <h2 style={{ padding: '20px' }}>Your cart is empty 🙁</h2>;
  }

  const cartTotal = cart.items.reduce((total, item) => {
    if (item.product && item.product.price) {
      return total + (parseFloat(item.product.price) * item.quantity); 
    }
    return total;
  }, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Shopping Cart</h2>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cart.items.map((item) => {
          const productName = item.product ? item.product.name : 'Product not found';
          const productPrice = item.product ? parseFloat(item.product.price).toFixed(2) : '0.00';
          const subtotal = item.product ? (parseFloat(item.product.price) * item.quantity).toFixed(2) : '0.00';

          return (
            <li 
              key={item.id} // Use the unique cartItem.id as the key
              style={{ 
                border: '1px solid #ddd', 
                margin: '10px 0', 
                padding: '15px', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: removingItemId === item.productId ? 0.5 : 1, // Visual feedback
              }}
            >
              <div>
                <h4>{productName}</h4>
                <p>Quantity: {item.quantity}</p>
                {/* 6. Change currency to Ksh */}
                <p>Price: Ksh {productPrice} each</p> 
              </div>
              <div style={{ textAlign: 'right' }}>
                {/* 7. Change currency to Ksh */}
                <p>Subtotal: **Ksh {subtotal}**</p>
                {/* 8. Add the Remove button */}
                <button 
                  onClick={() => handleRemoveItem(item.productId)}
                  disabled={removingItemId === item.productId}
                  style={{ 
                    backgroundColor: '#dc3545', // Red color
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    marginTop: '5px'
                  }}
                >
                  {removingItemId === item.productId ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      
      <hr />
      
      {checkoutMessage && !checkoutMessage.includes('successfully') && (
        <p style={{ color: 'red', marginBottom: '10px' }}>{checkoutMessage}</p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h3>Total:</h3>
        {/* 9. Change currency to Ksh */}
        <h3 style={{ color: 'darkgreen' }}>Ksh {cartTotal.toFixed(2)}</h3>
      </div>
      
      <button 
        onClick={handleCheckout} 
        disabled={checkoutLoading} 
        className="checkout-button" // Use global style
      >
        {checkoutLoading ? 'Processing Order...' : 'Proceed to Checkout'}
      </button>

    </div>
  );
}

export default CartPage;