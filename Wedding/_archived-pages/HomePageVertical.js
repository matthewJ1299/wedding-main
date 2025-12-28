import React, { useEffect, useState } from 'react';
import '../styles/HomePageVertical.css';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useInviteeNavigation } from '../contexts/InviteeNavigationContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

// Import image assets
import heroImage from '../assets/images/123.jpg';

/**
 * Vertical navigation home page with left sidebar and centered content
 */
export default function HomePageVertical() {
  const { inviteeId, hasInviteeContext } = useInviteeNavigation();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);

  useEffect(() => {
    document.body.classList.add('home-vertical-page');
    // Hide the main navbar
    const mainNavbar = document.querySelector('.MuiAppBar-root');
    if (mainNavbar) {
      mainNavbar.style.display = 'none';
    }
    
    return () => {
      document.body.classList.remove('home-vertical-page');
      // Show the main navbar again
      const mainNavbar = document.querySelector('.MuiAppBar-root');
      if (mainNavbar) {
        mainNavbar.style.display = 'block';
      }
    };
  }, []);

  // Navigation links
  const links = [
    { to: '/', label: 'Home' },
    { to: '/our-story', label: 'Our Story' },
    { to: '/schedule', label: 'Details' },
    { to: '/registry', label: 'Wedding Party' },
    { to: '/accommodation', label: 'Accommodations' },
    { to: '/registry', label: 'Registry' },
  ];

  const getLinkUrl = (to) => {
    return hasInviteeContext ? `${to}?invitee=${inviteeId}` : to;
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <Box className="vertical-page-container">
      {/* Left Vertical Navigation - Desktop */}
      <Box className="vertical-navbar vertical-navbar-desktop">
        <Box className="vertical-nav-content">
          {links.map(link => (
            <Link 
              key={link.to}
              to={getLinkUrl(link.to)}
              className="vertical-nav-link"
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Box>

      {/* Mobile Navigation */}
      <Box className="vertical-mobile-navbar">
        <Box className="vertical-mobile-nav-content">
          <Link to={hasInviteeContext ? `/?invitee=${inviteeId}` : "/"} className="vertical-mobile-logo">
            M&S
          </Link>
          <IconButton
            size="large"
            edge="end"
            aria-label="menu"
            aria-controls={mobileMenuOpen ? 'mobile-menu' : undefined}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            sx={{ color: '#222' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box className="vertical-main-content">
        {/* Background Image */}
        <Box className="vertical-background">
          <img 
            src={heroImage} 
            alt="Matt & Sydney" 
            className="vertical-bg-image"
          />
        </Box>
        
        {/* Central Content */}
        <Box className="vertical-content">
          {/* Header */}
          <Box className="vertical-header">
            MATT & SYDNEY
          </Box>
          
          {/* Names */}
          <Box className="vertical-names">
            MATT + SYDNEY
          </Box>
          
          {/* Date and Location */}
          <Box className="vertical-details">
            October 3, 2026 | Onderstepoort
          </Box>
          
          {/* Monogram */}
          <Box className="vertical-monogram">
            M&S
          </Box>
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
            sx={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {link.label}
          </MenuItem>
        ))}
        {hasInviteeContext && (
          <MenuItem 
            component={Link} 
            to={`/edit-details/${inviteeId}`} 
            onClick={handleMobileMenuClose}
            sx={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Edit Details
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
