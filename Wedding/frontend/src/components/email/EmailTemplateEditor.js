import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Toolbar, IconButton, Tooltip, Typography, 
         TextField, Button, Dialog, DialogTitle, DialogContent, 
         DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LinkIcon from '@mui/icons-material/Link';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CodeIcon from '@mui/icons-material/Code';
import { TEMPLATE_VARIABLES } from '../../models/emailTemplateModel';

/**
 * Simple rich text editor component for email templates
 * 
 * @param {Object} props - Component props
 * @param {string} props.initialHtml - Initial HTML content
 * @param {string} props.initialText - Initial plain text content
 * @param {Function} props.onChange - Change handler for HTML and text content
 * @returns {JSX.Element} - EmailTemplateEditor component
 */
const EmailTemplateEditor = ({ initialHtml = '', initialText = '', onChange }) => {
  const [html, setHtml] = useState(initialHtml);
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedVariable, setSelectedVariable] = useState('');
  
  const editorRef = useRef(null);
  
  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && initialHtml) {
      editorRef.current.innerHTML = initialHtml;
    }
  }, [initialHtml]);
  
  // Helper function to handle formatting commands
  const handleFormatCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    updateContent();
  };
  
  // Update content state and call onChange when content changes
  const updateContent = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      const newText = editorRef.current.innerText;
      setHtml(newHtml);
      if (onChange) {
        onChange({ html: newHtml, text: newText });
      }
    }
  };
  
  // Handle content change in HTML editor
  const handleHtmlChange = (e) => {
    const newHtml = e.target.value;
    setHtml(newHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = newHtml;
    }
    if (onChange) {
      onChange({ html: newHtml, text: editorRef.current?.innerText || '' });
    }
  };
  
  // Handle inserting link
  const handleInsertLink = () => {
    if (linkUrl) {
      const link = `<a href="${linkUrl}" style="color: #043A14;">${linkText || linkUrl}</a>`;
      document.execCommand('insertHTML', false, link);
      setLinkDialogOpen(false);
      setLinkUrl('');
      setLinkText('');
      updateContent();
    }
  };
  
  // Handle inserting template variable
  const handleInsertVariable = () => {
    if (selectedVariable) {
      document.execCommand('insertHTML', false, `<span style="background-color:#f0f8f1;padding:2px 4px;border-radius:3px;font-weight:bold;">${selectedVariable}</span>`);
      setSelectedVariable('');
      updateContent();
    }
  };

  const looksLikeHtml = (text) => {
    if (!text) return false;
    const t = String(text).trim();
    if (t.startsWith('<!DOCTYPE') || t.startsWith('<html') || t.startsWith('<?xml')) return true;
    // Common email-template fragments people paste
    return /<table[\s>]|<body[\s>]|<head[\s>]|<div[\s>]/i.test(t);
  };

  const handleEditorPaste = (e) => {
    try {
      const text = e.clipboardData?.getData('text/plain') ?? '';
      if (!looksLikeHtml(text)) return;

      // If the user pastes raw HTML into the WYSIWYG editor, treat it as HTML
      // instead of inserting it as literal text nodes.
      e.preventDefault();
      if (editorRef.current) {
        editorRef.current.innerHTML = text;
        updateContent();
      }
    } catch (_) {
      // If anything goes wrong, let the browser handle paste normally.
    }
  };
  
  return (
    <Box sx={{ mb: 3 }}>
      <Paper variant="outlined" sx={{ mb: 2 }}>
        <Toolbar variant="dense" sx={{ borderBottom: '1px solid #e0e0e0', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Tooltip title="Bold">
            <IconButton onClick={() => handleFormatCommand('bold')}>
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton onClick={() => handleFormatCommand('italic')}>
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton onClick={() => handleFormatCommand('underline')}>
              <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Insert Link">
            <IconButton onClick={() => setLinkDialogOpen(true)}>
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Text Color">
            <IconButton onClick={() => handleFormatCommand('foreColor', '#043A14')}>
              <FormatColorTextIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align Left">
            <IconButton onClick={() => handleFormatCommand('justifyLeft')}>
              <FormatAlignLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align Center">
            <IconButton onClick={() => handleFormatCommand('justifyCenter')}>
              <FormatAlignCenterIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align Right">
            <IconButton onClick={() => handleFormatCommand('justifyRight')}>
              <FormatAlignRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bullet List">
            <IconButton onClick={() => handleFormatCommand('insertUnorderedList')}>
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Numbered List">
            <IconButton onClick={() => handleFormatCommand('insertOrderedList')}>
              <FormatListNumberedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View/Edit HTML">
            <IconButton onClick={() => setShowHtmlEditor(!showHtmlEditor)}>
              <CodeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="variable-select-label">Insert Variable</InputLabel>
              <Select
                labelId="variable-select-label"
                value={selectedVariable}
                onChange={(e) => setSelectedVariable(e.target.value)}
                label="Insert Variable"
                size="small"
              >
                {Object.values(TEMPLATE_VARIABLES).map((variable) => (
                  <MenuItem key={variable} value={variable}>
                    {variable}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              size="small" 
              variant="contained" 
              disabled={!selectedVariable}
              onClick={handleInsertVariable}
            >
              Insert
            </Button>
          </Box>
        </Toolbar>
        
        {showHtmlEditor ? (
          <TextField
            multiline
            fullWidth
            value={html}
            onChange={handleHtmlChange}
            variant="outlined"
            rows={15}
            sx={{ p: 2, '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
          />
        ) : (
          <Box
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onPaste={handleEditorPaste}
            onInput={updateContent}
            onBlur={updateContent}
            sx={{
              minHeight: '300px',
              p: 2,
              outline: 'none',
              overflowY: 'auto',
              fontFamily: 'inherit',
              '&:focus': { outline: 'none' }
            }}
          />
        )}
      </Paper>
      
      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Link URL"
            type="url"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Link Text (optional)"
            type="text"
            fullWidth
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleInsertLink} variant="contained" disabled={!linkUrl}>
            Insert
          </Button>
        </DialogActions>
      </Dialog>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Tip: Use the toolbar buttons for formatting. View the HTML code by clicking the &lt;/&gt; button.
        </Typography>
      </Box>
    </Box>
  );
};

export default EmailTemplateEditor;