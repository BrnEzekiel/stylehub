// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/productService';
import { getServices } from '../api/serviceService';
import { getWalletDetails } from '../api/walletService';
import { getAllAvailableCategories } from '../api/categoryService';
import { useAuth } from '../context/AuthContext';
import 'swiper/css';
import 'swiper/css/pagination';
import { Box, Typography, Button, Grid, Paper, CircularProgress, Container } from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK, COLOR_ACCENT_MAGENTA, COLOR_BACKGROUND_LIGHT } from '../styles/theme';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import { Crown, Store, DesignServices, AccountBalanceWallet } from '@mui/icons-material';


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
        const categories = await getAllAvailableCategories();
        setAvailableCategories(categories);
        if (!user || user.role === 'client' || user.role === 'seller') {
          try {
            const productsData = await getProducts({ limit: 4, page: 1 });
            setFeaturedProducts(productsData.products || productsData || []);
          } catch (err) { console.error('Error loading products:', err); }
        }
        if ((!user || user.role === 'client') && categories.services.length > 0) {
          try {
            const servicesData = await getServices({ limit: 3 });
            setPopularServices(servicesData.services || servicesData || []);
          } catch (err) { console.error('Error loading services:', err); }
        }
        if (user) {
          try {
            const walletData = await getWalletDetails();
            setWallet(walletData);
          } catch (err) { /* Wallet might not be available, ignore */ }
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
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading...</Typography>
        </Box>
    );
  }

  const HeroSlide = ({ title, subtitle, buttonText, buttonLink, bgColor }) => (
    <Paper sx={{ ...paperSx, p: 4, backgroundColor: bgColor, color: 'white', display: 'flex', alignItems: 'center', height: '100%'}}>
        <Box>
            <Typography variant="h3" sx={{fontWeight: 'bold', mb: 1}}>{title}</Typography>
            <Typography variant="h6" sx={{mb: 2, opacity: 0.9}}>{subtitle}</Typography>
            <Button component={Link} to={buttonLink} variant="contained" sx={{backgroundColor: 'white', color: COLOR_PRIMARY_BLUE, '&:hover': {backgroundColor: '#f0f0f0'}}}>{buttonText}</Button>
        </Box>
    </Paper>
  );

  return (
    <Box sx={pageSx}>
        <Container maxWidth="lg">
            {/* --- Hero Banner --- */}
            <Box sx={{mb: 4}}>
                <Swiper modules={[Autoplay, Pagination]} loop={true} autoplay={{ delay: 5000 }} pagination={{ clickable: true }}>
                    <SwiperSlide>
                        <HeroSlide title="Welcome to StyleHub" subtitle="Your all-in-one platform for beauty, fashion, and premium stays" buttonText={user ? "Explore Marketplace" : "Get Started"} buttonLink={user ? "/marketplace" : "/login"} bgColor={COLOR_PRIMARY_BLUE} />
                    </SwiperSlide>
                    {(!user || user.role === 'client') && availableCategories.services.length > 0 && (
                        <SwiperSlide>
                            <HeroSlide title="Earn Loyalty Points" subtitle="Get rewards with every purchase and booking" buttonText="Browse Services" buttonLink="/services" bgColor={COLOR_ACCENT_MAGENTA} />
                        </SwiperSlide>
                    )}
                    {user && user.role === 'service_provider' && (
                        <SwiperSlide>
                           <HeroSlide title="Manage Your Services" subtitle="Create and manage your service offerings" buttonText="My Services" buttonLink="/my-services" bgColor="#2E7D32" />
                        </SwiperSlide>
                    )}
                    {user && user.role === 'seller' && (
                       <SwiperSlide>
                           <HeroSlide title="Sell Your Products" subtitle="Add products and reach more customers" buttonText="Add Product" buttonLink="/create-product" bgColor="#D84315" />
                        </SwiperSlide>
                    )}
                </Swiper>
            </Box>

            {/* --- Sections --- */}
            {(!user || user.role === 'client') && availableCategories.services.length > 0 && (
                <Box sx={{mb: 4}}>
                    <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Service Categories</Typography>
                    <Grid container spacing={2}>
                        {availableCategories.services.slice(0, 4).map(cat => (
                            <Grid item xs={6} md={3} key={cat}>
                                <Paper component={Link} to={`/services?category=${cat}`} sx={{...paperSx, p:3, textAlign: 'center', textDecoration: 'none'}}>
                                    <Typography variant="h6" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK}}>{cat}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {(!user || user.role === 'client') && popularServices.length > 0 && (
                <Box sx={{mb: 4}}>
                    <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Popular Services</Typography>
                    <Grid container spacing={2}>
                        {popularServices.map(service => (
                            <Grid item xs={12} sm={6} md={4} key={service.id}>
                                <ServiceCard service={service} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {(!user || user.role === 'client' || user.role === 'seller') && featuredProducts.length > 0 && (
                <Box sx={{mb: 4}}>
                    <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Featured Products</Typography>
                    <Grid container spacing={2}>
                        {featuredProducts.map((product) => (
                            <Grid item xs={6} sm={4} md={3} key={product.id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Paper sx={{...paperSx, p:3, mb: 4, backgroundColor: '#fffbe6'}}>
                 <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 1}}>💡 Did You Know?</Typography>
                 <Typography color="text.secondary">StyleHub connects you with talented professionals and exclusive products. Whether you're looking for beauty services, fashion items, or premium stays, you're in the right place!</Typography>
            </Paper>

            {user && wallet && (
                 <Paper sx={{...paperSx, p:3, backgroundColor: COLOR_PRIMARY_BLUE, color: 'white'}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Box>
                            <Typography variant="h6">Available Balance</Typography>
                            <Typography variant="h4" sx={{fontWeight: 'bold'}}>KSh {parseFloat(wallet.walletBalance || 0).toFixed(2)}</Typography>
                        </Box>
                         <AccountBalanceWallet sx={{fontSize: 40}}/>

                    </Box>
                    <Button component={Link} to="/my-wallet" variant="contained" sx={{mt: 2, backgroundColor: 'white', color: COLOR_PRIMARY_BLUE, '&:hover': {backgroundColor: '#f0f0f0'}}}>
                      View Wallet Details
                    </Button>
                </Paper>
            )}
      </Container>
    </Box>
  );
}

export default Home;