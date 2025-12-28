import React, { useState, useEffect } from 'react';
import '../styles/HomePageHero.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useInviteeNavigation } from '../contexts/InviteeNavigationContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Import image assets
import img1 from '../assets/images/123.jpg';
import img2 from '../assets/images/234.jpg';
import img3 from '../assets/images/456.jpg';
import img4 from '../assets/images/567.jpg';

/**
 * Hero home page with countdown timer, names, and pill buttons
 */
export default function HomePageHero() {
  const { inviteeId, hasInviteeContext } = useInviteeNavigation();
  const carouselImages = [img1, img2, img3, img4];
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);

  // Navigation links from original navbar
  const links = [
    { to: '/our-story', label: 'Our Story' },
    { to: '/schedule', label: 'Schedule' },
    { to: '/registry', label: 'Registry' },
    { to: '/faq', label: 'FAQ' },
    { to: '/accommodation', label: 'Accommodation' },
  ];

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  useEffect(() => {
    document.body.classList.add('home-hero-page');
    // Hide the main navbar
    const mainNavbar = document.querySelector('.MuiAppBar-root');
    if (mainNavbar) {
      mainNavbar.style.display = 'none';
    }
    
    return () => {
      document.body.classList.remove('home-hero-page');
      // Show the main navbar again
      const mainNavbar = document.querySelector('.MuiAppBar-root');
      if (mainNavbar) {
        mainNavbar.style.display = 'block';
      }
    };
  }, []);

  // Carousel logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date('October 3, 2026 15:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value) => {
    return value.toString().padStart(2, '0');
  };

  const getRSVPUrl = () => {
    return hasInviteeContext ? `/rsvp/${inviteeId}` : '/rsvp';
  };

  return (
    <Box className="hero-page-container">
      {/* Background Image Carousel */}
      <Box className="hero-background">
        <Box className="hero-carousel">
          {carouselImages.map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              alt={`Matt & Sydney ${idx + 1}`} 
              className={`hero-image ${idx === current ? 'active' : ''}`}
            />
          ))}
        </Box>
        <Box className="hero-overlay" />
      </Box>

      {/* Navigation */}
      <Box className="hero-navbar">
        <Box className="hero-navbar-content">
          <Link to={hasInviteeContext ? `/?invitee=${inviteeId}` : "/"} className="hero-logo">
            M&S
          </Link>
          
          <Box className="hero-nav-right">
            <Button 
              component={Link} 
              to={hasInviteeContext ? `/our-story?invitee=${inviteeId}` : "/our-story"}
              className="hero-details-btn"
            >
              Details
            </Button>
            <Box className="hero-hamburger" onClick={handleMenuOpen}>
              <span></span>
              <span></span>
              <span></span>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className="hero-content">
        {/* Countdown Timer */}
        <Box className="hero-countdown">
          <Box className="countdown-numbers">
            <span>{formatTime(timeLeft.days)}</span>
            <span>:</span>
            <span>{formatTime(timeLeft.hours)}</span>
            <span>:</span>
            <span>{formatTime(timeLeft.minutes)}</span>
            <span>:</span>
            <span>{formatTime(timeLeft.seconds)}</span>
          </Box>
          <Box className="countdown-labels">
            <span>Days</span>
            <span>Hours</span>
            <span>Mins</span>
            <span>Secs</span>
          </Box>
        </Box>

        {/* Names */}
        <Box className="hero-names">
          MATT & SYDNEY
        </Box>

        {/* Event Details Pill */}
        <Box className="hero-pill">
          <Box className="pill-left">
            <span className="pill-day">SATURDAY</span>
            <span className="pill-date">Oct 3, 2026</span>
          </Box>
          <Box className="pill-divider"></Box>
          <Box className="pill-right">
            <span className="pill-time">3:00PM</span>
            <span className="pill-location">Onderstepoort</span>
          </Box>
        </Box>

        {/* RSVP Button */}
        <Button 
          component={Link} 
          to={getRSVPUrl()}
          className="hero-rsvp-btn"
        >
          RSVP
        </Button>
      </Box>

      {/* Hamburger Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'hamburger-menu-button',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            minWidth: 200,
          }
        }}
      >
        <MenuItem 
          component={Link} 
          to={hasInviteeContext ? `/?invitee=${inviteeId}` : "/"} 
          onClick={handleMenuClose}
          sx={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Home
        </MenuItem>
        <MenuItem 
          component={Link} 
          to={hasInviteeContext ? `/home-frosted?invitee=${inviteeId}` : "/home-frosted"} 
          onClick={handleMenuClose}
          sx={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Home Frosted
        </MenuItem>
        <MenuItem 
          component={Link} 
          to={hasInviteeContext ? `/home-hero?invitee=${inviteeId}` : "/home-hero"} 
          onClick={handleMenuClose}
          sx={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Home Hero
        </MenuItem>
        <MenuItem 
          component={Link} 
          to={hasInviteeContext ? `/in-love?invitee=${inviteeId}` : "/in-love"} 
          onClick={handleMenuClose}
          sx={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          So In Love
        </MenuItem>
        {links.map(link => {
          const linkUrl = hasInviteeContext ? `${link.to}?invitee=${inviteeId}` : link.to;
          return (
            <MenuItem 
              key={link.to}
              component={Link} 
              to={linkUrl} 
              onClick={handleMenuClose}
              sx={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {link.label}
            </MenuItem>
          );
        })}
        {hasInviteeContext && (
          <MenuItem 
            component={Link} 
            to={`/edit-details/${inviteeId}`} 
            onClick={handleMenuClose}
            sx={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Edit Details
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
