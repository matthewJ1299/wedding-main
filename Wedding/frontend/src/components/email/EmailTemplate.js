import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

/**
 * Component for displaying an email template with actions
 * 
 * @param {Object} props - Component props
 * @param {Object} props.template - Template data
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onSelect - Select handler
 * @param {Function} props.onDuplicate - Duplicate handler
 * @param {boolean} props.selected - Whether this template is selected
 * @returns {JSX.Element} - EmailTemplate component
 */
const EmailTemplate = ({ template, onEdit, onDelete, onSelect, onDuplicate, selected }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // No longer needed, variable names already come without braces
  
  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderLeft: selected ? '4px solid #043A14' : 'none',
        boxShadow: selected ? '0 0 5px rgba(4, 58, 20, 0.5)' : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">{template.name}</Typography>
          <Box>
            <IconButton size="small" onClick={() => onEdit(template)} aria-label="Edit template">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDuplicate(template)} aria-label="Duplicate template">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(template.id)} aria-label="Delete template">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Subject: {template.subject}
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Variables:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {template.variables?.map((variable) => (
              <Chip 
                key={variable} 
                label={variable} 
                size="small" 
                sx={{ backgroundColor: '#f0f8f1', color: '#043A14' }}
              />
            ))}
          </Box>
        </Box>
        
        {showDetails && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Plain Text Preview:
            </Typography>
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mt: 1, fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
              {template.text.substring(0, 200)}
              {template.text.length > 200 ? '...' : ''}
            </Box>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button size="small" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
        <Button 
          variant={selected ? 'contained' : 'outlined'} 
          color="primary" 
          size="small" 
          onClick={() => onSelect(template)}
        >
          {selected ? 'Selected' : 'Use Template'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default EmailTemplate;