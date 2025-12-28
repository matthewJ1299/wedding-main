import React from 'react';
import MuiTypography from '@mui/material/Typography';

/**
 * A customized typography component that follows the application's design system
 * and provides consistent text styling across the application.
 */
const Typography = ({
  children,
  variant = 'body1',
  fontFamily,
  color,
  style = {},
  ...props
}) => {
  
  const getStylesForPreset = (preset) => {
    switch (preset) {
      case 'title':
        return {
          fontFamily: 'Great Vibes, cursive',
          fontSize: { xs: '2.1rem', sm: '3.2rem' },
          fontWeight: 400,
          letterSpacing: 1,
          color: 'var(--accent-color, #2d5c3a)'
        };
      case 'subtitle':
        return {
          fontFamily: 'Great Vibes, cursive',
          fontSize: { xs: '1.7rem', sm: '2.7rem' },
          fontWeight: 400,
          letterSpacing: 1,
          color: 'var(--accent-color, #2d5c3a)'
        };
      case 'invitation-text':
        return {
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: '1.1rem',
          color: '#bdbdbd'
        };
      case 'invitation-header':
        return {
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 600,
          letterSpacing: 1,
          fontSize: '1.1rem',
          color: '#bdbdbd'
        };
      case 'elegant-accent':
        return {
          fontFamily: 'Great Vibes, cursive',
          color: 'var(--accent-color, #2d5c3a)',
          fontSize: '1.2rem',
          fontWeight: 400
        };
      case 'error':
        return {
          color: 'error.main'
        };
      case 'success':
        return {
          color: 'success.main'
        };
      default:
        return {};
    }
  };
  
  const preset = props.preset;
  delete props.preset;

  const typoStyles = {
    ...(fontFamily && { fontFamily }),
    ...(color && { color }),
    ...(preset && getStylesForPreset(preset)),
    ...style
  };

  return (
    <MuiTypography variant={variant} sx={typoStyles} {...props}>
      {children}
    </MuiTypography>
  );
};

export default Typography;