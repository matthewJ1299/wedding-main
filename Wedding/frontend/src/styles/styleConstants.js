/**
 * Central repository for style constants used throughout the application
 * This helps maintain consistency and makes global styling changes easier
 */

export const COLORS = {
  // Primary brand colors
  PRIMARY: {
    LIGHT: '#39834d',
    MAIN: '#2d5c3a',
    DARK: '#1e3d27',
    CONTRAST: '#ffffff',
  },
  // Secondary palette
  SECONDARY: {
    LIGHT: '#eeeeee',
    MAIN: '#bdbdbd',
    DARK: '#757575',
    CONTRAST: '#000000',
  },
  // Common UI colors
  BACKGROUND: {
    LIGHT: '#ffffff',
    MAIN: '#f5f5f5',
    DARK: '#232323',
    FROSTED: 'rgba(255, 255, 255, 0.15)',
  },
  // Status colors
  STATUS: {
    SUCCESS: '#4caf50',
    ERROR: '#f44336',
    WARNING: '#ff9800',
    INFO: '#2196f3',
  },
};

export const TYPOGRAPHY = {
  // Font families already defined in fontLoader.js
  
  // Font weights
  WEIGHT: {
    LIGHT: 300,
    REGULAR: 400,
    MEDIUM: 500,
    SEMI_BOLD: 600,
    BOLD: 700,
  },
  
  // Font sizes
  SIZE: {
    XS: '0.75rem',
    SM: '0.875rem',
    MD: '1rem',
    LG: '1.1rem',
    XL: '1.25rem',
    XXL: '1.5rem',
    H1: '3.2rem',
    H2: '2.7rem',
    H3: '2.1rem',
    H4: '1.7rem',
    H5: '1.5rem',
    H6: '1.3rem',
  },
};

export const SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '16px',
  LG: '24px',
  XL: '32px',
  XXL: '48px',
};

export const BORDERS = {
  RADIUS: {
    SM: '4px',
    MD: '8px',
    LG: '16px',
    CIRCLE: '50%',
  },
  WIDTH: {
    THIN: '1px',
    MEDIUM: '2px',
    THICK: '4px',
  },
};

export const SHADOWS = {
  LIGHT: '0 2px 8px rgba(0,0,0,0.1)',
  MEDIUM: '0 4px 12px rgba(0,0,0,0.15)',
  STRONG: '0 8px 24px rgba(0,0,0,0.2)',
};

export const TRANSITIONS = {
  DURATION: {
    FAST: '0.2s',
    MEDIUM: '0.3s',
    SLOW: '0.6s',
  },
  EASING: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
};

export const Z_INDEX = {
  BACKGROUND: -1,
  DEFAULT: 1,
  HEADER: 10,
  MODAL: 100,
  TOOLTIP: 150,
  OVERLAY: 200,
};