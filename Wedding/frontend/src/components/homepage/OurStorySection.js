import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Timeline from '../ui/Timeline';
import FadeInSection from '../ui/FadeInSection';
import '../../styles/HomePageModern.css';

import { ourStoryImages } from '../../data/ourStoryImageConfig';
import { OUR_STORY_COPY } from '../../data/copy';

const timelineEvents = OUR_STORY_COPY.events.map((event) => ({
  title: event.title,
  description: event.description,
  image: ourStoryImages[event.key]?.image ?? ourStoryImages.theProposal.image,
  objectPosition: ourStoryImages[event.key]?.objectPosition ?? 'center center',
}));

export default function OurStorySection() {
  return (
    <Box id="our-story" className="our-story-section">
      <Box
        sx={{
          textAlign: 'center',
          width: '100%',
          maxWidth: '100vw',
          pt: { xs: 2, md: 5 },
          pb: { xs: 3, md: 5 },
          px: 3,
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          filter: 'grayscale(100%)',
        }}
      >
        <FadeInSection>
          <Typography
            className="section-title"
            sx={{
              fontSize: { xs: '2.4rem', md: '2.4rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              width: '100%',
              textAlign: 'center',
              pb: 0,
            }}
          >
            {OUR_STORY_COPY.sectionTitle}
          </Typography>
        </FadeInSection>
      </Box>

      <Box
        sx={{
          width: '100%',
          maxWidth: '100vw',
          pt: { xs: 0, md: 0 },
          pb: { xs: 5, md: 5 },
          px: { xs: 2, sm: 4, md: 10 },
          background: '#fff',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <Timeline events={timelineEvents} />
        <Typography
          className="body-text-primary"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1rem' },
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          {OUR_STORY_COPY.closingMessage}
        </Typography>
      </Box>
    </Box>
  );
}
