import React from 'react';
import { useInviteeNavigation } from '../../contexts/InviteeNavigationContext';
import { useRsvpModal } from '../../contexts/RsvpModalContext';
import Button from '../ui/Button';
import Box from '@mui/material/Box';

/**
 * Global RSVP button that appears when invitee context is available
 */
const RSVPButton = () => {
  const { inviteeId, hasInviteeContext } = useInviteeNavigation();
  const { openRsvpModal } = useRsvpModal();

  if (!hasInviteeContext) {
    return null;
  }

  const handleRSVPClick = () => {
    openRsvpModal({ inviteCode: inviteeId });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Button
        variant="elegant"
        onClick={handleRSVPClick}
        sx={{
          borderRadius: '50px',
          px: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        RSVP
      </Button>
    </Box>
  );
};

export default RSVPButton;



