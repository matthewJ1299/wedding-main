import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useInviteeNavigation } from '../../contexts/InviteeNavigationContext';
import logoImage from '../../assets/images/12-transparent.svg';

export default function HeaderNavigation() {
  const { inviteeId, hasInviteeContext } = useInviteeNavigation();

  // Get URL with invitee context preserved
  const getUrlWithContext = (path) => {
    return hasInviteeContext ? `${path}?invitee=${inviteeId}` : path;
  };

  // Get RSVP URL based on invitee context
  const getRSVPUrl = () => {
    return hasInviteeContext ? `/rsvp/${inviteeId}` : '/faq';
  };

  return (
    <Box>
      <Box className="modern-header modern-header-logo">
        <Link to={getUrlWithContext("/")}
          className="modern-header-link">
          <Box
            component="img"
            src={logoImage}
            alt="Matt & Sydney"
            sx={{ height: 'auto', maxWidth: '40%' }}
          />
        </Link>
      </Box>
      <Box className="modern-header">
        <Box className="modern-nav-left">
          <Link to={getUrlWithContext("/our-story")} className="modern-nav-link">OUR STORY</Link>
          <Link to={getUrlWithContext("/accommodation")} className="modern-nav-link">TRAVEL & STAY</Link>
          <Link to={getUrlWithContext("/registry")} className="modern-nav-link">REGISTRY</Link>
        </Box>
        <Box className="modern-nav-right">
          <Link to={getUrlWithContext("/faq")} className="modern-nav-link">FAQS</Link>
        </Box>
      </Box>
    </Box>

  );
}

