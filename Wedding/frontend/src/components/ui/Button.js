import React, { memo, useCallback } from 'react';
import MuiButton from '@mui/material/Button';
import { COLORS, TYPOGRAPHY, SHADOWS, TRANSITIONS, BORDERS, SPACING } from '../../styles/styleConstants';
import { FONT_FAMILIES } from '../../utils/fontLoader';

/**
 * A customized button component that follows the application's design system
 * and provides consistent styling across the application.
 */
const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  style = {},
  ...props 
}) => {
  // Memoize click handler for performance
  const handleClick = useCallback((e) => {
    if (onClick && !disabled) {
      onClick(e);
    }
  }, [onClick, disabled]);
  
  // Define theme-based styling that can be overridden
  const buttonStyle = {
    ...(variant === 'primary' && {
      background: `var(--accent-color, ${COLORS.PRIMARY.MAIN})`,
      color: COLORS.PRIMARY.CONTRAST,
      '&:hover': {
        background: `var(--accent-color-dark, ${COLORS.PRIMARY.DARK})`,
      },
    }),
    ...(variant === 'elegant' && {
      background: `linear-gradient(135deg, ${COLORS.BACKGROUND.DARK} 80%, ${COLORS.PRIMARY.LIGHT} 100%)`,
      color: COLORS.PRIMARY.CONTRAST,
      border: 'none',
      borderRadius: BORDERS.RADIUS.LG,
      padding: `${SPACING.SM} ${SPACING.XL}`,
      fontFamily: FONT_FAMILIES.PRIMARY,
      fontSize: TYPOGRAPHY.SIZE.LG,
      fontWeight: TYPOGRAPHY.WEIGHT.SEMI_BOLD,
      boxShadow: SHADOWS.LIGHT,
      transition: `background ${TRANSITIONS.DURATION.FAST}`,
    }),
    ...style
  };
  
  return (
    <MuiButton
      variant={variant !== 'elegant' ? variant : 'contained'}
      color={color}
      size={size}
      fullWidth={fullWidth}
      onClick={handleClick}
      type={type}
      disabled={disabled}
      sx={buttonStyle}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

// Memoize the button component to prevent unnecessary re-renders
export default memo(Button);