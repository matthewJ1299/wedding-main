import React, { memo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { COLORS } from '../../styles/styleConstants';
import Typography from '../ui/Typography';

/**
 * Loading component with various presentation options
 */
const Loading = ({
  size = 'medium',
  variant = 'circular',
  text = 'Loading...',
  showText = true,
  color = 'primary',
  fullScreen = false,
  overlay = false,
  ...props
}) => {
  // Size mappings
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };

  const circleSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.medium;
  
  // Colors
  const colorMap = {
    primary: COLORS.PRIMARY.MAIN,
    secondary: COLORS.SECONDARY.MAIN,
    white: '#ffffff',
  };
  
  const circleColor = colorMap[color] || colorMap.primary;
  
  // Base loading indicator
  const loadingIndicator = (
    <>
      <CircularProgress
        size={circleSize}
        thickness={4}
        sx={{ 
          color: circleColor,
        }}
        {...props}
      />
      {showText && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: circleColor,
            textAlign: 'center',
          }}
        >
          {text}
        </Typography>
      )}
    </>
  );

  // Full screen or overlay version
  if (fullScreen || overlay) {
    return (
      <Box
        sx={{
          position: overlay ? 'absolute' : 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: overlay ? 'rgba(255, 255, 255, 0.7)' : COLORS.BACKGROUND.LIGHT,
          zIndex: overlay ? 10 : 1000,
        }}
      >
        {loadingIndicator}
      </Box>
    );
  }

  // Regular inline loading
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        my: 2,
      }}
    >
      {loadingIndicator}
    </Box>
  );
};

export default memo(Loading);