import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WEDDING_DATE } from '../../utils/constants';
import { HERO_COPY } from '../../data/copy';
import CountdownSection from './CountdownSection';
import { heroImages } from '../../data/heroImageConfig';

export default function HeroSection() {
  // Format wedding date for display (14 • 07 • 2024 format)
  const formatWeddingDate = () => {
    const date = new Date(WEDDING_DATE);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} • ${month} • ${year}`;
  };

  return (
    <Box id="hero" className="hero-section">
      <Box className="hero-date-countdown-section">
        <Typography className="wedding-date">
          {formatWeddingDate()}
        </Typography>
        <Box
          className="countdown-overlay countdown-with-bg"
          sx={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 0,
          }}
        >
          <CountdownSection />
        </Box>
      </Box>
      <Box className="images-container">
        <Box className="images-row">
          <img
            src={heroImages.left.src}
            alt="Wedding"
            className="image image-left"
            style={{ objectPosition: heroImages.left.objectPosition }}
          />
          <img
            src={heroImages.center.src}
            alt="Wedding"
            className="image image-center"
            style={{ objectPosition: heroImages.center.objectPosition }}
          />
          <img
            src={heroImages.right.src}
            alt="Wedding"
            className="image image-right"
            style={{ objectPosition: heroImages.right.objectPosition }}
          />
        </Box>
      </Box>

      <Typography className="tagline">
        {HERO_COPY.tagline}
      </Typography>
    </Box>
  );
}

