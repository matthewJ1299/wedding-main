import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import img1 from '../../assets/images/123.jpg';
import img2 from '../../assets/images/234.jpg';

export default function RegistryDressCodeSection() {
  return (
    <Box className="modern-bottom-section">
      <Box className="modern-registry-section">
        <Typography className="modern-section-title modern-bottom-title">
          REGISTRY
        </Typography>
        <Box
          component="img"
          src={img1}
          alt="Registry"
          className="modern-bottom-image"
        />
      </Box>
      <Box className="modern-dresscode-section">
        <Typography className="modern-section-title modern-bottom-title">
          DRESS CODE
        </Typography>
        <Box
          component="img"
          src={img2}
          alt="Dress Code"
          className="modern-bottom-image"
        />
      </Box>
    </Box>
  );
}

