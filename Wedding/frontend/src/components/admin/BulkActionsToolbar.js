import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { sendEmail } from '../../services/emailService';
import { ErrorMessage, SuccessMessage } from '../common/AlertMessage';

/**
 * Bulk actions toolbar for admin panel
 * Allows bulk operations on selected invitees
 */
const BulkActionsToolbar = ({ 
  selectedInvitees, 
  onBulkUpdate, 
  onBulkDelete,
  onClearSelection 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });
  const [rsvpStatus, setRsvpStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedCount = selectedInvitees.length;
  const menuOpen = Boolean(anchorEl);

  /**
   * Handle menu open
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handle menu close
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle bulk email dialog
   */
  const handleBulkEmail = () => {
    setDialogType('email');
    setEmailData({
      subject: 'Wedding Update',
      message: 'Dear [Name],\n\nWe hope this message finds you well. We have an important update about our upcoming wedding.\n\nBest regards,\nMatt & Sydney'
    });
    setDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Handle bulk RSVP status update
   */
  const handleBulkRSVP = () => {
    setDialogType('rsvp');
    setRsvpStatus('pending');
    setDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Handle bulk delete confirmation
   */
  const handleBulkDelete = () => {
    setDialogType('delete');
    setDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Handle dialog close
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType('');
    setError('');
    setSuccess('');
  };

  /**
   * Handle bulk email sending
   */
  const handleSendBulkEmail = async () => {
    if (!emailData.subject.trim() || !emailData.message.trim()) {
      setError('Subject and message are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const emailPromises = selectedInvitees.map(invitee => {
        const personalizedMessage = emailData.message.replace(/\[Name\]/g, invitee.name);
        
        return sendEmail({
          to: invitee.email,
          subject: emailData.subject,
          text: personalizedMessage,
          html: `<p>${personalizedMessage.replace(/\n/g, '<br>')}</p>`
        });
      });

      await Promise.all(emailPromises);
      
      setSuccess(`Successfully sent ${selectedCount} emails`);
      onClearSelection();
      handleDialogClose();
      
    } catch (err) {
      setError('Failed to send some emails. Please check the console for details.');
      console.error('Bulk email error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle bulk RSVP status update
   */
  const handleUpdateBulkRSVP = async () => {
    setLoading(true);
    setError('');

    try {
      const updatePromises = selectedInvitees.map(invitee => 
        onBulkUpdate(invitee.id, { rsvp: rsvpStatus })
      );

      await Promise.all(updatePromises);
      
      setSuccess(`Successfully updated ${selectedCount} invitees`);
      onClearSelection();
      handleDialogClose();
      
    } catch (err) {
      setError('Failed to update some invitees. Please try again.');
      console.error('Bulk update error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle bulk delete
   */
  const handleConfirmBulkDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const deletePromises = selectedInvitees.map(invitee => 
        onBulkDelete(invitee.id)
      );

      await Promise.all(deletePromises);
      
      setSuccess(`Successfully deleted ${selectedCount} invitees`);
      onClearSelection();
      handleDialogClose();
      
    } catch (err) {
      setError('Failed to delete some invitees. Please try again.');
      console.error('Bulk delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        p: 2, 
        backgroundColor: 'rgba(45, 92, 58, 0.1)',
        borderRadius: 1,
        mb: 2
      }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {selectedCount} invitee{selectedCount !== 1 ? 's' : ''} selected
        </Typography>
        
        <Button
          variant="contained"
          size="small"
          onClick={handleMenuOpen}
          sx={{
            backgroundColor: 'var(--accent-color, #2d5c3a)',
            '&:hover': {
              backgroundColor: 'var(--accent-color-dark, #1e3d27)'
            }
          }}
        >
          Bulk Actions
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          onClick={onClearSelection}
        >
          Clear Selection
        </Button>
      </Box>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleBulkEmail}>
          Send Email
        </MenuItem>
        <MenuItem onClick={handleBulkRSVP}>
          Update RSVP Status
        </MenuItem>
        <MenuItem onClick={handleBulkDelete} sx={{ color: 'error.main' }}>
          Delete Selected
        </MenuItem>
      </Menu>

      {/* Bulk Actions Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'email' && 'Send Bulk Email'}
          {dialogType === 'rsvp' && 'Update RSVP Status'}
          {dialogType === 'delete' && 'Delete Selected Invitees'}
        </DialogTitle>
        
        <DialogContent>
          {dialogType === 'email' && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This will send an email to {selectedCount} selected invitee{selectedCount !== 1 ? 's' : ''}.
                Use [Name] in your message to personalize it.
              </Typography>
              
              <TextField
                label="Email Subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              
              <TextField
                label="Email Message"
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                fullWidth
                multiline
                rows={6}
                margin="normal"
                required
              />
            </Box>
          )}

          {dialogType === 'rsvp' && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Update RSVP status for {selectedCount} selected invitee{selectedCount !== 1 ? 's' : ''}.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {['pending', 'accepted', 'mixed', 'declined'].map((status) => (
                  <Chip
                    key={status}
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                    clickable
                    color={rsvpStatus === status ? 'primary' : 'default'}
                    onClick={() => setRsvpStatus(status)}
                  />
                ))}
              </Box>
            </Box>
          )}

          {dialogType === 'delete' && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
                Warning: This will permanently delete {selectedCount} selected invitee{selectedCount !== 1 ? 's' : ''}.
                This action cannot be undone.
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected invitees:
              </Typography>
              
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {selectedInvitees.map((invitee) => (
                  <Typography key={invitee.id} variant="body2" sx={{ mb: 0.5 }}>
                    • {invitee.name} {invitee.partner && `& ${invitee.partner}`}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Messages */}
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (dialogType === 'email') handleSendBulkEmail();
              if (dialogType === 'rsvp') handleUpdateBulkRSVP();
              if (dialogType === 'delete') handleConfirmBulkDelete();
            }}
            variant="contained"
            disabled={loading}
            color={dialogType === 'delete' ? 'error' : 'primary'}
            sx={{
              backgroundColor: dialogType === 'delete' ? 'error.main' : 'var(--accent-color, #2d5c3a)',
              '&:hover': {
                backgroundColor: dialogType === 'delete' ? 'error.dark' : 'var(--accent-color-dark, #1e3d27)'
              }
            }}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BulkActionsToolbar;





