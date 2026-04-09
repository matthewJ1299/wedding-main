import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

import RsvpForm from './RsvpForm';

export default function RsvpModal({ open, inviteCode, onClose }) {
  return (
    <Dialog
      open={Boolean(open)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
      PaperProps={{
        sx: {
          borderRadius: 0,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: 'Cormorant Garamond, serif',
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontWeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
        }}
      >
        RSVP
        <IconButton aria-label="Close RSVP modal" onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 4 }}>
        <Box sx={{ width: '100%' }}>
          <RsvpForm inviteCode={inviteCode} onRequestClose={onClose} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

