
import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productService';
import { getServices } from '../api/serviceService';
import staysService from '../api/staysService';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, CircularProgress, Container, Button } from '@mui/material';
import Page from '../components/Page';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import StayCard from '../components/StayCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';


export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [pResp, sResp, stResp] = await Promise.all([
          getProducts({ limit: 12 }),
          getServices({ limit: 12 }),
          staysService.getAllStays({ limit: 12 })
        ]);

        setProducts(pResp.products || pResp || []);
        setServices(sResp.services || sResp || []);
        setStays(stResp.data || stResp || []);

        console.log('Fetched products response:', pResp);
        console.log('Fetched services response:', sResp);
        console.log('Fetched stays response:', stResp);

      } catch (err) {
        console.error('Failed loading marketplace:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading Marketplace...</Typography>
        </Box>
    );
  }
  
  const Section = ({title, viewAllLink, items, CardComponent}) => (
      <Box component="section" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{fontWeight: 'bold'}}>{title}</Typography>
          <Button 
            component={Link} 
            to={viewAllLink} 
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)',
                boxShadow: '0 0 15px rgba(255,255,255,0.4)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            View All
          </Button>
        </Box>
        {items.length === 0 ? (
          <Typography color="text.secondary">No {title.toLowerCase()} found.</Typography>
        ) : (
          <Swiper
            spaceBetween={15}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[Navigation, Pagination, Autoplay]}
            breakpoints={{
              600: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              900: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            style={{ paddingBottom: '40px' }} // Give space for pagination
          >
            {items.map(item => (
              <SwiperSlide key={item.id}>
                <CardComponent item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
  );
  
  const mapProductToItem = (p) => ({...p, id: p.id, item: p}); // Ensure id is directly on the item for key
  const mapServiceToItem = (s) => ({...s, id: s.id, item: s}); // Ensure id is directly on the item for key
  const mapStayToItem = (st) => ({...st, id: st.id, item: st}); // Ensure id is directly on the item for key


  return (
    <Page title="MARKETPLACE">
      <Container maxWidth="lg">
        <Section title="Products" viewAllLink="/products" items={products.map(mapProductToItem)} CardComponent={({item}) => <ProductCard product={item} />} />
        <Section title="Services" viewAllLink="/services" items={services.map(mapServiceToItem)} CardComponent={({item}) => <ServiceCard service={item} />} />
        <Section title="Stays" viewAllLink="/stays" items={stays.map(mapStayToItem)} CardComponent={({item}) => <StayCard stay={item} />} />
      </Container>
    </Page>
  );
}

