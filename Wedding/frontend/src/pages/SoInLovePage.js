import React, { useState, useEffect } from 'react';
import '../styles/SoInLovePage.css';
import Box from '@mui/material/Box';

// Import UI components
import Typography from '../components/ui/Typography';
import Button from '../components/ui/Button';

// Import image assets
import img1 from '../assets/images/123.jpg';
import img2 from '../assets/images/234.jpg';
import img3 from '../assets/images/456.jpg';
import img4 from '../assets/images/567.jpg';

/**
 * "So In Love" page component with fullscreen image carousel and event details
 */
export default function SoInLovePage() {
  useEffect(() => {
    document.body.classList.add('so-in-love-page');
    return () => document.body.classList.remove('so-in-love-page');
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
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        height: '100vh',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        m: 0,
        p: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Fullscreen background carousel */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
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
      
      {/* Glassy tile on the right */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: { xs: '50%', md: '5vw' },
          transform: { xs: 'translate(50%,-50%)', md: 'translateY(-50%)' },
          width: { xs: '90vw', md: '28vw' },
          minWidth: 0,
          borderRadius: '18px',
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          border: '1.5px solid rgba(255,255,255,0.13)',
          color: 'var(--primary-color)',
          p: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <Typography 
          sx={{ letterSpacing: 2, mb: 2, color: '#bdbdbd', fontWeight: 500, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}
        >
          WHAT
        </Typography>
        
        <Typography 
          variant="h4" 
          sx={{ mb: 2, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, letterSpacing: 1, color: '#222' }}
        >
          OUR WEDDING
        </Typography>
        
        <Typography 
          sx={{ letterSpacing: 2, mb: 2, color: '#bdbdbd', fontWeight: 500, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}
        >
          WHERE
        </Typography>
        
        <Typography 
          sx={{ mb: 2, fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, letterSpacing: 1, color: '#222' }}
        >
          De Harte<br />
          Onderstepoort
        </Typography>
        
        <Typography 
          sx={{ letterSpacing: 2, mb: 2, color: '#bdbdbd', fontWeight: 500, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}
        >
          WHEN
        </Typography>
        
        <Typography 
          sx={{ mb: 4, fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, letterSpacing: 1, color: '#222' }}
        >
          3PM – Late<br />
          October 3rd, 2026
        </Typography>
        
        <Button 
          variant="outlined" 
          style={{ 
            borderColor: '#222', 
            color: '#222', 
            borderRadius: 0, 
            px: 5, 
            py: 1, 
            fontSize: '1.1rem', 
            letterSpacing: 2, 
            fontFamily: 'Cormorant Garamond, serif' 
          }}
        >
          RSVP
        </Button>
      </Box>
    </Box>
  );
}