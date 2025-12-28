import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import HeaderNavigation from '../components/homepage/HeaderNavigation';
import '../styles/HomePageModern.css';

// Import icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CelebrationIcon from '@mui/icons-material/Celebration';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CakeIcon from '@mui/icons-material/Cake';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

/**
 * Schedule page component displaying wedding day timeline
 */
export default function SchedulePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const navbar = document.querySelector('.MuiAppBar-root');
    if (navbar) {
      navbar.style.display = 'none';
    }
    return () => {
      const restoredNavbar = document.querySelector('.MuiAppBar-root');
      if (restoredNavbar) {
        restoredNavbar.style.display = 'flex';
      }
    };
  }, []);

  // Schedule data with events and times
  const scheduleItems = [
    {
      time: "3:00 PM",
      event: "Venue Opens",
      description: "Doors open for guest arrival. Ushers will be available to guide you to your seats.",
      icon: <DirectionsCarIcon />
    },
    {
      time: "3:30 PM",
      event: "Ceremony",
      description: "Please be seated by 3:25 PM as the ceremony will begin promptly at 3:30 PM.",
      icon: <FavoriteIcon />
    },
    {
      time: "4:00 PM",
      event: "Cocktail Hour",
      description: "Enjoy drinks and hors d'oeuvres while the wedding party takes photos.",
      icon: <LocalBarIcon />
    },
    {
      time: "4:00 - 5:00 PM",
      event: "Photo Session",
      description: "Wedding party and family formal photos. Other guests will be at the cocktail hour.",
      icon: <CameraAltIcon />
    },
    {
      time: "5:15 PM",
      event: "Reception Entrance",
      description: "Please take your seats for the grand entrance of the wedding party and the newlyweds.",
      icon: <CelebrationIcon />
    },
    {
      time: "5:30 PM",
      event: "Dinner Service",
      description: "A three-course meal will be served. Please inform us of any dietary restrictions in your RSVP.",
      icon: <RestaurantIcon />
    },
    {
      time: "7:00 PM",
      event: "First Dance & Toasts",
      description: "The couple's first dance followed by toasts from the best man and maid of honor.",
      icon: <MusicNoteIcon />
    },
    {
      time: "7:30 PM",
      event: "Cake Cutting",
      description: "Join us as we cut our wedding cake, which will be served with coffee and tea.",
      icon: <CakeIcon />
    },
    {
      time: "8:00 PM - 11:00 PM",
      event: "Dancing & Celebration",
      description: "Open dance floor and celebration continues until 11:00 PM.",
      icon: <MusicNoteIcon />
    }
  ];

  return (
    <Box className="home-page-modern">
      <HeaderNavigation />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#fff',
          m: 0,
          p: 3,
          pb: 8
        }}
      >
        <Box
          sx={{
            color: '#222',
            textAlign: 'center',
            width: { xs: '95%', sm: '90%', md: '80%' },
            maxWidth: '1000px',
            py: { xs: 4, sm: 5 }
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 300,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontSize: { xs: '1.8rem', sm: '2.2rem' }
            }}
          >
            WEDDING DAY SCHEDULE
          </Typography>

          <Paper
            elevation={0}
            sx={{
              backgroundColor: '#f9f9f9',
              borderRadius: '0',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              padding: { xs: 2, sm: 3, md: 4 },
              mb: 4,
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflowX: 'hidden'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: '#222',
                mb: 2,
                fontFamily: 'Arial, sans-serif',
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            >
              Saturday, October 15, 2023
            </Typography>

            <Timeline position="alternate" sx={{
              maxWidth: '100%',
              padding: { xs: '6px 4px', sm: '6px 16px' },
              '& .MuiTimelineItem-root': {
                '&:before': {
                  display: { xs: 'none', sm: 'block' }
                }
              }
            }}>
              {scheduleItems.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent
                    color="text.secondary"
                    sx={{
                      maxWidth: { xs: '30%', sm: '35%' },
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      {item.time}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="secondary">
                      {item.icon}
                    </TimelineDot>
                    {index < scheduleItems.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{
                    maxWidth: { xs: '100%', sm: '60%' },
                    pr: { xs: 1, sm: 2 },
                    pl: { xs: 1, sm: 2 }
                  }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'var(--secondary-color)',
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      {item.event}
                    </Typography>
                    {/* Mobile time display */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
                        color: 'var(--accent-color)',
                        display: { xs: 'block', sm: 'none' },
                        mt: 0.5
                      }}
                    >
                      {item.time}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#555',
                        fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>

          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontStyle: 'italic',
              mt: 3,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 300,
              fontSize: '0.9rem'
            }}
          >
            * Schedule is subject to slight adjustments on the wedding day.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}