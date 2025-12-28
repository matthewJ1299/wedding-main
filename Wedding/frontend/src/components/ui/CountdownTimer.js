import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useCountdown } from '../../hooks/useCountdown';
import { WEDDING_DATE } from '../../utils/constants';

/**
 * Countdown timer component for wedding date
 * Displays days, hours, minutes, and seconds until the wedding
 */
const CountdownTimer = ({ 
  targetDate = WEDDING_DATE,
  showLabels = true,
  variant = 'default',
  size = 'medium',
  color = 'primary',
  style = {},
  ...props 
}) => {
  const { timeLeft, isExpired } = useCountdown(targetDate);

  // Size configurations
  const sizeConfig = {
    small: {
      container: { p: 2 },
      number: { fontSize: '1.5rem', fontWeight: 600 },
      label: { fontSize: '0.75rem' }
    },
    medium: {
      container: { p: 3 },
      number: { fontSize: '2rem', fontWeight: 600 },
      label: { fontSize: '0.875rem' }
    },
    large: {
      container: { p: 4 },
      number: { fontSize: '2.5rem', fontWeight: 600 },
      label: { fontSize: '1rem' }
    }
  };

  // Color configurations
  const colorConfig = {
    primary: {
      number: { color: 'var(--accent-color, #2d5c3a)' },
      label: { color: 'var(--secondary-color, #bdbdbd)' },
      container: { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
    },
    secondary: {
      number: { color: 'var(--secondary-color, #bdbdbd)' },
      label: { color: 'var(--primary-color, #2d5c3a)' },
      container: { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
    },
    white: {
      number: { color: '#ffffff' },
      label: { color: 'rgba(255, 255, 255, 0.8)' },
      container: { backgroundColor: 'rgba(0, 0, 0, 0.3)' }
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  const colors = colorConfig[color] || colorConfig.primary;

  // Render individual time unit
  const TimeUnit = ({ value, label }) => (
    <Box sx={{ textAlign: 'center', minWidth: { xs: '60px', sm: '80px' } }}>
      <Typography
        sx={{
          ...config.number,
          ...colors.number,
          fontFamily: 'Cormorant Garamond, serif',
          lineHeight: 1,
          mb: 0.5
        }}
      >
        {value.toString().padStart(2, '0')}
      </Typography>
      {showLabels && (
        <Typography
          sx={{
            ...config.label,
            ...colors.label,
            fontFamily: 'Cormorant Garamond, serif',
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontWeight: 500
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );

  // Expired state
  if (isExpired) {
    return (
      <Paper
        elevation={2}
        sx={{
          ...config.container,
          ...colors.container,
          borderRadius: 3,
          textAlign: 'center',
          ...style
        }}
        {...props}
      >
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontFamily: 'Great Vibes, cursive',
            color: colors.number.color,
            mb: 1
          }}
        >
          The Big Day Has Arrived!
        </Typography>
        <Typography
          sx={{
            fontSize: '1rem',
            fontFamily: 'Cormorant Garamond, serif',
            color: colors.label.color,
            fontStyle: 'italic'
          }}
        >
          We're getting married today!
        </Typography>
      </Paper>
    );
  }

  // Default variant - horizontal layout
  if (variant === 'default') {
    return (
      <Paper
        elevation={2}
        sx={{
          ...config.container,
          ...colors.container,
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          flexWrap: 'wrap',
          ...style
        }}
        {...props}
      >
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </Paper>
    );
  }

  // Vertical variant - stacked layout
  if (variant === 'vertical') {
    return (
      <Paper
        elevation={2}
        sx={{
          ...config.container,
          ...colors.container,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          ...style
        }}
        {...props}
      >
        <TimeUnit value={timeLeft.days} label="Days" />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <TimeUnit value={timeLeft.minutes} label="Minutes" />
          <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </Box>
      </Paper>
    );
  }

  // Grid variant - 2x2 layout
  if (variant === 'grid') {
    return (
      <Paper
        elevation={2}
        sx={{
          ...config.container,
          ...colors.container,
          borderRadius: 3,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          ...style
        }}
        {...props}
      >
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </Paper>
    );
  }

  return null;
};

export default CountdownTimer;

