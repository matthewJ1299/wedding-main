import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCountdown } from '../../hooks/useCountdown';
import { WEDDING_DATE } from '../../utils/constants';

export default function CountdownSection() {
  const { timeLeft } = useCountdown(WEDDING_DATE);

  return (
    <Box className="countdown-section">
      <Box className="countdown-display">
        <Box className="countdown-number">
          {timeLeft.days.toString().padStart(3, '0')}
        </Box>
        <Box className="countdown-number">
          {timeLeft.hours.toString().padStart(2, '0')}
        </Box>
        <Box className="countdown-number">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </Box>
        <Box className="countdown-number">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </Box>
      </Box>
      <Box className="countdown-labels">
        <Typography className="countdown-label">DAYS</Typography>
        <Typography className="countdown-label">HOURS</Typography>
        <Typography className="countdown-label">MINUTES</Typography>
        <Typography className="countdown-label">SECONDS</Typography>
      </Box>
    </Box>
  );
}

