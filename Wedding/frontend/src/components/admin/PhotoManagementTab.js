import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import { PhotoService } from '../../services/photoService';
import { ErrorMessage, SuccessMessage } from '../common/AlertMessage';

/**
 * Photo management tab for admin panel
 * Allows admins to approve, reject, and delete photos
 */
const PhotoManagementTab = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  /**
   * Load photos based on tab selection
   */
  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      let photoData;
      if (activeTab === 0) {
        // All photos
        photoData = await PhotoService.getPhotos();
      } else if (activeTab === 1) {
        // Pending photos
        photoData = await PhotoService.getPendingPhotos();
      } else {
        // Approved photos
        photoData = await PhotoService.getApprovedPhotos();
      }
      
      setPhotos(photoData);
      
    } catch (err) {
      setError('Failed to load photos. Please try again later.');
      console.error('Error loading photos:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  /**
   * Handle tab change
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Approve a photo
   */
  const handleApprove = async (photoId) => {
    try {
      setError('');
      await PhotoService.approvePhoto(photoId);
      setSuccess('Photo approved successfully!');
      loadPhotos(); // Refresh the list
    } catch (err) {
      setError('Failed to approve photo. Please try again.');
      console.error('Error approving photo:', err);
    }
  };

  /**
   * Reject a photo
   */
  // const handleReject = async (photoId) => {
  //   try {
  //     setError('');
  //     await PhotoService.rejectPhoto(photoId);
  //     setSuccess('Photo rejected successfully!');
  //     loadPhotos(); // Refresh the list
  //   } catch (err) {
  //     setError('Failed to reject photo. Please try again.');
  //     console.error('Error rejecting photo:', err);
  //   }
  // };

  /**
   * Delete a photo
   */
  const handleDelete = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      await PhotoService.deletePhoto(photoId);
      setSuccess('Photo deleted successfully!');
      loadPhotos(); // Refresh the list
    } catch (err) {
      setError('Failed to delete photo. Please try again.');
      console.error('Error deleting photo:', err);
    }
  };

  // Load photos when component mounts or tab changes
  useEffect(() => {
    loadPhotos();
  }, [activeTab, loadPhotos]);

  // Clear messages after a delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'Cormorant Garamond, serif',
          color: 'var(--accent-color, #2d5c3a)',
          mb: 3,
          textAlign: 'center'
        }}
      >
        Photo Management
      </Typography>

      {/* Messages */}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="All Photos" />
          <Tab label="Pending Review" />
          <Tab label="Approved" />
        </Tabs>
      </Box>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {activeTab === 0 && 'No photos uploaded yet.'}
            {activeTab === 1 && 'No photos pending review.'}
            {activeTab === 2 && 'No approved photos yet.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={PhotoService.getPhotoUrl(photo.id)}
                  alt={photo.originalName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {photo.originalName}
                  </Typography>
                  
                  {photo.uploaderName && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      By: {photo.uploaderName}
                    </Typography>
                  )}
                  
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={photo.approved ? 'Approved' : 'Pending'}
                      color={photo.approved ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    {(photo.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  {!photo.approved && (
                    <Button
                      size="small"
                      color="success"
                      onClick={() => handleApprove(photo.id)}
                    >
                      Approve
                    </Button>
                  )}
                  
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(photo.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PhotoManagementTab;





