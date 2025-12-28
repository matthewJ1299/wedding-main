import React from 'react';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

/**
 * A customized card component that follows the application's design system
 * and provides consistent styling across the application.
 */
const Card = ({
  children,
  variant = 'default',
  width = 'auto',
  elevation = 2,
  style = {},
  contentStyle = {},
  ...props
}) => {
  const cardStyles = {
    ...(variant === 'invitation' && {
      color: 'var(--primary-color)',
      background: 'var(--secondary-color)',
      borderRadius: 4,
      boxShadow: 6,
      position: 'relative',
      overflow: 'visible',
      fontFamily: 'Cormorant Garamond, serif',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    ...(variant === 'admin' && {
      background: '#FFFFFF',
      border: '1px solid #E0E0E0',
      boxShadow: 1,
      borderRadius: 2,
    }),
    width: width,
    ...style
  };

  const contentStyles = {
    ...(variant === 'invitation' && {
      width: '100%', 
      position: 'relative', 
      zIndex: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      fontFamily: 'Cormorant Garamond, serif', 
      background: 'transparent', 
      boxShadow: 'none',
      p: { xs: 2, sm: 4 }
    }),
    ...contentStyle
  };

  return (
    <MuiCard elevation={elevation} sx={cardStyles} {...props}>
      <CardContent sx={contentStyles}>
        {children}
      </CardContent>
    </MuiCard>
  );
};

/**
 * A specialized Box component for containing cards with consistent styling
 */
export const CardContainer = ({ children, style = {}, ...props }) => (
  <Box 
    sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Cormorant Garamond, serif',
      background: 'var(--page-bg, #ffffff)',
      p: 0,
      m: 0,
      boxSizing: 'border-box',
      ...style
    }}
    {...props}
  >
    {children}
  </Box>
);

export default Card;