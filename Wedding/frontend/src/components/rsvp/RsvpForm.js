import React, { useEffect, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import '../../styles/RSVPPage.css';

import { useInvitees } from '../../contexts/InviteeContext';
import { sendEmail } from '../../services/emailService';
import { generateApprovalLink } from '../../services/approvalService';

import Typography from '../ui/Typography';
import Button from '../ui/Button';

import { sanitizeInput, validateEmail, validatePhone } from '../../utils/validation';
import { APP_URLS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../utils/constants';
import {
  EmailInput,
  PhoneInput,
  TextAreaInput,
  SelectInput,
  ErrorMessage,
  SuccessMessage,
  TextInput,
} from '../common';

/**
 * RSVP form content (shared between page and modal).
 */
export default function RsvpForm({ inviteCode, onRequestClose }) {
  const { invitees, updateInvitee } = useInvitees();

  const inviteeFromLink = useMemo(() => {
    if (!inviteCode) return null;
    return invitees.find((inv) => inv.id === inviteCode) || null;
  }, [inviteCode, invitees]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partnerName, setPartnerName] = useState('');
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
    setPartnerName(inviteeFromLink.partner || '');
    setStatus(inviteeFromLink.rsvp || null);
  }, [inviteCode, inviteeFromLink]);

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

    setEmail(trimmedEmail);
    setPhone(trimmedPhone);

    const invitee = inviteeFromLink;
    const effectivePartnerName = (partnerName || '').trim() || (invitee.partner || '').trim();

    if (invitee.allowPlusOne && !(invitee.partner || '').trim() && rsvpStatus === 'accepted' && !effectivePartnerName) {
      setError('Please enter your partner/plus one’s name.');
      return;
    }

    const detailsChanged =
      trimmedEmail !== (invitee.email || '') || trimmedPhone !== (invitee.phone || '');

    if (detailsChanged) {
      try {
        const changes = {
          email: trimmedEmail,
          phone: trimmedPhone,
        };

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
          `,
        });
      } catch (err) {
        console.error('Failed to send admin notification:', err);
      }
    }

    const updateData = {
      rsvp: rsvpStatus,
      // Partner and plus-one are the same person: store their name in `partner`.
      partner:
        invitee.allowPlusOne && !(invitee.partner || '').trim()
          ? effectivePartnerName
          : undefined,
      mealSelection: rsvpStatus === 'accepted' ? mealSelection : undefined,
      songRequest: rsvpStatus === 'accepted' ? songRequest.trim() : undefined,
    };

    if (!detailsChanged) {
      updateData.email = trimmedEmail;
      updateData.phone = trimmedPhone;
    }

    const linkedPartner = invitees.find((candidate) => {
      if (!candidate || candidate.id === invitee.id) return false;
      const inviteePartnerName = (invitee.partner || '').trim().toLowerCase();
      const candidatePartnerName = (candidate.partner || '').trim().toLowerCase();
      const inviteeName = (invitee.name || '').trim().toLowerCase();
      const candidateName = (candidate.name || '').trim().toLowerCase();

      return (
        (inviteePartnerName && inviteePartnerName === candidateName) ||
        (candidatePartnerName && candidatePartnerName === inviteeName)
      );
    });

    await updateInvitee(invitee.id, updateData);
    if (linkedPartner) {
      await updateInvitee(linkedPartner.id, { rsvp: rsvpStatus });
    }
    setStatus(rsvpStatus);
    setRsvpDisabled(true);

    const emailDetails = {
      to: invitee.email,
      subject: 'RSVP Confirmation',
      text: `Thank you, ${invitee.name}${
        invitee.allowPlusOne && effectivePartnerName ? ' and ' + effectivePartnerName : ''
      }, for your RSVP: ${rsvpStatus}`,
      html: `<p>Thank you, <strong>${invitee.name}${
        invitee.allowPlusOne && effectivePartnerName ? ' and ' + effectivePartnerName : ''
      }</strong>, for your RSVP.</p>
             <p>Your response: <strong>${rsvpStatus === 'accepted' ? 'Attending' : 'Not Attending'}</strong></p>`,
    };

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
    <Card className="rsvp-card">
      <CardContent className="rsvp-card-content">
        <Typography variant="h4" className="rsvp-title">
          RSVP to the Wedding
        </Typography>

        {!inviteCode || (invitees.length > 0 && !inviteeFromLink) ? (
          <>
            <Typography variant="body1" className="rsvp-verification-complete">
              Please use the unique link from your invitation to RSVP.
            </Typography>
            {onRequestClose ? (
              <Button variant="outlined" className="rsvp-button" type="button" onClick={onRequestClose}>
                Close
              </Button>
            ) : null}
          </>
        ) : (
          <>
            <Typography variant="body1" className="rsvp-verification-complete">
              You’re RSVPing as <b>{name}</b>
              {inviteeFromLink?.partner ? (
                <>
                  {' '}
                  &amp; <b>{inviteeFromLink.partner}</b>
                </>
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

            {inviteeFromLink?.allowPlusOne && !inviteeFromLink?.partner ? (
              <TextInput
                label="Partner / Plus One Name"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                onBlur={(e) => setPartnerName(sanitizeInput(e.target.value))}
                className="rsvp-form-field"
              />
            ) : null}
          </>
        )}

        {inviteeFromLink ? (
          <>
            <SelectInput
              label="Meal Preference"
              value={mealSelection}
              onChange={(e) => setMealSelection(e.target.value)}
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
              onChange={(e) => setSongRequest(e.target.value)}
              onBlur={(e) => setSongRequest(sanitizeInput(e.target.value))}
              placeholder="A song you would love to hear on the dance floor"
              className="rsvp-form-field"
              rows={2}
            />
          </>
        ) : null}

        {inviteeFromLink ? (
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
        ) : null}

        {error ? <ErrorMessage message={error} className="rsvp-alert" /> : null}
        {success ? <SuccessMessage message={success} className="rsvp-alert" /> : null}

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

        {status ? (
          <Typography variant="body2" className="rsvp-status">
            Your RSVP: <b>{status}</b>
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}

