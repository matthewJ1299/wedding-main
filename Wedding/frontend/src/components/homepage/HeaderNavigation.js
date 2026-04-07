import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { useInviteeNavigation } from '../../contexts/InviteeNavigationContext';
import heroPortraitImage from '../../assets/images/heroportrait.jpeg';
const headerBannerImage = `${process.env.PUBLIC_URL || ''}/images/IMG-127.jpg`;

const SECTION_LINKS = [
  { id: 'our-story', label: 'OUR STORY' },
  { id: 'location', label: 'LOCATION' },
  { id: 'schedule', label: 'SCHEDULE' },
  { id: 'menu', label: 'MENU' },
  { id: 'travel-stay', label: 'TRAVEL & STAY' },
  { id: 'registry', label: 'REGISTRY' },
  { id: 'faq', label: 'FAQS' },
];

export default function HeaderNavigation() {
  const { pathname } = useLocation();
  const { inviteeId, hasInviteeContext } = useInviteeNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isStandalonePage = pathname.startsWith('/invitation') || pathname.startsWith('/rsvp');

  const getUrlWithContext = (path) => {
    return hasInviteeContext ? `${path}?invitee=${inviteeId}` : path;
  };

  const getSectionUrl = (sectionId) => {
    const base = getUrlWithContext('/');
    return base.includes('?') ? `${base}#${sectionId}` : `${base}#${sectionId}`;
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const NavLink = ({ sectionId, label, onNavigate }) => {
    const handleClick = (e) => {
      if (isStandalonePage) return;
      scrollToSection(e, sectionId);
      onNavigate?.();
    };
    if (isStandalonePage) {
      return (
        <Link to={getSectionUrl(sectionId)} className="nav-link" onClick={onNavigate}>
          {label}
        </Link>
      );
    }
    return (
      <a href={`#${sectionId}`} className="nav-link" onClick={handleClick}>
        {label}
      </a>
    );
  };

  const drawerLinks = (
    <>
      {SECTION_LINKS.map(({ id, label }) => (
        <Box key={id} component="div" sx={{ py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <NavLink sectionId={id} label={label} onNavigate={closeMobileMenu} />
        </Box>
      ))}
      <Box component="div" sx={{ py: 1.5 }}>
        <Link to={getUrlWithContext('/rsvp')} className="nav-link nav-link-rsvp" onClick={closeMobileMenu}>
          RSVP
        </Link>
      </Box>
    </>
  );

  return (
    <Box>
      <Box
        className="header"
        sx={{
          display: 'flex',
          justifyContent: { xs: 'flex-end', md: 'center' },
          alignItems: 'center',
        }}
      >
        <Box
          className="header-nav-bar"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {SECTION_LINKS.map(({ id, label }) => (
            <NavLink key={id} sectionId={id} label={label} />
          ))}
          <Link to={getUrlWithContext('/rsvp')} className="nav-link nav-link-rsvp">
            RSVP
          </Link>
        </Box>
        <IconButton
          className="header-hamburger"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            color: '#222',
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            pt: 3,
            px: 2,
          },
        }}
      >
        <Box
          component="nav"
          className="header-drawer"
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {drawerLinks}
        </Box>
      </Drawer>
      <Box className="header-banner-wrapper" sx={{ position: 'relative' }}>
        <Box
          className="header-banner"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: { xs: 'none', md: 'block' },
            backgroundImage: `url(${headerBannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: '35% center',
          }}
        />
        <Box
          className="header-banner header-banner-mobile"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: { xs: 'block', md: 'none' },
            backgroundImage: `url(${heroPortraitImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 'auto', md: 0 },
            bottom: { xs: 0, md: 'auto' },
            left: 0,
            right: 0,
            height: { xs: '25%', md: '30%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            pt: { xs: 0, md: 0 },
            pb: { xs: 1, md: 0 },
          }}
        >
          <Typography
            component="span"
            className="hero-couple-name"
            sx={{
              fontSize: { xs: '3.5rem', sm: '2.25rem', md: '9rem' },
              color: '#fff',
              textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
              letterSpacing: { xs: '0.01em', md: '0.02em' },
            }}
          >
            Matthew & Sydney
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

