import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { HeaderNavigation } from '../components/homepage';
import '../styles/HomePageModern.css';
import '../styles/RSVPPage.css';

import { useRsvpModal } from '../contexts/RsvpModalContext';

/**
 * RSVP page component handling wedding attendance confirmation
 */
export default function RSVPPage() {
  const { inviteCode } = useParams();
  const { openRsvpModal, closeRsvpModal } = useRsvpModal();

  useEffect(() => {
    openRsvpModal({ inviteCode });
    return () => {
      closeRsvpModal();
    };
  }, [closeRsvpModal, inviteCode, openRsvpModal]);

  return (
    <Box className="home-page-modern rsvp-page">
      <HeaderNavigation />
    </Box>
  );
}