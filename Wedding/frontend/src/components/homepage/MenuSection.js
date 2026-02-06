import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { MENU_COPY } from '../../data/copy';

export default function MenuSection() {
  return (
    <Box id="menu" className="menu-page-section">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          m: 0,
          p: 3,
          pb: 8
        }}
      >
        <Box
          sx={{
            color: '#222',
            textAlign: 'center',
            width: { xs: '95%', sm: '90%', md: '80%' },
            maxWidth: '1200px',
            py: { xs: 3, sm: 4 }
          }}
        >
          <Typography className="section-title">
            {MENU_COPY.sectionTitle}
          </Typography>

          <Typography
            className="body-text"
            sx={{
              width: { xs: '100%', md: '80%' },
              mx: 'auto',
              mb: 5,
            }}
          >
            A few of our favourites to share with you. We’ll be celebrating with a generous buffet, thoughtfully chosen to offer a variety of comforting favourites and crowd-pleasers. We hope you enjoy every bite!
          </Typography>

          <Box
            sx={{
              width: { xs: '100%', md: '80%' },
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}
          >
            {MENU_COPY.sections.map((section, index) => (
              <Box key={index}>
                <Typography className="subsection-title" sx={{ mb: 2 }}>
                  {section.title}
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {section.items.map((item, itemIndex) => (
                    <Typography
                      key={itemIndex}
                      component="li"
                      className="body-text"
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          <Typography
            className="body-text"
            sx={{
              width: { xs: '100%', md: '80%' },
              mx: 'auto',
              mb: 5,
              my: 5,
            }}
          >
            {MENU_COPY.dietaryNote}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}


