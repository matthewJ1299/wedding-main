import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useInvitees } from '../contexts/InviteeContext';
import { useInviteeNavigation } from '../contexts/InviteeNavigationContext';
import invitePhoto from '../assets/images/invite-photo.png';
import '../styles/HomePageModern.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HeaderNavigation from '../components/homepage/HeaderNavigation';
import { getInvitationDetails } from '../data/copy';

const invitationDetails = getInvitationDetails();

/**
 * Invitation page component that displays a wedding invitation for a specific guest
 */
const InvitationPage = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { invitees } = useInvitees();
  const { inviteeId, hasInviteeContext } = useInviteeNavigation();

  const getUrlWithContext = (path) => (hasInviteeContext ? `${path}?invitee=${inviteeId}` : path);
  
  useEffect(() => {
    window.scrollTo(0, 0);
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
              fontFamily: 'Cormorant Garamond, serif',
              color: '#222',
              fontSize: '1rem',
              letterSpacing: '1px',
              mb: 2,
            }}
          >
            Invalid invitation link.
          </Typography>
          <Button component={Link} to="/" variant="outlined" sx={{ borderColor: '#222', color: '#222' }}>
            Back to Home
          </Button>
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
              src={invitePhoto}
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
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '0.9rem',
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#666',
                mb: 1,
              }}
            >
              {invitationDetails.familiesLine}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: { xs: '2.5rem', sm: '3rem' },
                fontWeight: 300,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: '#222',
                mb: -2,
              }}
            >
              {invitationDetails.groom}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: { xs: '2rem', sm: '2.5rem' },
                fontWeight: 300,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#222',
                mb: 2,
              }}
            >
              & {invitationDetails.bride}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '0.9rem',
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#666',
                mb: 3,
              }}
            >
              {invitationDetails.inviteLine}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: { xs: '1rem', sm: '1.2rem' },
                fontWeight: 300,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#222',
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              {invitationDetails.date}<br />
              {invitationDetails.dateDetail}<br />
              {invitationDetails.time}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#222',
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              {invitationDetails.venue}<br />
              {invitationDetails.venue2}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem',
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#666',
                mb: 4,
              }}
            >
              {invitationDetails.receptionLine}
            </Typography>

            <Button
              onClick={() => navigate(`/rsvp/${inviteCode}`)}
              className="rsvp-button"
              sx={{
                border: '1px solid #222',
                color: '#222',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '0.9rem',
                fontWeight: 400,
                padding: '12px 32px',
                borderRadius: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'transparent',
                '&:hover': { background: '#222', color: '#fff' },
              }}
            >
              RSVP
            </Button>
            <Button
              component={Link}
              to={getUrlWithContext('/')}
              variant="text"
              sx={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '0.85rem',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                mt: -1,
              }}
            >
              View full wedding details
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default InvitationPage;