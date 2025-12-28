import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import HeaderNavigation from '../components/homepage/HeaderNavigation';
import AccommodationTab from '../components/admin/AccommodationTab';
import '../styles/HomePageModern.css';

const AccommodationPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const navbar = document.querySelector('.MuiAppBar-root');
    if (navbar) {
      navbar.style.display = 'none';
    }
    return () => {
      const restoredNavbar = document.querySelector('.MuiAppBar-root');
      if (restoredNavbar) {
        restoredNavbar.style.display = 'flex';
      }
    };
  }, []);

  return (
    <Box className="home-page-modern">
      <HeaderNavigation />
      <Box sx={{ width: '100%', background: '#fff', py: 4 }}>
        <AccommodationTab />
      </Box>
    </Box>
  );
};

export default AccommodationPage;
