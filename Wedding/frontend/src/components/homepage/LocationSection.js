import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { WEDDING_VENUE } from '../../utils/constants';
import map from '../../assets/images/dehartemap.jpeg';

export default function LocationSection() {
  return (
    <Box id="location" className="location-section">
      <Typography className="section-title location-title">
        LOCATION
      </Typography>
      <Box className="location-content location-split">
        <Box className="location-info location-left">
          <Typography className="venue-name">
            {WEDDING_VENUE.name.toUpperCase()}
          </Typography>
          <Box className="location-directions">
            {[
              'From R566, turn onto M35 (Onderstepoort Rd), from Rosslyn to Onderstepoort',
              'Follow M35 Koningnestkrans',
              'Follow Honingnestkrans Street to Rentia Street and turn left on the gravel road (Rentia St)',
              'Follow Rentia Street to De Harte Venue on your right - Plot 206',
              '(White walls with gold sign and black gate)',
            ].map((line, index, arr) => (
              <React.Fragment key={index}>
                <Typography className="subtext" sx={{ py: 1, textAlign: 'center', lineHeight: 1.6 }}>
                  {line}
                </Typography>
                {index < arr.length - 1 && (
                  <Box
                    sx={{
                      width: '1px',
                      height: '1em',
                      backgroundColor: 'rgba(0,0,0,0.12)',
                      my: 0.5,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <Box className="location-map-wrapper">
          <Box component="img" src={map} alt="Venue" className="location-map-image" />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
        <Button
          component="a"
          href={WEDDING_VENUE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="travel-button"
          variant="contained"
        >
          GET DIRECTIONS
        </Button>
        
      </Box>
    </Box>
  );
}

