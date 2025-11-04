// src/pages/CartPage.js

import React, { useState, useEffect } from 'react';
import { fetchCart, createOrder, removeItemFromCart } from '../api/cartService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState(null); 
  const [error, setError] = useState(null);
  
  // 1. 🛑 New state for checkout flow
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  
  const { token, user } = useAuth(); // 2. 🛑 Get user to pre-fill form
  const navigate = useNavigate();

  // 3. 🛑 New state for the address form
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Kenya', // Default to Kenya
  });

  // ... (loadCart and useEffect are unchanged) ...
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
    // 4. 🛑 Pre-fill form when user loads
    if (user) {
      setAddress(prev => ({ ...prev, fullName: user.name, phone: user.phone }));
    }
    loadCart();
  }, [token, navigate, user]);

  // 5. 🛑 Updated checkout handler
  const handleCheckout = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (cart.items.length === 0) return;
    
    setCheckoutLoading(true);
    setCheckoutMessage('');
    try {
      // 6. 🛑 Pass the address state to createOrder
      const newOrder = await createOrder(address);
      setCheckoutMessage(`Order #${newOrder.orderId.substring(0,8)} created! Total: Ksh ${newOrder.totalAmount}`);
      setCart({ items: [] }); 
      setShowAddressForm(false); // Hide form on success
    } catch (err) {
      setCheckoutMessage(err.message || 'Checkout failed. Please review your address and cart items.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // 7. 🛑 Updated remove item handler (passes cartItem.id)
  const handleRemoveItem = async (cartItemId) => {
    setRemovingItemId(cartItemId); 
    setError(null); 
    try {
      await removeItemFromCart(cartItemId);
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.id !== cartItemId),
      }));
    } catch (err) {
      setError(err.message || 'Failed to remove item.');
    } finally {
      setRemovingItemId(null);
    }
  };
  
  // 8. 🛑 New handler for address form input
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <p className="admin-content">Loading your cart...</p>;
  
  if (checkoutMessage.includes('created!')) {
    return (
      <div className="admin-content" style={{ textAlign: 'center' }}>
        <h2>🎉 Checkout Successful! 🎉</h2>
        <p style={{ color: 'green', fontSize: '1.2em' }}>{checkoutMessage}</p>
        <button className="top-nav-logout" style={{ background: 'var(--color-primary)' }} onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  if (error) return <p className="admin-content" style={{ color: 'red' }}>Error: {error}</p>;

  if (!cart.items || cart.items.length === 0) {
    return <h2 className="admin-content">Your cart is empty 🙁</h2>;
  }

  const cartTotal = cart.items.reduce((total, item) => {
    if (item.product && item.product.price) {
      return total + (parseFloat(item.product.price) * item.quantity); 
    }
    return total;
  }, 0);

  return (
    <div className="admin-content">
      {/* 9. 🛑 Conditional Rendering */}
      
      {/* --- STEP 1: SHOW CART --- */}
      {!showAddressForm && (
        <div className="dashboard-card">
          <h2>Your Shopping Cart</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => {
                const productName = item.product ? item.product.name : 'Product not found';
                const productPrice = item.product ? parseFloat(item.product.price).toFixed(2) : '0.00';
                const subtotal = item.product ? (parseFloat(item.product.price) * item.quantity).toFixed(2) : '0.00';
                
                return (
                  <tr key={item.id} style={{ opacity: removingItemId === item.id ? 0.5 : 1 }}>
                    <td>{productName}</td>
                    <td>{item.quantity}</td>
                    <td>Ksh {productPrice}</td>
                    <td>Ksh {subtotal}</td>
                    <td>
                      <button 
                        onClick={() => handleRemoveItem(item.id)} // 10. 🛑 Pass item.id (cartItemId)
                        disabled={removingItemId === item.id}
                        style={{ background: '#dc3545', color: 'white', padding: '5px 10px', fontSize: '0.9em' }}
                      >
                        {removingItemId === item.id ? '...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <hr style={{ margin: '20px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', paddingRight: '15px' }}>
            <h3 style={{ marginRight: '20px' }}>Total:</h3>
            <h3 style={{ color: 'var(--color-primary)' }}>Ksh {cartTotal.toFixed(2)}</h3>
          </div>
          
          <button 
            onClick={() => setShowAddressForm(true)} // 11. 🛑 Show address form
            style={styles.button}
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* --- STEP 2: SHOW ADDRESS FORM --- */}
      {showAddressForm && (
        <div className="dashboard-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2>Shipping Address</h2>
          <form onSubmit={handleCheckout}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} type="text" name="fullName" value={address.fullName} onChange={handleAddressChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input style={styles.input} type="tel" name="phone" value={address.phone} onChange={handleAddressChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Street Address</label>
              <input style={styles.input} type="text" name="street" value={address.street} onChange={handleAddressChange} required />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>City</label>
                <input style={styles.input} type="text" name="city" value={address.city} onChange={handleAddressChange} required />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>State / County</label>
                <input style={styles.input} type="text" name="state" value={address.state} onChange={handleAddressChange} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>ZIP / Postal Code</label>
                <input style={styles.input} type="text" name="zipCode" value={address.zipCode} onChange={handleAddressChange} required />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Country</label>
                <input style={styles.input} type="text" name="country" value={address.country} onChange={handleAddressChange} required />
              </div>
            </div>
            
            {checkoutMessage && !checkoutMessage.includes('created!') && (
              <p style={{ color: 'red', marginBottom: '10px' }}>{checkoutMessage}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', marginTop: '20px' }}>
              <button 
                type="button" 
                onClick={() => setShowAddressForm(false)}
                style={{ ...styles.button, background: '#6c757d' }}
              >
                Back to Cart
              </button>
              <button 
                type="submit"
                disabled={checkoutLoading} 
                style={styles.button}
              >
                {checkoutLoading ? 'Processing...' : `Pay Ksh ${cartTotal.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// 12. 🛑 Styles for the new form
const styles = {
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
    flex: 1,
    padding: '12px',
    fontSize: '1em',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  }
};

export default CartPage;