import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WEDDING_DATE } from '../../utils/constants';

// Import image assets
import img1 from '../../assets/images/123.jpg';
import img2 from '../../assets/images/234.jpg';
import img3 from '../../assets/images/456.jpg';

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
    <Box className="modern-hero-section">
      <Typography className="modern-wedding-date">
        {formatWeddingDate()}
      </Typography>

      <Box className="modern-images-row">
        <Box
          component="img"
          src={img1}
          alt="Wedding"
          className="modern-image modern-image-left"
        />
        <Box
          component="img"
          src={img2}
          alt="Wedding"
          className="modern-image modern-image-center"
        />
        <Box
          component="img"
          src={img3}
          alt="Wedding"
          className="modern-image modern-image-right"
        />
      </Box>

      <Typography className="modern-tagline">
        JOIN US AS WE EMBARK ON A JOURNEY OF LOVE, JOY, AND ETERNAL HAPPINESS
      </Typography>
    </Box>
  );
}

