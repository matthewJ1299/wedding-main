import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import { PhotoService } from '../../services/photoService';
import { TextInput } from '../common/FormField';
import { ErrorMessage, SuccessMessage } from '../common/AlertMessage';
import { UPLOAD_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';

/**
 * Photo upload component for guests to share photos
 */
const PhotoUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderEmail, setUploaderEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Handle file selection
   */
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file
    const validation = PhotoService.validateFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!file) {
      setError('Please select a photo to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const result = await PhotoService.uploadPhoto(
        file, 
        uploaderName.trim(), 
        uploaderEmail.trim()
      );

      setSuccess(SUCCESS_MESSAGES.PHOTO_UPLOADED);
      
      // Reset form
      setFile(null);
      setPreview(null);
      setUploaderName('');
      setUploaderEmail('');
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }

    } catch (err) {
      setError(err.message || ERROR_MESSAGES.FILE_UPLOAD_FAILED);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Clear form
   */
  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setUploaderName('');
    setUploaderEmail('');
    setError('');
    setSuccess('');
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Cormorant Garamond, serif' }}>
        Share Your Photos
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload your favorite photos from the wedding celebration. Photos will be reviewed before appearing in the gallery.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {/* File Upload */}
        <Box sx={{ mb: 3 }}>
          <input
            type="file"
            accept={UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.join(',')}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              sx={{ mb: 2, py: 1.5 }}
            >
              {file ? 'Change Photo' : 'Select Photo'}
            </Button>
          </label>
          
          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}
        </Box>

        {/* Preview */}
        {preview && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </Box>
        )}

        {/* Uploader Info */}
        <TextInput
          label="Your Name (Optional)"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="Enter your name"
          sx={{ mb: 2 }}
        />

        <TextInput
          label="Your Email (Optional)"
          value={uploaderEmail}
          onChange={(e) => setUploaderEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
          sx={{ mb: 3 }}
        />

        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              Uploading photo...
            </Typography>
          </Box>
        )}

        {/* Messages */}
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleClear}
            disabled={uploading}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!file || uploading}
            sx={{
              backgroundColor: 'var(--accent-color, #2d5c3a)',
              '&:hover': {
                backgroundColor: 'var(--accent-color-dark, #1e3d27)'
              }
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PhotoUpload;





