import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '../../components/ui/Typography';
import { TextInput, SelectInput } from '../../components/ui/FormComponents';
import Button from '../../components/ui/Button';

/**
 * Validates if a string is a valid email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Form component for sending emails to invitees
 */
const EmailForm = ({ invitees, sendEmail }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('all');
  const [result, setResult] = useState('');
  const [invalidEmails, setInvalidEmails] = useState([]);

  /**
   * Handle sending emails to selected recipients
   */
  const handleSend = () => {
    // Filter recipients by selected status
    let recipients = invitees;
    if (status !== 'all') {
      recipients = invitees.filter(inv => (inv.rsvp || 'pending').toLowerCase() === status);
    }
    
    // Filter out invalid emails
    const valids = recipients.filter(inv => isValidEmail(inv.email));
    const invalids = recipients.filter(inv => !isValidEmail(inv.email)).map(inv => inv.email);
    
    // Send emails
    valids.forEach(inv => {
      sendEmail({ to: inv.email, subject, text: body });
    });
    
    // Show results
    setResult(`Sent to ${valids.length} recipients.${invalids.length ? ' Skipped invalid: ' + invalids.join(', ') : ''}`);
    setInvalidEmails(invalids);
  };

  // Options for the status dropdown
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
    { value: 'pending', label: 'Pending' }
  ];

  return (
    <Box sx={{ 
      mt: 2, 
      width: '100%', 
      maxWidth: { xs: '100%', sm: '500px' },
      px: { xs: 1, sm: 0 }
    }}>
      <Typography 
        variant="h6"
        sx={{ 
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          mb: 2
        }}
      >
        Send Email
      </Typography>
      
      <TextInput
        label="Subject"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        fullWidth
      />
      
      <TextInput
        label="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
        fullWidth
        multiline
        rows={4}
      />
      
      <SelectInput
        label="Recipient Status"
        value={status}
        onChange={e => setStatus(e.target.value)}
        options={statusOptions}
      />
      
      <Button
        variant="contained"
        onClick={handleSend}
        sx={{ m: 1 }}
      >
        Send
      </Button>
      
      {result && (
        <Typography preset="success">{result}</Typography>
      )}
      
      {invalidEmails.length > 0 && (
        <Typography preset="error">
          Invalid emails skipped: {invalidEmails.join(', ')}
        </Typography>
      )}
    </Box>
  );
};

export default EmailForm;