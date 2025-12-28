import React, { useState, useEffect } from 'react';
import '../styles/HomePageFrosted.css';
import Box from '@mui/material/Box';

// Import UI components
import Typography from '../components/ui/Typography';
import { loadFont } from '../utils/fontLoader';

// Import image assets
import img1 from '../assets/images/123.jpg';
import img2 from '../assets/images/234.jpg';
import img3 from '../assets/images/456.jpg';
import img4 from '../assets/images/567.jpg';

// Load Google Fonts
loadFont('Great Vibes', 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

/**
 * Alternative home page with frosted glass effect
 */
export default function HomePageFrosted() {
  useEffect(() => {
    document.body.classList.add('home-frosted-page');
    return () => document.body.classList.remove('home-frosted-page');
  }, []);
  const carouselImages = [img1, img2, img3, img4];
  const [current, setCurrent] = useState(0);
  
  // For smooth sliding, use a timer to increment current
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100vw',
      height: '100vh',
      minHeight: '100vh',
      overflow: 'hidden',
      overflowX: 'hidden',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      m: 0,
      p: 0,
      pt: { xs: '100px', sm: '120px' }, // Increased padding to match navbar height
      position: 'relative' // Ensure proper positioning context
    }}>
      {/* Full-width, 100vh image carousel with percentage-based logic */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1, // Restored to positive value but still below navbar (9000)
          m: 0,
          p: 0,
          border: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            width: `${carouselImages.length * 100}%`,
            transform: `translateX(-${current * (100 / carouselImages.length)}%)`,
            transition: 'transform 1s cubic-bezier(0.77, 0, 0.175, 1)',
            m: 0,
            p: 0,
            border: 'none',
          }}
        >
          {carouselImages.map((img, idx) => (
            <Box
              key={idx}
              component="img"
              src={img}
              alt={`Banner ${idx + 1}`}
              sx={{
                width: `${100 / carouselImages.length}%`,
                height: '100vh',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                m: 0,
                p: 0,
                border: 'none',
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Centered frosted glass text tile */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: { xs: '85vw', sm: '60vw', md: '40vw', lg: '35vw' }, // Responsive width
          minWidth: 0,
          borderRadius: '18px',
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          color: 'var(--primary-color)',
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography preset="invitation-text" sx={{ mb: 2 }}>
          together with their families
        </Typography>
        
        <Typography preset="title" variant="h2">
          Matt
        </Typography>
        
        <Typography preset="subtitle" sx={{ mt: -2, mb: 2 }}>
          & Sydney
        </Typography>
        
        <Typography preset="invitation-text" sx={{ mb: 2 }}>
          invite you to their wedding ceremony
        </Typography>
        
        <Typography preset="invitation-header" sx={{ mb: 1 }}>
          SATURDAY<br />
          OCTOBER 3RD 2026<br />
          AT 3PM IN THE AFTERNOON
        </Typography>
        
        <Typography preset="invitation-text" sx={{ mb: 2 }}>
          De Harte<br />
          Onderstepoort
        </Typography>
        
        <Typography preset="elegant-accent" sx={{ fontSize: '1.7rem', mt: 1 }}>
          reception to follow
        </Typography>
      </Box>
    </Box>
  );
}