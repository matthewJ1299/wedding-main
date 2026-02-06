import React from 'react';
import Box from '@mui/material/Box';
import {
  HeaderNavigation,
  HeroSection,
  ScheduleSection,
  LocationSection,
  OurStorySection,
  TravelStaySection,
  RegistrySection,
  MenuSection,
  FAQSection,
} from '../components/homepage';
import '../styles/HomePageModern.css';

/**
 * Modern minimalist home page matching the design specification
 */
export default function HomePage() {
  return (
    <Box className="home-page-modern">
      <HeaderNavigation />
      <HeroSection />
      <OurStorySection />
      <LocationSection />
      <ScheduleSection />
      <MenuSection />
      <TravelStaySection />
      <RegistrySection />
      <FAQSection />
    </Box>
  );
}
