// src/pages/CreateProductPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/productService';

const CreateProductPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null); // State for the file
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Create FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    
    // 🛑 FIX 1: Parse price as a float and fix it to 2 decimal places.
    // This prevents sending strange floating point errors and ensures correct API handling.
    formData.append('price', parseFloat(price).toFixed(2));
    
    // 🛑 FIX 2: PARSE STOCK AS A WHOLE INTEGER (INT).
    // This resolves the "Unable to fit value... into a 64-bit signed integer" error.
    formData.append('stock', parseInt(stock, 10));
    
    formData.append('category', category);
    
    if (image) {
        formData.append('image', image); // Append the file only if it exists
    } else {
        // Handle case where image is required but missing (though form requires it)
        setError("Image file is required.");
        setLoading(false);
        return;
    }

    try {
      // 2. Call the API
      const newProduct = await createProduct(formData);
      
      console.log('Product created!', newProduct);
      alert('Product created successfully!');
      
      // 3. Redirect to the new product's page (or back to products)
      navigate('/products'); 
      
    } catch (err) {
      // API error usually comes in the .message property
      setError(err.message || 'Failed to create product. Check server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: '10px' }}>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {/* Description */}
        <div style={{ marginBottom: '10px' }}>
          <label>Description: </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* Price */}
        <div style={{ marginBottom: '10px' }}>
          <label>Price: </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        {/* Stock */}
        <div style={{ marginBottom: '10px' }}>
          <label>Stock: </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        {/* Category */}
        <div style={{ marginBottom: '10px' }}>
          <label>Category: </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        {/* Image */}
        <div style={{ marginBottom: '10px' }}>
          <label>Image: </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;