import React, { memo } from 'react';
import Box from '@mui/material/Box';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { TRANSITIONS } from '../../styles/styleConstants';

/**
 * Component that fades in when it enters the viewport
 */
const FadeInSection = ({ children, threshold = 0.3, delay = 0, ...props }) => {
  // Use our custom hook for intersection observation
  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin: '0px',
  });
  
  return (
    <Box
      ref={ref}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity ${TRANSITIONS.DURATION.SLOW} ${TRANSITIONS.EASING.EASE_OUT}, 
                     transform ${TRANSITIONS.DURATION.SLOW} ${TRANSITIONS.EASING.EASE_OUT}`,
        transitionDelay: `${delay}ms`,
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(FadeInSection);