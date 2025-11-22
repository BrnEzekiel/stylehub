// src/pages/CreateProductPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/productService';
import { categories } from '../utils/categories';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

const CreateProductPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState(categories[0]); 
  const [image, setImage] = useState(null);
  
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

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', parseFloat(price).toFixed(2));
    formData.append('stock', parseInt(stock, 10));
    formData.append('category', category);
    
    if (image) {
      formData.append('image', image);
    } else {
      setError("Image file is required.");
      setLoading(false);
      return;
    }

    try {
      const newProduct = await createProduct(formData);
      console.log('Product created!', newProduct);
      alert('Product created successfully!');
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Failed to create product. Check server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={pageSx}>
        <Container maxWidth="md">
            <Typography variant="h4" sx={{color: COLOR_TEXT_DARK, fontWeight: '900', mb: 3}}>Create New Product</Typography>
            <Paper sx={{...paperSx, p: 4}}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label" sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                                Upload Image
                                <input type="file" accept="image/*" onChange={handleImageChange} required hidden />
                            </Button>
                            {image && <Typography sx={{display: 'inline', ml: 2}}>{image.name}</Typography>}
                        </Grid>
                        
                        {error && <Grid item xs={12}><Typography color="error">{error}</Typography></Grid>}

                        <Grid item xs={12}>
                            <Button type="submit" disabled={loading} variant="contained" size="large" fullWidth sx={{backgroundColor: COLOR_PRIMARY_BLUE}}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Product'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    </Box>
  );
};

export default CreateProductPage;