import React, { useEffect, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Link, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { HeaderNavigation } from '../components/homepage';
import '../styles/HomePageModern.css';
import '../styles/RSVPPage.css';

// Import contexts
import { useInvitees } from '../contexts/InviteeContext';

// Import services
import { sendEmail } from '../services/emailService';
import { generateApprovalLink } from '../services/approvalService';

// Import UI components
import Typography from '../components/ui/Typography';
import Button from '../components/ui/Button';

// Import shared utilities and components
import { sanitizeInput, validateEmail, validatePhone } from '../utils/validation';
import { APP_URLS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';
import { EmailInput, PhoneInput, TextAreaInput, SelectInput, ErrorMessage, SuccessMessage, TextInput } from '../components/common';

/**
 * RSVP page component handling wedding attendance confirmation
 */
export default function RSVPPage() {
  const { inviteCode } = useParams();
  const { invitees, updateInvitee } = useInvitees();
  
  const inviteeFromLink = useMemo(() => {
    if (!inviteCode) return null;
    return invitees.find((inv) => inv.id === inviteCode) || null;
  }, [inviteCode, invitees]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plusOneName, setPlusOneName] = useState('');
  const [mealSelection, setMealSelection] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [rsvpDisabled, setRsvpDisabled] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    setError('');
    setSuccess('');

    if (!inviteCode) return;
    if (!inviteeFromLink) return;

    setName(inviteeFromLink.name || '');
    setEmail(inviteeFromLink.email || '');
    setPhone(inviteeFromLink.phone || '');
    setPlusOneName(inviteeFromLink.plusOneName || '');
    setStatus(inviteeFromLink.rsvp || null);
  }, [inviteCode, inviteeFromLink]);

  /**
   * Handle RSVP submission with validation
   * @param {string} rsvpStatus - 'accepted' or 'declined'
   */
  const handleRSVP = async (rsvpStatus) => {
    setError('');
    setSuccess('');

    if (!inviteeFromLink) {
      setError('Invitation link not found. Please use the unique RSVP link from your invitation.');
      return;
    }

    setEmailError('');
    setPhoneError('');

    const trimmedEmail = (email || '').trim();
    const trimmedPhone = (phone || '').trim().replace(/-/g, '');

    let hasErrors = false;
    if (trimmedEmail) {
      const emailValidation = validateEmail(trimmedEmail, false);
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.message);
        hasErrors = true;
      }
    }

    if (trimmedPhone) {
      const phoneValidation = validatePhone(trimmedPhone, false);
      if (!phoneValidation.isValid) {
        setPhoneError(phoneValidation.message);
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    // Keep state tidy for downstream comparisons/updates
    setEmail(trimmedEmail);
    setPhone(trimmedPhone);

    const invitee = inviteeFromLink;

    // If partner is explicitly set, treat it as the plus-one name for display/email purposes
    const effectivePlusOneName = (invitee.partner || '').trim() || (plusOneName || '').trim();

    // If plus one is allowed (and not pre-defined as a partner), require a name only when accepting
    if (invitee.allowPlusOne && !invitee.partner && rsvpStatus === 'accepted' && !effectivePlusOneName) {
      setError('Please enter your plus one’s name.');
      return;
    }

    // Check if details were changed and email admin for approval
    const detailsChanged = (trimmedEmail !== (invitee.email || '')) || (trimmedPhone !== (invitee.phone || ''));
    if (detailsChanged) {
      try {
        // Prepare the changes object
        const changes = {
          email: trimmedEmail,
          phone: trimmedPhone
        };
        
        // Generate approval link
        const approvalLink = generateApprovalLink(invitee.id, changes);
        
        await sendEmail({
          to: APP_URLS.ADMIN_EMAIL,
          subject: 'Invitee Details Change Request - Approval Required',
          text: `Invitee ${invitee.name} has requested to update their details during RSVP:\n\nRequested changes:\nEmail: ${trimmedEmail}\nPhone: ${trimmedPhone}\n\nOriginal details:\nEmail: ${invitee.email}\nPhone: ${invitee.phone}\n\nTo approve these changes, click the link below:\n${approvalLink}\n\nNote: Changes will not be applied until you approve them.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Invitee Details Change Request (RSVP)</h2>
              <p>Invitee <strong>${invitee.name}</strong> has requested to update their details during RSVP:</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #2e7d32; margin-top: 0;">Requested Changes:</h3>
                <p><strong>Email:</strong> ${trimmedEmail}</p>
                <p><strong>Phone:</strong> ${trimmedPhone}</p>
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #856404; margin-top: 0;">Original Details:</h3>
                <p><strong>Email:</strong> ${invitee.email}</p>
                <p><strong>Phone:</strong> ${invitee.phone}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${approvalLink}" 
                   style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Approve Changes
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <strong>Note:</strong> Changes will not be applied until you approve them by clicking the link above.
              </p>
            </div>
          `
        });
      } catch (err) {
        console.error('Failed to send admin notification:', err);
      }
    }

    const updateData = { 
      rsvp: rsvpStatus, 
      plusOneName: invitee.allowPlusOne ? (invitee.partner ? undefined : effectivePlusOneName) : undefined,
      mealSelection: rsvpStatus === 'accepted' ? mealSelection : undefined,
      songRequest: rsvpStatus === 'accepted' ? songRequest.trim() : undefined,
    };
    
    // Only update email/phone if they haven't changed (to avoid overriding pending approval)
    if (!detailsChanged) {
      updateData.email = trimmedEmail;
      updateData.phone = trimmedPhone;
    }
    
    updateInvitee(invitee.id, updateData);
    setStatus(rsvpStatus);
    setRsvpDisabled(true);
    // Prepare email details
    const emailDetails = {
      to: invitee.email,
      subject: 'RSVP Confirmation',
      text: `Thank you, ${invitee.name}${invitee.allowPlusOne && effectivePlusOneName ? ' and ' + effectivePlusOneName : ''}, for your RSVP: ${rsvpStatus}`,
      html: `<p>Thank you, <strong>${invitee.name}${invitee.allowPlusOne && effectivePlusOneName ? ' and ' + effectivePlusOneName : ''}</strong>, for your RSVP.</p>
             <p>Your response: <strong>${rsvpStatus === 'accepted' ? 'Attending' : 'Not Attending'}</strong></p>`
    };
    console.log('Sending RSVP email:', emailDetails);
    try {
      await sendEmail(emailDetails);
      setSuccess(rsvpStatus === 'accepted' ? SUCCESS_MESSAGES.RSVP_ACCEPTED : SUCCESS_MESSAGES.RSVP_DECLINED);
      setSnackbar({ open: true, message: SUCCESS_MESSAGES.EMAIL_SENT, severity: 'success' });
    } catch (err) {
      setError(ERROR_MESSAGES.EMAIL_SEND_FAILED);
      setSnackbar({ open: true, message: ERROR_MESSAGES.EMAIL_SEND_FAILED, severity: 'error' });
    }
  };

  return (
    <Box className="home-page-modern rsvp-page">
      <HeaderNavigation />
      <Box className="rsvp-container">
        <Card className="rsvp-card">
          <CardContent className="rsvp-card-content">
          <Typography 
            variant="h4" 
            className="rsvp-title"
          >
            RSVP to the Wedding
          </Typography>

          {!inviteCode || (invitees.length > 0 && !inviteeFromLink) ? (
            <>
              <Typography variant="body1" className="rsvp-verification-complete">
                Please use the unique link from your invitation to RSVP.
              </Typography>
              <Button component={Link} to="/rsvp" variant="outlined" className="rsvp-button" type="button">
                Back to RSVP info
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" className="rsvp-verification-complete">
                You’re RSVPing as <b>{name}</b>
                {inviteeFromLink?.partner ? (
                  <> &amp; <b>{inviteeFromLink.partner}</b></>
                ) : null}
              </Typography>

              <EmailInput
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => setEmail(sanitizeInput(e.target.value))}
                error={emailError}
                className="rsvp-form-field"
              />
              <PhoneInput
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={(e) => setPhone(sanitizeInput(e.target.value))}
                error={phoneError}
                className="rsvp-form-field"
              />

              {/* Plus One field if allowed and not pre-defined as a partner */}
              {inviteeFromLink?.allowPlusOne && !inviteeFromLink?.partner ? (
                <TextInput
                  label="Plus One Name"
                  value={plusOneName}
                  onChange={(e) => setPlusOneName(e.target.value)}
                  onBlur={(e) => setPlusOneName(sanitizeInput(e.target.value))}
                  className="rsvp-form-field"
                />
              ) : null}
            </>
          )}

          {/* Meal selection and song request - only when accepting */}
          {inviteeFromLink && (
            <>
              <SelectInput
                label="Meal Preference"
                value={mealSelection}
                onChange={e => setMealSelection(e.target.value)}
                options={[
                  { value: '', label: 'Select meal preference' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'vegetarian', label: 'Vegetarian' },
                  { value: 'other', label: 'Other (please specify in dietary notes)' },
                ]}
                className="rsvp-form-field"
              />
              <TextAreaInput
                label="Song Request (optional)"
                value={songRequest}
                onChange={e => setSongRequest(e.target.value)}
                onBlur={e => setSongRequest(sanitizeInput(e.target.value))}
                placeholder="A song you would love to hear on the dance floor"
                className="rsvp-form-field"
                rows={2}
              />
            </>
          )}
          
          {/* RSVP buttons (link is the validation) */}
          {inviteeFromLink && (
            <Box className="rsvp-buttons-container">
              <button
                onClick={() => handleRSVP('accepted')}
                disabled={rsvpDisabled}
                className="rsvp-accept-button"
              >
                Accept
              </button>
              <button
                onClick={() => handleRSVP('declined')}
                disabled={rsvpDisabled}
                className="rsvp-decline-button"
              >
                Decline
              </button>
            </Box>
          )}
          
          {error && <ErrorMessage message={error} className="rsvp-alert" />}
          {success && <SuccessMessage message={success} className="rsvp-alert" />}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
              {snackbar.message}
            </MuiAlert>
          </Snackbar>
          
          {status && (
            <Typography 
              variant="body2" 
              className="rsvp-status"
            >
              Your RSVP: <b>{status}</b>
            </Typography>
          )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}