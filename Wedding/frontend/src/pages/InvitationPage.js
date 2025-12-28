import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvitees } from '../contexts/InviteeContext';
import invitePhoto from '../assets/images/invite-photo.png';
import '../styles/HomePageModern.css';

// Import our custom UI components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HeaderNavigation from '../components/homepage/HeaderNavigation';

/**
 * Wedding details configuration
 */
const weddingDetails = {
  date: 'SATURDAY',
  dateDetail: 'OCTOBER 3RD 2026',
  time: 'AT 3PM IN THE AFTERNOON',
  venue: 'De Harte',
  venue2: 'Onderstepoort',
  image: invitePhoto,
};

/**
 * Invitation page component that displays a wedding invitation for a specific guest
 */
const InvitationPage = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { invitees } = useInvitees();
  
  useEffect(() => {
    window.scrollTo(0, 0);
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
  
  // Find the invitee with the matching ID
  const invitee = invitees.find((inv) => inv.id === inviteCode);
  
  // Show error if invitee not found
  if (!invitee) {
    return (
      <Box className="home-page-modern">
        <HeaderNavigation />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography 
            sx={{ 
              fontFamily: 'Arial, sans-serif',
              color: '#222',
              fontSize: '1rem',
              letterSpacing: '1px'
            }}
          >
            Invalid invitation link.
          </Typography>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box className="home-page-modern">
      <HeaderNavigation />
      <Box 
        sx={{ 
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 4 }
        }}
      >
        <Card 
          sx={{ 
            maxWidth: '600px',
            width: '100%',
            borderRadius: 0,
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: 'none',
            background: '#fff'
          }}
        >
          <CardContent 
            sx={{ 
              p: { xs: 4, sm: 6, md: 8 },
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}
          >
            <Box
              component="img"
              src={weddingDetails.image}
              alt="Matt and Sydney"
              sx={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '50%',
                mb: 2
              }}
            />
            
            <Typography 
              sx={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#666',
                mb: 1
              }}
            >
              together with their families
            </Typography>
            
            <Typography 
              sx={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: { xs: '2.5rem', sm: '3rem' },
                fontWeight: 300,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: '#222',
                mb: -2
              }}
            >
              Matt
            </Typography>
            
            <Typography 
              sx={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: { xs: '2rem', sm: '2.5rem' },
                fontWeight: 300,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#222',
                mb: 2
              }}
            >
              & Sydney
            </Typography>
            
            <Typography 
              sx={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#666',
                mb: 3
              }}
            >
              invite you to their wedding ceremony
            </Typography>
            
            <Typography 
              sx={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: { xs: '1rem', sm: '1.2rem' },
                fontWeight: 300,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#222',
                lineHeight: 1.8,
                mb: 3
              }}
            >
              {weddingDetails.date}<br />
              {weddingDetails.dateDetail}<br />
              {weddingDetails.time}
            </Typography>
            
            <Typography 
              sx={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#222',
                lineHeight: 1.8,
                mb: 3
              }}
            >
              {weddingDetails.venue}<br />
              {weddingDetails.venue2}
            </Typography>
            
            <Typography 
              sx={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '1rem',
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#666',
                mb: 4
              }}
            >
              reception to follow
            </Typography>
            
            <Button
              onClick={() => navigate(`/rsvp/${inviteCode}`)}
              sx={{
                border: '1px solid #222',
                color: '#222',
                fontFamily: 'Arial, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 400,
                padding: '12px 32px',
                borderRadius: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                background: 'transparent',
                '&:hover': {
                  background: '#222',
                  color: '#fff',
                }
              }}
            >
              RSVP
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default InvitationPage;