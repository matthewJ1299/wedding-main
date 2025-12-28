import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useInviteeNavigation } from '../../contexts/InviteeNavigationContext';
import { WEDDING_VENUE } from '../../utils/constants';
import img4 from '../../assets/images/567.jpg';

export default function LocationSection() {
  const { inviteeId, hasInviteeContext } = useInviteeNavigation();

  // Get URL with invitee context preserved
  const getUrlWithContext = (path) => {
    return hasInviteeContext ? `${path}?invitee=${inviteeId}` : path;
  };

  return (
    <Box className="modern-location-section">
      <Typography className="modern-section-title modern-location-title">
        LOCATION
      </Typography>
      <Box className="modern-location-content">
        <Box className="modern-location-info modern-location-left">
          <Typography className="modern-venue-name">
            {WEDDING_VENUE.name.toUpperCase()}
          </Typography>
        </Box>
        <Box
          component="img"
          src={img4}
          alt="Venue"
          className="modern-venue-image"
        />
        <Box className="modern-location-info modern-location-right">
          <Typography className="modern-venue-location">
            {WEDDING_VENUE.location.toUpperCase()}
          </Typography>
        </Box>
      </Box>
      <Button
        component={Link}
        to={getUrlWithContext("/accommodation")}
        className="modern-travel-button"
        variant="contained"
      >
        TRAVEL & STAY
      </Button>
    </Box>
  );
}

