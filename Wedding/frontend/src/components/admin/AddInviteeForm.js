import React, { useState } from 'react';
import { useInvitees } from '../../contexts/InviteeContext';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Typography from '../../components/ui/Typography';
import { TextInput } from '../../components/ui/FormComponents';
import Button from '../../components/ui/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

/**
 * Validates if a string is a valid email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Form component for adding new invitees
 */
const AddInviteeForm = ({ addInvitee, hideTitle = false, onAdded }) => {
  const [name, setName] = useState('');
  const [partner, setPartner] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plusOneEmail, setPlusOneEmail] = useState('');
  const [plusOnePhone, setPlusOnePhone] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [plusOneEmailError, setPlusOneEmailError] = useState('');
  const [plusOnePhoneError, setPlusOnePhoneError] = useState('');
  const [allowPlusOne, setAllowPlusOne] = useState(false);
  const { invitees } = useInvitees();

  /**
   * Handle form submission to add a new invitee
   */
  const handleAdd = async () => {
    // Validate required fields
    if (!name.trim() || !email.trim()) {
      setSuccess('Name and email are required.');
      return;
    }
    
    // Validate email format
    if (!isValidEmail(email.trim())) {
      setEmailError('Invalid email address.');
      setSuccess('');
      return;
    } else {
      setEmailError('');
    }

    // Validate phone (optional): allow + and digits, max 15 digits total excluding +
    if (phone && !/^\+?\d{1,15}$/.test(phone.trim())) {
      setPhoneError('Invalid phone number. Use digits with optional + and max 15 digits.');
      setSuccess('');
      return;
    } else {
      setPhoneError('');
    }

    const trimmedPlusOneEmail = (plusOneEmail || '').trim();
    const trimmedPlusOnePhone = (plusOnePhone || '').trim();

    if (allowPlusOne && trimmedPlusOneEmail && !isValidEmail(trimmedPlusOneEmail)) {
      setPlusOneEmailError('Invalid plus one email address.');
      setSuccess('');
      return;
    } else {
      setPlusOneEmailError('');
    }

    if (allowPlusOne && trimmedPlusOnePhone && !/^\+?\d{1,15}$/.test(trimmedPlusOnePhone)) {
      setPlusOnePhoneError('Invalid plus one phone number. Use digits with optional + and max 15 digits.');
      setSuccess('');
      return;
    } else {
      setPlusOnePhoneError('');
    }
    
    // Add invitee and reset form
    await addInvitee({ 
      name: name.trim(), 
      partner: partner.trim(), 
      email: email.trim(), 
      phone: phone.trim(), 
      allowPlusOne,
      plusOneEmail: allowPlusOne ? trimmedPlusOneEmail : '',
      plusOnePhone: allowPlusOne ? trimmedPlusOnePhone : '',
    });
    setSuccess('Invitee added!');
    setName('');
    setPartner('');
    setEmail('');
    setPhone('');
    setPlusOneEmail('');
    setPlusOnePhone('');
    if (onAdded) onAdded();
  };

  return (
    <Box sx={{ 
      mb: 3, 
      width: '100%', 
      maxWidth: { xs: '100%', sm: '500px' },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      px: { xs: 1, sm: 0 }
    }}>
      {!hideTitle ? (
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Add Invitee
        </Typography>
      ) : null}
      
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
        <TextInput
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          fullWidth
          sx={{ m: 0 }}
        />
        
        <Autocomplete
          options={invitees.map(inv => inv.name)}
          value={partner}
          onChange={(_, newValue) => setPartner(newValue || '')}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label={allowPlusOne ? 'Partner / Plus One Name' : 'Partner'}
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ m: 0 }}
            />
          )}
        />
        
        <TextInput
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={emailError}
          required
          fullWidth
          sx={{ m: 0 }}
        />
        
        <TextInput
          label="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          error={phoneError}
          fullWidth
          sx={{ m: 0 }}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={allowPlusOne}
                onChange={e => setAllowPlusOne(e.target.checked)}
                color="primary"
              />
            }
            label="Allow Plus One"
          />
        </Box>

        {allowPlusOne ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
            <TextInput
              label="Plus One Email"
              value={plusOneEmail}
              onChange={e => setPlusOneEmail(e.target.value)}
              error={plusOneEmailError}
              fullWidth
              sx={{ m: 0 }}
            />
            <TextInput
              label="Plus One Phone"
              value={plusOnePhone}
              onChange={e => setPlusOnePhone(e.target.value)}
              error={plusOnePhoneError}
              fullWidth
              sx={{ m: 0 }}
            />
          </Box>
        ) : null}
        
        <Button 
          variant="contained" 
          onClick={handleAdd} 
          sx={{ 
            mt: 2,
            mb: 2,
            alignSelf: 'center',
            minWidth: '120px'
          }}
        >
          Add
        </Button>
        
        {success && (
          <Typography preset="success" sx={{ textAlign: 'center', mt: 1 }}>
            {success}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AddInviteeForm;