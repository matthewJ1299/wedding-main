import React from 'react';
import { useInviteeNavigation } from '../../contexts/InviteeNavigationContext';
import { useRsvpModal } from '../../contexts/RsvpModalContext';
import Button from '../ui/Button';
import Box from '@mui/material/Box';

const RSVP_BUTTON_COLOR = '#74896f';
const RSVP_BUTTON_COLOR_HOVER = '#5f705b';

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
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      <Button
        variant="primary"
        onClick={handleRSVPClick}
        sx={{
          borderRadius: '50px',
          px: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          background: RSVP_BUTTON_COLOR,
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(45, 92, 58, 0.35)',
          '&:hover': {
            background: RSVP_BUTTON_COLOR_HOVER,
            boxShadow: '0 6px 25px rgba(45, 92, 58, 0.45)',
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



