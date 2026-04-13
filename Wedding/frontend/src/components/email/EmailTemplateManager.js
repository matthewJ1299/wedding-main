import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Dialog, DialogTitle, DialogContent, 
         DialogActions, TextField, Button, Tab, Tabs, CircularProgress, 
         Alert } from '@mui/material';
import { useEmailTemplates } from '../../contexts/EmailTemplateContext';
import EmailTemplate from './EmailTemplate';
import EmailTemplateEditor from './EmailTemplateEditor';
import { extractTemplateVariables } from '../../models/emailTemplateModel';

/**
 * Email Template Management Component
 * 
 * @returns {JSX.Element} - EmailTemplateManager component
 */
const EmailTemplateManager = () => {
  const { 
    templates, 
    loading, 
    addTemplate, 
    updateTemplate, 
    deleteTemplate, 
    resetTemplates,
    selectedTemplate,
    setSelectedTemplate
  } = useEmailTemplates();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [editorContent, setEditorContent] = useState({ html: '', text: '' });
  const [templateData, setTemplateData] = useState({
    name: '',
    subject: '',
  });
  // Reset editor content when editing template changes
  useEffect(() => {
    if (editingTemplate) {
      setTemplateData({
        name: editingTemplate.name,
        subject: editingTemplate.subject
      });
      setEditorContent({
        html: editingTemplate.html,
        text: editingTemplate.text
      });
    } else {
      setTemplateData({ name: '', subject: '' });
      setEditorContent({ html: '', text: '' });
    }
  }, [editingTemplate]);

  const handleOpenDialog = (template = null) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSaveTemplate = () => {
    try {
      // Extract variables from template content
      const htmlVariables = extractTemplateVariables(editorContent.html);
      const textVariables = extractTemplateVariables(editorContent.text);
      const subjectVariables = extractTemplateVariables(templateData.subject);
      
      // Combine all unique variables
      const variables = [...new Set([...htmlVariables, ...textVariables, ...subjectVariables])];
      
      const templateToSave = {
        name: templateData.name,
        subject: templateData.subject,
        html: editorContent.html,
        text: editorContent.text,
        variables
      };

      if (editingTemplate) {
        updateTemplate(editingTemplate.id, templateToSave);
      } else {
        addTemplate(templateToSave);
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDeleteTemplate = (id) => {
    try {
      deleteTemplate(id);
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleDuplicateTemplate = (template) => {
    try {
      const duplicatedTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        id: undefined
      };
      addTemplate(duplicatedTemplate);
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleResetTemplates = () => {
    if (window.confirm('This will reset all templates to defaults. Are you sure?')) {
      resetTemplates();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Email Templates</Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => handleOpenDialog()}
            sx={{ mr: 1 }}
          >
            Create New Template
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleResetTemplates}
          >
            Reset to Defaults
          </Button>
        </Box>
      </Box>

      {templates.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No templates available. Create a new template or reset to defaults.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <EmailTemplate 
                template={template}
                onEdit={() => handleOpenDialog(template)}
                onDelete={handleDeleteTemplate}
                onSelect={setSelectedTemplate}
                onDuplicate={handleDuplicateTemplate}
                selected={selectedTemplate?.id === template.id}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Template Editor Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {editingTemplate ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <TextField 
              label="Template Name" 
              fullWidth 
              value={templateData.name} 
              onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField 
              label="Email Subject" 
              fullWidth 
              value={templateData.subject} 
              onChange={(e) => setTemplateData({...templateData, subject: e.target.value})}
            />
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="HTML Content" />
              <Tab label="Plain Text Content" />
            </Tabs>
          </Box>

          {tabValue === 0 ? (
            <EmailTemplateEditor 
              initialHtml={editingTemplate?.html || ''}
              initialText={editingTemplate?.text || ''}
              onChange={handleEditorChange}
            />
          ) : (
            <TextField 
              multiline
              rows={15}
              fullWidth
              variant="outlined"
              value={editorContent.text}
              onChange={(e) => setEditorContent({...editorContent, text: e.target.value})}
              placeholder="Enter plain text version of the email..."
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveTemplate} 
            variant="contained" 
            disabled={!templateData.name || !templateData.subject}
          >
            Save Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailTemplateManager;