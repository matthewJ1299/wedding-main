import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import HeaderNavigation from '../components/homepage/HeaderNavigation';
import '../styles/HomePageModern.css';

/**
 * RSVP landing page - shown when guests visit /rsvp without an invite code
 */
export default function RSVPLandingPage() {
  return (
    <Box className="home-page-modern">
      <HeaderNavigation />
      <Box sx={{ py: 10, px: 3, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 300,
            letterSpacing: '2px',
            mb: 3,
            color: '#222',
          }}
        >
          RSVP
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Arial, sans-serif',
            color: '#666',
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Please use the unique link from your invitation to RSVP. If you have lost your invite or have any questions, please don't hesitate to reach out.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          sx={{
            borderColor: '#2d5c3a',
            color: '#2d5c3a',
            '&:hover': { borderColor: '#1e4028', backgroundColor: 'rgba(45, 92, 58, 0.04)' },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}
