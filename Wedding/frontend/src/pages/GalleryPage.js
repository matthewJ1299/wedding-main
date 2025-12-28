import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { PhotoService } from '../services/photoService';
import PhotoUpload from '../components/gallery/PhotoUpload';
import PhotoGrid from '../components/gallery/PhotoGrid';
import { ErrorMessage, SuccessMessage } from '../components/common/AlertMessage';

/**
 * Gallery page component for photo sharing and viewing
 */
const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  /**
   * Load approved photos for gallery
   */
  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const approvedPhotos = await PhotoService.getApprovedPhotos();
      setPhotos(approvedPhotos);
      
    } catch (err) {
      setError('Failed to load photos. Please try again later.');
      console.error('Error loading photos:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle successful photo upload
   */
  const handleUploadSuccess = (uploadedPhoto) => {
    setSuccess('Thank you for sharing your photo! It will be reviewed before appearing in the gallery.');
    
    // Refresh photos after a short delay
    setTimeout(() => {
      loadPhotos();
    }, 2000);
  };

  /**
   * Handle tab change
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Load photos on component mount
  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'Great Vibes, cursive',
            color: 'var(--accent-color, #2d5c3a)',
            mb: 2
          }}
        >
          Photo Gallery
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Cormorant Garamond, serif',
            color: 'text.secondary',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Share your favorite moments from our wedding celebration. 
          Upload your photos to be part of our special memories.
        </Typography>
      </Box>

      {/* Messages */}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab 
            label="Gallery" 
            sx={{ 
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 500
            }} 
          />
          <Tab 
            label="Share Photos" 
            sx={{ 
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 500
            }} 
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Cormorant Garamond, serif',
              mb: 3,
              textAlign: 'center',
              color: 'var(--accent-color, #2d5c3a)'
            }}
          >
            Wedding Memories
          </Typography>
          <PhotoGrid photos={photos} loading={loading} />
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <PhotoUpload onUploadSuccess={handleUploadSuccess} />
          
          {/* Upload Guidelines */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: 'rgba(45, 92, 58, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(45, 92, 58, 0.1)'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Cormorant Garamond, serif',
                color: 'var(--accent-color, #2d5c3a)',
                mb: 2
              }}
            >
              Photo Guidelines
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Upload high-quality photos from the wedding celebration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Supported formats: JPEG, PNG, WebP
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Maximum file size: 10MB
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Photos will be reviewed before appearing in the gallery
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default GalleryPage;





