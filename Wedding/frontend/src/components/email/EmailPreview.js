import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Tabs, Tab, TextField, Button, 
         Grid, FormControl, InputLabel, OutlinedInput, InputAdornment, 
         IconButton, Dialog, DialogTitle, DialogContent, CircularProgress } from '@mui/material';
import { useEmailTemplates } from '../../contexts/EmailTemplateContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * Email Preview Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.template - Email template to preview
 * @param {Object} props.recipientData - Recipient data for variable substitution
 * @param {Function} props.onSend - Function to call when sending email
 * @returns {JSX.Element} - EmailPreview component
 */
const EmailPreview = ({ template, recipientData, onSend }) => {
  const [previewTab, setPreviewTab] = useState(0);
  const [previewData, setPreviewData] = useState({});
  const [previewContent, setPreviewContent] = useState({ html: '', text: '', subject: '' });
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { prepareTemplate } = useEmailTemplates();
  
  // Generate preview content with variables replaced - using useCallback
  const updatePreviewContent = useCallback(() => {
    if (!template) return;
    
    const preparedTemplate = prepareTemplate(template.id, previewData);
    if (preparedTemplate) {
      setPreviewContent({
        html: preparedTemplate.html,
        text: preparedTemplate.text,
        subject: preparedTemplate.subject
      });
    }
  }, [template, previewData, prepareTemplate]);
  
  // Initialize preview data with recipient data
  useEffect(() => {
    if (recipientData) {
      setPreviewData(recipientData);
    } else {
      // Default sample data
      setPreviewData({
        guestName: 'Sample Guest',
        guestPartner: 'Sample Partner',
        weddingDate: 'June 15, 2025',
        weddingLocation: 'Beautiful Venue',
        eventAddress: '123 Wedding Lane, Celebration City',
        rsvpLink: 'https://wedding.example.com/rsvp',
        websiteLink: 'https://wedding.example.com'
      });
    }
  }, [recipientData]);
  
  // Update preview content when template or preview data changes
  useEffect(() => {
    if (template) {
      updatePreviewContent();
    }
  }, [template, updatePreviewContent]);
  
  // Handle variable input change
  const handleVariableChange = (variable, value) => {
    setPreviewData(prev => ({
      ...prev,
      [variable]: value
    }));
  };
  
  // Copy content to clipboard
  const handleCopyContent = () => {
    const contentToCopy = previewTab === 0 ? previewContent.html : previewContent.text;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle sending email
  const handleSendEmail = () => {
    setLoading(true);
    
    if (onSend) {
      onSend({
        to: recipientData?.email || '',
        subject: previewContent.subject,
        text: previewContent.text,
        html: previewContent.html
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setTimeout(() => setLoading(false), 1000);
    }
  };
  
  if (!template) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Select a template to preview
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Preview: {template.name}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Subject:</Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography>{previewContent.subject}</Typography>
        </Paper>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Template Variables:</Typography>
        <Grid container spacing={2}>
          {template.variables?.map((variable) => (
            <Grid item xs={12} sm={6} md={4} key={variable}>
              <TextField
                fullWidth
                label={variable}
                value={previewData[variable] || ''}
                onChange={(e) => handleVariableChange(variable, e.target.value)}
                margin="normal"
                size="small"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={previewTab} onChange={(_, value) => setPreviewTab(value)}>
          <Tab label="HTML Preview" />
          <Tab label="Text Preview" />
        </Tabs>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          startIcon={<VisibilityIcon />} 
          onClick={() => setPreviewDialogOpen(true)}
        >
          Full Preview
        </Button>
        <Button 
          startIcon={copied ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />} 
          onClick={handleCopyContent}
        >
          {copied ? 'Copied!' : 'Copy Content'}
        </Button>
      </Box>
      
      <Paper variant="outlined" sx={{ mb: 3, maxHeight: '400px', overflow: 'auto' }}>
        {previewTab === 0 ? (
          <Box sx={{ p: 2 }} dangerouslySetInnerHTML={{ __html: previewContent.html }} />
        ) : (
          <Box sx={{ p: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {previewContent.text}
          </Box>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl sx={{ width: '70%' }} variant="outlined" size="small">
          <InputLabel htmlFor="recipient-email">Recipient Email</InputLabel>
          <OutlinedInput
            id="recipient-email"
            type="email"
            value={recipientData?.email || ''}
            onChange={(e) => handleVariableChange('email', e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end">
                  <VisibilityIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Recipient Email"
          />
        </FormControl>
        
        <Button 
          variant="contained" 
          color="primary" 
          disabled={!recipientData?.email || loading}
          onClick={handleSendEmail}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
      </Box>
      
      {/* Full Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Email Preview: {previewContent.subject}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>From:</strong> Your Wedding &lt;wedding@example.com&gt;
            </Typography>
            <Typography variant="body2">
              <strong>To:</strong> {recipientData?.email || 'recipient@example.com'}
            </Typography>
            <Typography variant="body2">
              <strong>Subject:</strong> {previewContent.subject}
            </Typography>
          </Box>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              maxHeight: '500px', 
              overflow: 'auto',
              bgcolor: '#ffffff'
            }}
          >
            <Box dangerouslySetInnerHTML={{ __html: previewContent.html }} />
          </Paper>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmailPreview;