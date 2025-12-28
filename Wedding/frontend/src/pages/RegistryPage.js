import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HeaderNavigation from '../components/homepage/HeaderNavigation';
import '../styles/HomePageModern.css';

export default function RegistryPage() {
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
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#fff',
          m: 0,
          p: 3,
          pb: 8
        }}
      >
        <Box
          sx={{
            color: '#222',
            textAlign: 'center',
            width: { xs: '95%', sm: '90%', md: '80%' },
            maxWidth: '1200px',
            py: { xs: 4, sm: 5 }
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 300,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontSize: { xs: '1.8rem', sm: '2.2rem' }
            }}
          >
            REGISTRY
          </Typography>

          <Typography
            variant="body1"
            sx={{
              width: { xs: '100%', md: '80%' },
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              mb: 5,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 300,
              letterSpacing: '1px',
              color: '#666',
              lineHeight: 1.6
            }}
          >
            Thank you for considering a gift as we begin our new life together. Your presence at our wedding is the greatest gift of all, but if you wish to honor us with a present, you may deposit into this account
          </Typography>

          <Box
            sx={{
              mt: 2,
              p: 3,
              borderRadius: 2,
              background: 'rgba(var(--accent-color-rgb, 4, 58, 20), 0.05)',
              width: { xs: '100%', sm: '80%', md: '60%' },
              mx: 'auto',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              Account Details
            </Typography>
            <Typography>
              Bank Account:
              Investec Private
              Account Number: 10014595936
              SWIFT Code: IVESZAJJXXX
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}