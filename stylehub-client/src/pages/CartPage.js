// src/pages/CartPage.js

import React, { useState, useEffect } from 'react';
import { fetchCart, createOrder, removeItemFromCart } from '../api/cartService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState(null); 
  const [error, setError] = useState(null);
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
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
      setCart(apiResponse.cart || { items: [] });
      // 1. 🛑 Set all new totals
      setSubtotal(parseFloat(apiResponse.subtotal));
      setShippingFee(parseFloat(apiResponse.shippingFee));
      setTotal(parseFloat(apiResponse.total));
      setError(null);
    } catch (err) {
      setError(err.message || 'Could not load cart. Please try again.');
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setAddress(prev => ({ ...prev, fullName: user.name, phone: user.phone }));
    }
    loadCart();
  }, [token, navigate, user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.items.length === 0) return;
    
    setCheckoutLoading(true);
    setCheckoutMessage('');
    try {
      const newOrder = await createOrder(address);
      setCheckoutMessage(`Order #${newOrder.orderId.substring(0,8)} created! Total: Ksh ${newOrder.totalAmount}`);
      setCart({ items: [] }); 
      setSubtotal(0);
      setTotal(0);
      setShowAddressForm(false);
    } catch (err) {
      setCheckoutMessage(err.message || 'Checkout failed. Please review your address and cart items.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    setRemovingItemId(cartItemId); 
    setError(null); 
    try {
      await removeItemFromCart(cartItemId);
      loadCart(); // 2. 🛑 Reload the cart to recalculate totals
    } catch (err) {
      setError(err.message || 'Failed to remove item.');
    } finally {
      setRemovingItemId(null);
    }
  };
  
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

  return (
    <div className="admin-content">
      
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
                        onClick={() => handleRemoveItem(item.id)}
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
          
          {/* 3. 🛑 NEW: Updated totals section */}
          <div style={{ padding: '0 15px', maxWidth: '400px', marginLeft: 'auto' }}>
            <div style={styles.totalRow}>
              <span>Subtotal:</span>
              <span>Ksh {subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>Shipping Fee:</span>
              <span>Ksh {shippingFee.toFixed(2)}</span>
            </div>
            <div style={{...styles.totalRow, ...styles.grandTotal}}>
              <span>Grand Total:</span>
              <span>Ksh {total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddressForm(true)}
            style={{...styles.button, width: '100%', marginTop: '20px'}}
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

            {/* 4. 🛑 Show new totals on checkout page */}
            <hr style={{ margin: '20px 0' }} />
            <div style={styles.totalRow}>
              <span>Subtotal:</span>
              <span>Ksh {subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>Shipping Fee:</span>
              <span>Ksh {shippingFee.toFixed(2)}</span>
            </div>
            <div style={{...styles.totalRow, ...styles.grandTotal}}>
              <span>Grand Total:</span>
              <span>Ksh {total.toFixed(2)}</span>
            </div>
            <hr style={{ margin: '20px 0' }} />

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
                {checkoutLoading ? 'Processing...' : `Pay Ksh ${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

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
  },
  // 5. 🛑 New styles for totals
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '1.1em',
  },
  grandTotal: {
    paddingTop: '10px',
    borderTop: '1px solid #eee',
    fontWeight: '600',
    fontSize: '1.3em',
    color: 'var(--color-primary)',
  }
};

export default CartPage;