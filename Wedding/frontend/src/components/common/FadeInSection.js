import React from 'react';
import Box from '@mui/material/Box';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

/**
 * Wrapper component that applies fade-in animation when section enters viewport
 * @param {React.ReactNode} children - Content to wrap
 * @param {string} className - Additional CSS classes
 * @param {Object} options - IntersectionObserver options
 */
export default function FadeInSection({ 
  children, 
  className = '', 
  options = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' } 
}) {
  const [ref, isVisible] = useIntersectionObserver(options);

  return (
    <Box
      ref={ref}
      className={`fade-in-section ${isVisible ? 'fade-in-visible' : ''} ${className}`}
    >
      {children}
    </Box>
  );
}

