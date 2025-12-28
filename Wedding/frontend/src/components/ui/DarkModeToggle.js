import React, { memo } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '../../contexts/ThemeContext';

// Dark mode toggle icons
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

// Styled components
const ToggleButton = styled(IconButton)(({ theme }) => ({
  color: 'var(--global-color)',
  backgroundColor: 'var(--card-bg)',
  borderRadius: '50%',
  padding: 8,
  boxShadow: '0 2px 10px var(--shadow-color)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'var(--card-bg)',
    transform: 'scale(1.05)',
  },
}));

/**
 * Dark mode toggle component
 */
const DarkModeToggle = ({ position = 'fixed', ...props }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Box
      sx={{
        position: position === 'fixed' ? 'fixed' : 'absolute',
        right: position === 'fixed' ? '20px' : 0,
        top: position === 'fixed' ? '20px' : 0,
        zIndex: 1000,
        ...props.sx
      }}
    >
      <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
        <ToggleButton
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </ToggleButton>
      </Tooltip>
    </Box>
  );
};

export default memo(DarkModeToggle);