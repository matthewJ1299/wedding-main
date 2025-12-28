import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

/**
 * A consistent page layout component that provides common styling
 * and structure for all pages.
 */
const PageLayout = ({
  children,
  background = 'var(--primary-color)',
  fullWidth = false,
  centerContent = true,
  style = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        display: 'flex',
        alignItems: centerContent ? 'center' : 'flex-start',
        justifyContent: centerContent ? 'center' : 'flex-start',
        fontFamily: 'Cormorant Garamond, serif',
        background,
        p: 0,
        m: 0,
        boxSizing: 'border-box',
        pt: { xs: '100px', sm: '120px' }, // Add top padding for fixed navbar
        overflowX: 'hidden',
        ...style
      }}
      {...props}
    >
      {fullWidth ? children : (
        <Container maxWidth="md" sx={{ p: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
          {children}
        </Container>
      )}
    </Box>
  );
};

export default PageLayout;