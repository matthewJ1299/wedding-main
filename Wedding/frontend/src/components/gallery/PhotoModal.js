import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { PhotoService } from '../../services/photoService';

/**
 * Photo modal component for lightbox-style photo viewing
 */
const PhotoModal = ({ open, onClose, photo }) => {
  if (!photo) return null;

  /**
   * Handle modal close
   */
  const handleClose = () => {
    onClose();
  };

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onClick={handleBackdropClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: 2,
          overflow: 'hidden',
          outline: 'none'
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Photo */}
        <Box
          component="img"
          src={PhotoService.getPhotoUrl(photo.id)}
          alt={`Wedding photo - ${photo.originalName}`}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '90vh',
            objectFit: 'contain',
            display: 'block'
          }}
        />

        {/* Photo Info */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            p: 2
          }}
        >
          {photo.uploaderName && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Shared by: {photo.uploaderName}
            </Typography>
          )}
          <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
            {photo.originalName}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default PhotoModal;





