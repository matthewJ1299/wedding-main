import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useInviteeNavigation } from '../../contexts/InviteeNavigationContext';

export default function FooterNavigation() {
  const { inviteeId, hasInviteeContext } = useInviteeNavigation();

  // Get URL with invitee context preserved
  const getUrlWithContext = (path) => {
    return hasInviteeContext ? `${path}?invitee=${inviteeId}` : path;
  };

  return (
    <Box className="footer-navigation">
      <Link to={`${getUrlWithContext("/")}#our-story`} className="footer-link">OUR STORY</Link>
      <Link to={`${getUrlWithContext("/")}#travel-stay`} className="footer-link">TRAVEL & STAY</Link>
      <Link to={`${getUrlWithContext("/")}#registry`} className="footer-link">REGISTRY</Link>
      <Link to={getUrlWithContext("/rsvp")} className="footer-link footer-link-rsvp">RSVP</Link>
      <Link to={`${getUrlWithContext("/")}#faq`} className="footer-link">FAQS</Link>
    </Box>
  );
}

