import React, { useEffect, useState } from 'react';
import '../styles/HomePageFullscreen.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useInviteeNavigation } from '../contexts/InviteeNavigationContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

// Import image assets
import heroImage from '../assets/images/234.jpg';

/**
 * Fullscreen home page with black and white background image and top navigation
 */
export default function HomePageFullscreen() {
  const { inviteeId, hasInviteeContext } = useInviteeNavigation();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);

  useEffect(() => {
    document.body.classList.add('home-fullscreen-page');
    // Hide the main navbar
    const mainNavbar = document.querySelector('.MuiAppBar-root');
    if (mainNavbar) {
      mainNavbar.style.display = 'none';
    }
    
    return () => {
      document.body.classList.remove('home-fullscreen-page');
      // Show the main navbar again
      const mainNavbar = document.querySelector('.MuiAppBar-root');
      if (mainNavbar) {
        mainNavbar.style.display = 'block';
      }
    };
  }, []);

  // Navigation links
  const links = [
    { to: '/our-story', label: 'Our Story' },
    { to: '/schedule', label: 'Event Details' },
    { to: '/accommodation', label: 'Accommodations' },
    { to: '/registry', label: 'Registry' },
    { to: '/faq', label: 'FAQ' },
  ];

  const getLinkUrl = (to) => {
    return hasInviteeContext ? `${to}?invitee=${inviteeId}` : to;
  };

  const getRSVPUrl = () => {
    return hasInviteeContext ? `/rsvp/${inviteeId}` : '/rsvp';
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <Box className="fullscreen-page-container">
      {/* Background Image */}
      <Box className="fullscreen-background">
        <img 
          src={heroImage} 
          alt="Matt & Sydney" 
          className="fullscreen-bg-image"
        />
      </Box>

      {/* Top Navigation */}
      <Box className="fullscreen-navbar">
        <Box className="fullscreen-nav-content">
          {/* Logo */}
          <Box className="fullscreen-logo">
            <Box className="logo-circle">
              <span className="logo-text">M&S</span>
            </Box>
            <span className="logo-subtitle fullscreen-logo-subtitle-desktop">We're getting married!</span>
          </Box>

          {/* Desktop Navigation Links */}
          <Box className="fullscreen-nav-links fullscreen-nav-links-desktop">
            {links.map(link => (
              <Link 
                key={link.to}
                to={getLinkUrl(link.to)}
                className="fullscreen-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </Box>

          {/* Desktop RSVP Button */}
          <Button 
            component={Link} 
            to={getRSVPUrl()}
            className="fullscreen-rsvp-btn fullscreen-rsvp-btn-desktop"
          >
            RSVP
          </Button>

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            edge="end"
            aria-label="menu"
            aria-controls={mobileMenuOpen ? 'mobile-menu' : undefined}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            className="fullscreen-mobile-menu-btn"
            sx={{ color: '#222' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className="fullscreen-content">
        {/* Names */}
        <Box className="fullscreen-names">
          MATT & SYDNEY
        </Box>
        
        {/* Date and Location */}
        <Box className="fullscreen-details">
          OCTOBER 3, 2026 • ONDERSTEPOORT
        </Box>
      </Box>

      {/* Mobile Menu */}
      <Menu
        id="mobile-menu"
        anchorEl={mobileMenuAnchor}
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        MenuListProps={{
          'aria-labelledby': 'mobile-menu-button',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        {links.map(link => (
          <MenuItem 
            key={link.to}
            component={Link} 
            to={getLinkUrl(link.to)} 
            onClick={handleMobileMenuClose}
            sx={{ fontFamily: 'Arial, sans-serif' }}
          >
            {link.label}
          </MenuItem>
        ))}
        <MenuItem 
          component={Link} 
          to={getRSVPUrl()} 
          onClick={handleMobileMenuClose}
          sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
        >
          RSVP
        </MenuItem>
        {hasInviteeContext && (
          <MenuItem 
            component={Link} 
            to={`/edit-details/${inviteeId}`} 
            onClick={handleMobileMenuClose}
            sx={{ fontFamily: 'Arial, sans-serif' }}
          >
            Edit Details
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
