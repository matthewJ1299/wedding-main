import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { PhotoService } from '../../services/photoService';
import PhotoModal from './PhotoModal';

/**
 * Photo grid component for displaying approved photos in a masonry-like layout
 */
const PhotoGrid = ({ photos = [], loading = false }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Handle photo click to open modal
   */
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setModalOpen(true);
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPhoto(null);
  };

  /**
   * Render loading skeleton
   */
  const renderSkeleton = () => (
    <Grid container spacing={2}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Grid>
      ))}
    </Grid>
  );

  /**
   * Render photo card
   */
  const renderPhotoCard = (photo, index) => (
    <Grid item xs={12} sm={6} md={4} key={photo.id}>
      <Card
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }
        }}
        onClick={() => handlePhotoClick(photo)}
      >
        <CardMedia
          component="img"
          height="200"
          image={PhotoService.getPhotoUrl(photo.id)}
          alt={`Wedding photo ${index + 1}`}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          loading="lazy"
        />
      </Card>
    </Grid>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (photos.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary'
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: 'Cormorant Garamond, serif', mb: 1 }}>
          No photos yet
        </Typography>
        <Typography variant="body2">
          Be the first to share your photos from the wedding!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {photos.map((photo, index) => renderPhotoCard(photo, index))}
      </Grid>

      {/* Photo Modal */}
      <PhotoModal
        open={modalOpen}
        onClose={handleModalClose}
        photo={selectedPhoto}
      />
    </>
  );
};

export default PhotoGrid;





