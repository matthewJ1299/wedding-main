import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import '../../styles/HomePageModern.css';
// Import removed as we're using responsive styling with MUI breakpoints
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';

// Import UI components
import Typography from './Typography';

/**
 * Timeline component that displays events with fade-in/fade-out animations as user scrolls
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.events - Array of timeline events
 */
const Timeline = ({ events }) => {
  // Theme and media query imports removed as we're using sx props for responsive styling
  const [activeIndex, setActiveIndex] = useState(0);
  const timelineRef = useRef(null);
  const eventRefs = useRef([]);

  // Set up refs for each event
  useEffect(() => {
    eventRefs.current = eventRefs.current.slice(0, events.length);
  }, [events]);

  // Set up scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      
      const timelineTop = timelineRef.current.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Find which event is currently in view
      let newActiveIndex = 0;
      eventRefs.current.forEach((ref, index) => {
        if (!ref) return;
        
        const eventTop = ref.offsetTop + timelineTop;
        if (scrollPosition >= eventTop) {
          newActiveIndex = index;
        }
      });
      
      setActiveIndex(newActiveIndex);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box 
      ref={timelineRef}
      sx={{ 
        position: 'relative',
        padding: { xs: '16px', sm: '30px', md: '40px' },
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        '&:before': {
          content: '""',
          position: 'absolute',
          width: '4px',
          backgroundColor: 'rgba(152,132,81,1)',
          top: 0,
          bottom: 0,
          left: '50%',
          marginLeft: '-2px',
          display: { xs: 'none', md: 'block' },
          zIndex: 1
        }
      }}
    >
      {events.map((event, index) => (
        <Box
          key={index}
          ref={el => eventRefs.current[index] = el}
          sx={{
            padding: { xs: '15px', sm: '20px', md: '40px' },
            position: 'relative',
            width: { xs: '95%', sm: '90%', md: '50%' },
            marginBottom: index < events.length - 1 
              ? { xs: '35px', sm: '30px', md: '35px' }
              : { xs: '40px', sm: '50px', md: '60px' },
            marginLeft: { xs: 'auto', md: index % 2 === 0 ? '0' : '50%' },
            marginRight: { xs: 'auto', md: index % 2 === 0 ? '50%' : '0' },
            left: { xs: '0', md: '0' },
            boxSizing: 'border-box',
            opacity: index < events.length - 1 || Math.abs(activeIndex - index) <= 1 ? 1 : 0.3,
            transform: `translateY(${index < events.length - 1 || Math.abs(activeIndex - index) <= 1 ? '0' : '20px'})`,
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: '25px',
              height: '25px',
              right: { xs: 'auto', md: index % 2 === 0 ? '-12px' : 'auto' },
              left: { xs: '50%', md: index % 2 === 0 ? 'auto' : '-12px' },
              transform: { xs: 'translateX(-50%)', md: 'none' },
              backgroundColor: 'rgba(152,132,81,1)',
              border: '3px solid var(--global-bg, #fff)',
              boxSizing: 'border-box',
              borderRadius: '50%',
              top: { xs: '-12px', md: '15px' },
              zIndex: 2,
              transition: 'background-color 0.3s ease',
              display: { xs: 'none', md: 'block' },
              boxShadow: '0 0 0 4px var(--global-bg, #fff)'
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              padding: { xs: '15px', sm: '20px', md: '30px' },
              borderRadius: '8px',
              background: 'var(--global-bg, #ffffff)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(var(--accent-color-rgb, 45, 92, 58), 0.2)',
              transition: 'all 0.3s ease',
              transform: activeIndex === index ? 'scale(1.03)' : 'scale(1)',
              width: '100%',
              boxSizing: 'border-box',
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
            }}
          >
            <Typography 
              className="subsection-title"
              sx={{ 
                mb: 1, 
                color: 'var(--global-color)',
                textAlign: { xs: 'center', md: index % 2 === 0 ? 'left' : 'right' },
                width: '100%'
              }}
            >
              {event.title}
            </Typography>
            {event.image && (
              <Box
                component="img"
                src={event.image}
                alt={event.title}
                sx={{
                  width: { xs: '100%', sm: '100%', md: '100%' },
                  maxWidth: '100%',
                  aspectRatio: '1',
                  mx: { xs: 0, sm: 'auto' },
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: event.objectPosition || 'center center',
                  borderRadius: '4px',
                  mb: 2,
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  cursor: 'pointer',
                  filter: 'grayscale(100%)',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                  }
                }}
                onClick={() => {
                  // Could add a lightbox or expanded view here in the future
                  console.log(`Clicked on image for event: ${event.title}`);
                }}
              />
            )}
            
            <Typography 
              className="body-text-primary"
              sx={{ 
                color: 'var(--global-color)', 
                textAlign: { xs: 'center', md: index % 2 === 0 ? 'left' : 'right' },
                width: '100%'
              }}
            >
              {event.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Timeline;