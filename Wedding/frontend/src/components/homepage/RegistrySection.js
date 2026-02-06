import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { REGISTRY_COPY } from '../../data/copy';
import '../../styles/HomePageModern.css';
import registryBgImage from '../../assets/images/IMG-166.jpg';

export default function RegistrySection() {
  return (
    <Box
      id="registry"
      className="registry-page-section registry-with-bg"
      sx={{
        position: 'relative',
        padding: 0,
        minHeight: '500px',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={registryBgImage}
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          top: 0,
          left: '-8%',
          width: '130%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 6,
          px: 3,
        }}
      >
        <Typography
          className="section-title"
          sx={{
            color: '#fff',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
          }}
        >
          {REGISTRY_COPY.sectionTitle}
        </Typography>

        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
            p: 4,
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          <Typography
            className="body-text"
            sx={{ mb: 4, textAlign: 'center' }}
          >
            {REGISTRY_COPY.intro}
          </Typography>

          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'rgba(45, 92, 58, 0.08)',
              border: '1px solid rgba(45, 92, 58, 0.25)',
              textAlign: 'center',
            }}
          >
            <Typography className="subsection-title" sx={{ mb: 3 }}>
              {REGISTRY_COPY.accountDetailsTitle}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
              <Typography className="body-text-primary">Bank Account: {REGISTRY_COPY.bankName}</Typography>
              <Typography className="body-text-primary">Account Number: {REGISTRY_COPY.accountNumber}</Typography>
              <Typography className="body-text-primary">SWIFT Code: {REGISTRY_COPY.swiftCode}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

