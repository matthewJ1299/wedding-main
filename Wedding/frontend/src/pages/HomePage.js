import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import {
  HeaderNavigation,
  HeroSection,
  ScheduleSection,
  LocationSection,
  CountdownSection,
  RegistryDressCodeSection,
} from '../components/homepage';
import '../styles/HomePageModern.css';

/**
 * Modern minimalist home page matching the design specification
 */
export default function HomePage() {
  useEffect(() => {
    // Hide the default navbar for this page
    const navbar = document.querySelector('.MuiAppBar-root');
    if (navbar) {
      navbar.style.display = 'none';
    }
    return () => {
      // Restore navbar when leaving page
      const restoredNavbar = document.querySelector('.MuiAppBar-root');
      if (restoredNavbar) {
        restoredNavbar.style.display = 'flex';
      }
    };
  }, []);

  return (
    <Box className="home-page-modern">
      <HeaderNavigation />
      <HeroSection />
      <ScheduleSection />
      <LocationSection />
      <CountdownSection />
      <RegistryDressCodeSection />
    </Box>
  );
}
