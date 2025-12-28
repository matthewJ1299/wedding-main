import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';

// Import images
import invitePhotoJpg from '../../assets/images/invite-photo.jpg';
import invitePhotoPng from '../../assets/images/invite-photo.png';

const accommodations = [
  {
    name: 'Hotel Sunshine',
    link: 'https://example.com/hotel-sunshine',
    distance: '2km from venue',
    image: invitePhotoJpg,
  },
  {
    name: 'Moonlight Inn',
    link: 'https://example.com/moonlight-inn',
    distance: '3.5km from venue',
    image: invitePhotoPng,
  },
];

const shuttleDetails = {
  info: 'Shuttle service will run every 30 minutes between the venue and listed hotels from 5pm to midnight.',
};

const AccommodationTab = () => (
  <Box sx={{ width: '100%', py: 2, px: { xs: 1, sm: 2 } }}>
    <Typography 
      variant="h5" 
      gutterBottom
      sx={{ 
        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
        textAlign: { xs: 'center', sm: 'left' }
      }}
    >
      Accommodation Options
    </Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        mb: 2, 
        textAlign: { xs: 'center', sm: 'left' },
        fontSize: { xs: '0.9rem', sm: '1rem' }
      }}
    >
      For more options, visit our recommended booking site:
      {' '}
      <Link href="https://www.booking.com" target="_blank" rel="noopener" underline="always">
        booking.com
      </Link>
    </Typography>
    {accommodations.map((hotel, idx) => (
      <Card 
        key={hotel.name} 
        sx={{ 
          display: 'flex', 
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          maxWidth: '100%'
        }}
      >
        <CardMedia
          component="img"
          sx={{ 
            width: { xs: '100%', sm: 151 },
            height: { xs: 200, sm: 'auto' },
            objectFit: 'cover'
          }}
          image={hotel.image}
          alt={hotel.name}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography 
            variant="h6"
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            {hotel.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              textAlign: { xs: 'center', sm: 'left' },
              mb: 1
            }}
          >
            <Link href={hotel.link} target="_blank" rel="noopener">View Details</Link>
          </Typography>
          <Typography 
            variant="body2"
            sx={{ 
              textAlign: { xs: 'center', sm: 'left' },
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            {hotel.distance}
          </Typography>
        </CardContent>
      </Card>
    ))}
    <Box sx={{ mt: 4 }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.3rem', sm: '1.5rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Shuttle Details
      </Typography>
      <Typography 
        variant="body1"
        sx={{ 
          textAlign: { xs: 'center', sm: 'left' },
          fontSize: { xs: '0.95rem', sm: '1rem' }
        }}
      >
        {shuttleDetails.info}
      </Typography>
    </Box>
  </Box>
);

export default AccommodationTab;
