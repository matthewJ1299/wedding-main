import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCountdown } from '../../hooks/useCountdown';
import { WEDDING_DATE } from '../../utils/constants';

export default function CountdownSection() {
  const { timeLeft } = useCountdown(WEDDING_DATE);

  return (
    <Box className="modern-countdown-section">
      <Typography className="modern-section-title modern-countdown-title">
        LET THE COUNTDOWN BEGIN
      </Typography>
      <Box className="modern-countdown-display">
        <Box className="modern-countdown-number">
          {timeLeft.days.toString().padStart(3, '0')}
        </Box>
        <Box className="modern-countdown-number">
          {timeLeft.hours.toString().padStart(2, '0')}
        </Box>
        <Box className="modern-countdown-number">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </Box>
        <Box className="modern-countdown-number">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </Box>
      </Box>
      <Box className="modern-countdown-labels">
        <Typography className="modern-countdown-label">DAYS</Typography>
        <Typography className="modern-countdown-label">HOURS</Typography>
        <Typography className="modern-countdown-label">MINUTES</Typography>
        <Typography className="modern-countdown-label">SECONDS</Typography>
      </Box>
    </Box>
  );
}

