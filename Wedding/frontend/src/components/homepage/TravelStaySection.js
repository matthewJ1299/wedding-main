import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import '../../styles/HomePageModern.css';
import { TRAVEL_STAY_COPY } from '../../data/copy';

export default function TravelStaySection() {
  return (
    <Box id="travel-stay" className="travel-stay-section">
      <Typography className="section-title">
        {TRAVEL_STAY_COPY.sectionTitle}
      </Typography>
      <Typography
        className="body-text"
        sx={{
          mb: 4,
          textAlign: 'center',
          maxWidth: 600,
          mx: 'auto',
          px: 2,
        }}
      >
        {TRAVEL_STAY_COPY.intro}
      </Typography>

      <Box className="travel-accommodations" sx={{ mb: 4 }}>
        {TRAVEL_STAY_COPY.accommodations.map((hotel) => (
          <Box
            key={hotel.name}
            className="accommodation-card"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              className="accommodation-image-wrapper"
              sx={{ width: '100%', mb: 2 }}
            >
              <Box
                component="img"
                src={hotel.image}
                alt={hotel.name}
                className="accommodation-image"
              />
            </Box>
            <Typography className="venue-name" sx={{ mb: 1 }}>
              {hotel.name}
            </Typography>
            <Link
              href={hotel.link}
              target="_blank"
              rel="noopener"
              sx={{
                color: 'var(--accent-color, #2d5c3a)',
                textDecoration: 'underline',
                fontFamily: 'Cormorant Garamond, serif',
                mb: 1,
                '&:hover': { color: '#1e4028' },
              }}
            >
              View Details
            </Link>
            <Typography className="venue-location subtext" sx={{ textAlign: 'center' }}>
              {hotel.address}
            </Typography>
            <Typography className="subtext" sx={{ mt: 1, textAlign: 'center' }}>
              {hotel.distance}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ maxWidth: 600, mx: 'auto', px: 2, textAlign: 'center' }}>
        <Typography className="body-text-primary" sx={{ mb: 2 }}>
          {TRAVEL_STAY_COPY.paymentReference}
        </Typography>
        <Typography className="body-text-primary" sx={{ mb: 2 }}>
          {TRAVEL_STAY_COPY.shuttleInfo}
        </Typography>
        <Typography className="body-text-primary" sx={{ mb: 2 }}>
          {TRAVEL_STAY_COPY.shuttleTimes}
        </Typography>
        <Typography className="body-text-primary">
          {TRAVEL_STAY_COPY.closing}
        </Typography>
      </Box>
    </Box>
  );
}
