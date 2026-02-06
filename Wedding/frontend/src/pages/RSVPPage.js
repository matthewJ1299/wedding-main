import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useParams } from 'react-router-dom';
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
import { validateInviteeForm, sanitizeInput, validateEmail, validatePhone } from '../utils/validation';
import { APP_URLS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';
import { TextInput, EmailInput, PhoneInput, TextAreaInput, SelectInput, ErrorMessage, SuccessMessage } from '../components/common';

/**
 * RSVP page component handling wedding attendance confirmation
 */
export default function RSVPPage() {
  const { inviteCode } = useParams();
  const { invitees, updateInvitee } = useInvitees();
  
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
  const [showDetailsVerification, setShowDetailsVerification] = useState(false);
  const [showRSVPButtons, setShowRSVPButtons] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Remove duplicate validation function - now using shared validation utilities

  /**
   * Handle name verification and show details form
   */
  const handleNameVerification = () => {
    setError('');
    
    const validation = validateInviteeForm({ name }, { emailRequired: false, phoneRequired: false });
    if (!validation.isValid) {
      setError(validation.errors.name);
      return;
    }
    
    const invitee = invitees.find(
      (inv) => inv.id === inviteCode && inv.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    
    if (!invitee) {
      setError('Name and invitation link do not match.');
      return;
    }
    
    // Pre-populate email and phone from invitee data
    setEmail(invitee.email || '');
    setPhone(invitee.phone || '');
    setShowDetailsVerification(true);
  };

  /**
   * Handle details verification and proceed to RSVP
   */
  const handleDetailsVerification = () => {
    setEmailError('');
    setPhoneError('');
    
    // Get trimmed values for validation (empty string if not provided)
    const trimmedEmail = (email || '').trim();
    // Remove dashes from phone number before validation
    const trimmedPhone = (phone || '').trim().replace(/-/g, '');
    
    // Validate email and phone separately (name is already verified)
    // Only validate if they have values (not required fields)
    let hasErrors = false;
    let emailErr = '';
    let phoneErr = '';
    
    // Validate email only if provided
    if (trimmedEmail) {
      const emailValidation = validateEmail(trimmedEmail, false);
      if (!emailValidation.isValid) {
        emailErr = emailValidation.message;
        hasErrors = true;
      }
    }
    
    // Validate phone only if provided
    if (trimmedPhone) {
      const phoneValidation = validatePhone(trimmedPhone, false);
      if (!phoneValidation.isValid) {
        phoneErr = phoneValidation.message;
        hasErrors = true;
      }
    }
    
    // Set errors if any
    if (emailErr) setEmailError(emailErr);
    if (phoneErr) setPhoneError(phoneErr);
    
    // If there are errors, stop here
    if (hasErrors) {
      return;
    }
    // Update state with trimmed values and move to next step
    // React batches these state updates automatically
    setEmail(trimmedEmail);
    setPhone(trimmedPhone);
    setIsVerified(true);
    setShowDetailsVerification(false);
    setShowRSVPButtons(true);
  };

  /**
   * Handle RSVP submission with validation
   * @param {string} rsvpStatus - 'accepted' or 'declined'
   */
  const handleRSVP = async (rsvpStatus) => {
    setError('');
    setSuccess('');
    // Validate input
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    // Find invitee by id and name (case-insensitive)
    const invitee = invitees.find(
      (inv) => inv.id === inviteCode && inv.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (!invitee) {
      setError('Name and invitation link do not match.');
      return;
    }
    // If plus one is allowed, validate plus one's name if RSVP is accepted
    if (invitee.allowPlusOne && rsvpStatus === 'accepted' && !plusOneName.trim()) {
      setError('Please enter your plus one’s name.');
      return;
    }
    // Check if details were changed and email admin for approval
    const detailsChanged = (email !== invitee.email) || (phone !== invitee.phone);
    if (detailsChanged) {
      try {
        // Prepare the changes object
        const changes = {
          email: email.trim(),
          phone: phone.trim()
        };
        
        // Generate approval link
        const approvalLink = generateApprovalLink(invitee.id, changes);
        
        await sendEmail({
          to: APP_URLS.ADMIN_EMAIL,
          subject: 'Invitee Details Change Request - Approval Required',
          text: `Invitee ${invitee.name} has requested to update their details during RSVP:\n\nRequested changes:\nEmail: ${email}\nPhone: ${phone}\n\nOriginal details:\nEmail: ${invitee.email}\nPhone: ${invitee.phone}\n\nTo approve these changes, click the link below:\n${approvalLink}\n\nNote: Changes will not be applied until you approve them.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Invitee Details Change Request (RSVP)</h2>
              <p>Invitee <strong>${invitee.name}</strong> has requested to update their details during RSVP:</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #2e7d32; margin-top: 0;">Requested Changes:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
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
      plusOneName: invitee.allowPlusOne ? plusOneName : undefined,
      mealSelection: rsvpStatus === 'accepted' ? mealSelection : undefined,
      songRequest: rsvpStatus === 'accepted' ? songRequest.trim() : undefined,
    };
    
    // Only update email/phone if they haven't changed (to avoid overriding pending approval)
    if (!detailsChanged) {
      updateData.email = email.trim();
      updateData.phone = phone.trim();
    }
    
    updateInvitee(invitee.id, updateData);
    setStatus(rsvpStatus);
    setRsvpDisabled(true);
    // Prepare email details
    const emailDetails = {
      to: invitee.email,
      subject: 'RSVP Confirmation',
      text: `Thank you, ${invitee.name}${invitee.allowPlusOne && plusOneName ? ' and ' + plusOneName : ''}, for your RSVP: ${rsvpStatus}`,
      html: `<p>Thank you, <strong>${invitee.name}${invitee.allowPlusOne && plusOneName ? ' and ' + plusOneName : ''}</strong>, for your RSVP.</p>
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
          
          {!showDetailsVerification && !isVerified ? (
            <>
              <TextInput
                label="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={e => setName(sanitizeInput(e.target.value))}
                className="rsvp-form-field"
                required
              />
              <Button
                variant="contained"
                onClick={handleNameVerification}
                className="rsvp-button"
              >
                Verify Name
              </Button>
            </>
          ) : showDetailsVerification ? (
            <>
              <EmailInput
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={e => setEmail(sanitizeInput(e.target.value))}
                error={emailError}
                className="rsvp-form-field"
              />
              <PhoneInput
                label="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onBlur={e => setPhone(sanitizeInput(e.target.value))}
                error={phoneError}
                className="rsvp-form-field"
              />
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.preventDefault();
                  handleDetailsVerification();
                }}
                className="rsvp-button"
                type="button"
              >
                Verify Details
              </Button>
            </>
          ) : isVerified && (
            <Typography 
              variant="body1" 
              className="rsvp-verification-complete"
            >
              ✓ Verification Complete
            </Typography>
          )}
          {/* Plus One field if allowed - only show after verification */}
          {isVerified && (() => {
            const invitee = invitees.find(
              (inv) => inv.id === inviteCode && inv.name.trim().toLowerCase() === name.trim().toLowerCase()
            );
            if (invitee && invitee.allowPlusOne) {
              return (
                <TextInput
                  label="Plus One Name"
                  value={plusOneName}
                  onChange={e => setPlusOneName(e.target.value)}
                  onBlur={e => setPlusOneName(sanitizeInput(e.target.value))}
                  className="rsvp-form-field"
                  required
                />
              );
            }
            return null;
          })()}

          {/* Meal selection and song request - only when accepting */}
          {showRSVPButtons && (
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
          
          {/* Only show RSVP buttons after full verification */}
          {showRSVPButtons && (
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