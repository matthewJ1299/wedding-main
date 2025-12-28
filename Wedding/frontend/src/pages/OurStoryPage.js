import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HeaderNavigation from '../components/homepage/HeaderNavigation';
import Timeline from '../components/ui/Timeline';
import FadeInSection from '../components/ui/FadeInSection';
import '../styles/HomePageModern.css';

// Import images
import img1 from '../assets/images/123.jpg';
import img2 from '../assets/images/234.jpg';
import img3 from '../assets/images/456.jpg';
import img4 from '../assets/images/567.jpg';
import invitePhoto from '../assets/images/invite-photo.jpg';

// Timeline event data
const timelineEvents = [
  {
    title: "The First Meeting",
    date: "January 15, 2023",
    description: "We first met at the Coffee Corner downtown. Matt spilled his latte all over Sydney's favorite book. Somehow she still agreed to a second meeting!",
    image: img1
  },
  {
    title: "First Date",
    date: "January 28, 2023",
    description: "Our first official date was at Bella's Italian Restaurant. We talked for hours about our favorite books, movies, and dreams for the future.",
    image: img2
  },
  {
    title: "Road Trip Adventure",
    date: "June 10, 2023",
    description: "We took our first road trip together to the mountains. Got lost twice, ran out of gas once, but made memories that would last a lifetime.",
    image: img3
  },
  {
    title: "Moving In Together",
    date: "November 5, 2023",
    description: "Took the big step of moving in together. Sydney's plant collection and Matt's vintage record player finally found a shared home.",
    image: img4
  },
  {
    title: "The Proposal",
    date: "May 21, 2024",
    description: "Matt proposed during sunset at the same coffee shop where they first met. This time, no beverages were spilled, and Sydney said yes!",
    image: invitePhoto
  },
  {
    title: "Wedding Planning",
    date: "Summer 2024 - Present",
    description: "From venue hunting to cake tasting, we've been enjoying (almost) every minute of planning our special day together.",
    image: img1
  }
];

/**
 * Our Story page component displaying the couple's journey with an animated timeline
 */
export default function OurStoryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Hide the default navbar for this page
    const navbar = document.querySelector('.MuiAppBar-root');
    if (navbar) {
      navbar.style.display = 'none';
    }
    return () => {
      // Restore navbar when leaving page
      const restoredNavbar = document.querySelector('.MuiAppBar-root');
      if (restoredNavbar) {
        restoredNavbar.style.display = 'flex';
      }
    };
  }, []);

  return (
    <Box className="home-page-modern">
      <HeaderNavigation />
      
      {/* Header Section */}
      <Box 
        sx={{ 
          color: '#fff', 
          textAlign: 'center', 
          width: '100%',
          maxWidth: '100vw',
          py: { xs: 6, md: 10 },
          px: 3,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${invitePhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          filter: 'grayscale(100%)',
        }}
      >
        <FadeInSection>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 3, 
              fontFamily: 'Arial, sans-serif',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 300,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              width: '100%',
              textAlign: 'center',
              color: '#fff'
            }}
          >
            OUR STORY
          </Typography>
        </FadeInSection>
        
        <FadeInSection delay={300}>
          <Typography 
            variant="body1" 
            sx={{ 
              width: { xs: '90%', sm: '70%', md: '50%' },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              mb: 4,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 300,
              letterSpacing: '1px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              color: '#fff'
            }}
          >
            Every love story is special, but ours is our favorite. Scroll down to see the journey that brought us here, to this moment, planning our forever together.
          </Typography>
        </FadeInSection>
      </Box>
      
      {/* Timeline Section */}
      <Box 
        sx={{ 
          width: '100%',
          maxWidth: '100vw',
          py: 8,
          px: { xs: 2, sm: 4, md: 6 },
          background: '#fff',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <Timeline events={timelineEvents} />
      </Box>
      
      {/* Footer Quote */}
      <FadeInSection threshold={0.5} sx={{ width: '100%' }}>
        <Box 
          sx={{ 
            width: '100%',
            maxWidth: '100vw',
            py: 8,
            textAlign: 'center',
            background: '#f9f9f9',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: 'Arial, sans-serif',
              fontWeight: 300,
              letterSpacing: '2px',
              color: '#222',
              px: 3
            }}
          >
            "AND SO THE ADVENTURE BEGINS..."
          </Typography>
        </Box>
      </FadeInSection>
    </Box>
  );
}