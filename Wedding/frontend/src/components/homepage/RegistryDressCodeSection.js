import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import img1 from '../../assets/images/123.jpg';
import img2 from '../../assets/images/234.jpg';

export default function RegistryDressCodeSection() {
  return (
    <Box className="bottom-section">
      <Box className="registry-section">
        <Typography className="section-title bottom-title">
          REGISTRY
        </Typography>
        <Box
          component="img"
          src={img1}
          alt="Registry"
          className="bottom-image"
        />
      </Box>
      <Box className="dresscode-section">
        <Typography className="section-title bottom-title">
          DRESS CODE
        </Typography>
        <Box
          component="img"
          src={img2}
          alt="Dress Code"
          className="bottom-image"
        />
      </Box>
    </Box>
  );
}

