import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import '../../styles/RSVPPage.css';

import { useInvitees } from '../../contexts/InviteeContext';
import { useEmailTemplates } from '../../contexts/EmailTemplateContext';
import { sendEmail } from '../../services/emailService';
import { generateApprovalLink } from '../../services/approvalService';

import Typography from '../ui/Typography';
import Button from '../ui/Button';

import { sanitizeInput, validateEmail, validatePhone } from '../../utils/validation';
import {
  APP_URLS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  RSVP_THANK_YOU_TEMPLATE_IDS,
} from '../../utils/constants';
import { getGuestEmailMergeFields } from '../../utils/emailTemplateDefaults';
import { deriveAggregateRsvp } from '../../utils/rsvpAggregate';
import {
  EmailInput,
  PhoneInput,
  TextAreaInput,
  ErrorMessage,
  SuccessMessage,
  TextInput,
} from '../common';

const RSVP_NAV_DELAY_MS = 1400;

/**
 * RSVP form content (shared between page and modal).
 */
export default function RsvpForm({ inviteCode, onRequestClose }) {
  const navigate = useNavigate();
  const { invitees, updateInvitee } = useInvitees();
  const { prepareTemplate } = useEmailTemplates();

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
  const [messageToCouple, setMessageToCouple] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rsvpDisabled, setRsvpDisabled] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [attendPrimary, setAttendPrimary] = useState(false);
  const [attendPartner, setAttendPartner] = useState(false);

  const secondGuestName = useMemo(() => {
    if (!inviteeFromLink) return '';
    const fromDb = (inviteeFromLink.partner || '').trim();
    if (fromDb) return fromDb;
    if (inviteeFromLink.allowPlusOne) return (partnerName || '').trim();
    return '';
  }, [inviteeFromLink, partnerName]);

  const hasSecondGuest = Boolean(secondGuestName);

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
    setMealSelection(inviteeFromLink.mealSelection || '');
    setSongRequest(inviteeFromLink.songRequest || '');
    setMessageToCouple(inviteeFromLink.messageToCouple || '');

    const legacy = inviteeFromLink.rsvp;
    const rp = inviteeFromLink.rsvpPrimary;
    const rq = inviteeFromLink.rsvpPartner;
    const partnerKnown = (inviteeFromLink.partner || '').trim();

    const setPrimaryFromStored = () => {
      if (rp === 'accepted' || rp === 'declined') {
        setAttendPrimary(rp === 'accepted');
      } else if (legacy === 'accepted' || legacy === 'declined') {
        setAttendPrimary(legacy === 'accepted');
      } else {
        setAttendPrimary(false);
      }
    };

    if (!partnerKnown && !inviteeFromLink.allowPlusOne) {
      setPrimaryFromStored();
      setAttendPartner(false);
      return;
    }

    if (!partnerKnown && inviteeFromLink.allowPlusOne) {
      setPrimaryFromStored();
      setAttendPartner(false);
      return;
    }

    setPrimaryFromStored();

    if (rq === 'accepted' || rq === 'declined') {
      setAttendPartner(rq === 'accepted');
    } else if (legacy === 'accepted' || legacy === 'declined') {
      setAttendPartner(legacy === 'accepted');
    } else {
      setAttendPartner(false);
    }
  }, [inviteCode, inviteeFromLink]);

  const scheduleNavigateHome = useCallback(() => {
    window.setTimeout(() => {
      if (onRequestClose) onRequestClose();
      navigate('/', { replace: true });
    }, RSVP_NAV_DELAY_MS);
  }, [navigate, onRequestClose]);

  const handleSubmitRsvp = async () => {
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

    if (invitee.allowPlusOne && !(invitee.partner || '').trim() && attendPartner && !effectivePartnerName) {
      setError('Please enter your partner/plus one’s name.');
      return;
    }

    const effectiveSecond = hasSecondGuest ? secondGuestName : '';
    const nextPrimary = attendPrimary ? 'accepted' : 'declined';
    const nextPartner = effectiveSecond ? (attendPartner ? 'accepted' : 'declined') : null;
    const aggregate = deriveAggregateRsvp(nextPrimary, nextPartner);

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

    const anyAttending = aggregate === 'accepted' || aggregate === 'mixed';

    const updateData = {
      rsvp: aggregate,
      rsvpPrimary: nextPrimary,
      rsvpPartner: nextPartner,
      partner:
        invitee.allowPlusOne && !(invitee.partner || '').trim()
          ? effectivePartnerName
          : undefined,
      mealSelection: anyAttending ? (mealSelection || '').trim() || null : null,
      songRequest: anyAttending ? (songRequest || '').trim() || null : null,
      messageToCouple: (messageToCouple || '').trim() || null,
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

    try {
      await updateInvitee(invitee.id, updateData);
      if (linkedPartner) {
        await updateInvitee(linkedPartner.id, {
          rsvp: aggregate,
          rsvpPrimary: nextPartner,
          rsvpPartner: nextPrimary,
        });
      }
    } catch (err) {
      console.error(err);
      setError(ERROR_MESSAGES.SERVER_ERROR);
      return;
    }

    setStatus(aggregate);
    setRsvpDisabled(true);

    const partnerForEmail =
      invitee.allowPlusOne && !(invitee.partner || '').trim() && anyAttending
        ? effectivePartnerName
        : invitee.partner || '';
    const mergeInvitee = { ...invitee, partner: partnerForEmail, rsvp: aggregate };
    const guestMerge = getGuestEmailMergeFields(mergeInvitee);
    const templateId = anyAttending
      ? RSVP_THANK_YOU_TEMPLATE_IDS.ATTENDING
      : RSVP_THANK_YOU_TEMPLATE_IDS.DECLINED;
    const prepared = prepareTemplate(templateId, guestMerge);

    const emailDetails =
      prepared && (prepared.html || prepared.text)
        ? {
            to: invitee.email,
            subject: prepared.subject,
            text: prepared.text || '',
            html: prepared.html || '',
          }
        : {
            to: invitee.email,
            subject: 'RSVP Confirmation',
            text: `Thank you, ${invitee.name}${
              effectiveSecond ? ' and ' + effectiveSecond : ''
            }, for your RSVP.`,
            html: `<p>Thank you, <strong>${invitee.name}${
              effectiveSecond ? ' and ' + effectiveSecond : ''
            }</strong>, for your RSVP.</p>
             <p>Your response: <strong>${
               aggregate === 'mixed'
                 ? 'Mixed (one attending, one not)'
                 : aggregate === 'accepted'
                   ? 'Attending'
                   : 'Not attending'
             }</strong></p>`,
          };

    try {
      await sendEmail(emailDetails);
      let rsvpMsg = SUCCESS_MESSAGES.RSVP_DECLINED;
      if (aggregate === 'accepted') rsvpMsg = SUCCESS_MESSAGES.RSVP_ACCEPTED;
      else if (aggregate === 'mixed') rsvpMsg = SUCCESS_MESSAGES.RSVP_MIXED;
      setSuccess(`${rsvpMsg} ${SUCCESS_MESSAGES.EMAIL_SENT}`);
    } catch (err) {
      let rsvpMsg = SUCCESS_MESSAGES.RSVP_DECLINED;
      if (aggregate === 'accepted') rsvpMsg = SUCCESS_MESSAGES.RSVP_ACCEPTED;
      else if (aggregate === 'mixed') rsvpMsg = SUCCESS_MESSAGES.RSVP_MIXED;
      setSuccess(`${rsvpMsg} ${ERROR_MESSAGES.EMAIL_SEND_FAILED}`);
    }

    scheduleNavigateHome();
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
            <Box className="rsvp-guest-checkboxes" sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontFamily: 'Cormorant Garamond, serif', color: '#444' }}>
                Who will attend?
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={attendPrimary}
                    onChange={(e) => setAttendPrimary(e.target.checked)}
                    disabled={rsvpDisabled}
                    color="success"
                  />
                }
                label={`${(name || inviteeFromLink.name || 'Guest').trim()} will attend`}
              />
              {hasSecondGuest ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={attendPartner}
                      onChange={(e) => setAttendPartner(e.target.checked)}
                      disabled={rsvpDisabled}
                      color="success"
                    />
                  }
                  label={`${secondGuestName} will attend`}
                />
              ) : null}
            </Box>

            <TextAreaInput
              label="Dietary requirements and allergies (optional)"
              value={mealSelection}
              onChange={(e) => setMealSelection(e.target.value)}
              onBlur={(e) => setMealSelection(sanitizeInput(e.target.value))}
              placeholder="For example vegetarian, nut allergy, or other requirements"
              className="rsvp-form-field"
              rows={3}
            />
            <TextAreaInput
              label="Song request (optional)"
              value={songRequest}
              onChange={(e) => setSongRequest(e.target.value)}
              onBlur={(e) => setSongRequest(sanitizeInput(e.target.value))}
              placeholder="A song you would love to hear on the dance floor"
              className="rsvp-form-field"
              rows={2}
            />
            <TextAreaInput
              label="Send a message to the happy couple (optional)"
              value={messageToCouple}
              onChange={(e) => setMessageToCouple(e.target.value)}
              onBlur={(e) => setMessageToCouple(sanitizeInput(e.target.value))}
              placeholder="A note, congratulations, or anything you would like to share"
              className="rsvp-form-field"
              rows={3}
            />
          </>
        ) : null}

        {inviteeFromLink ? (
          <Box className="rsvp-buttons-container">
            <button
              type="button"
              onClick={handleSubmitRsvp}
              disabled={rsvpDisabled}
              className="rsvp-submit-rsvp-button"
            >
              Submit RSVP
            </button>
          </Box>
        ) : null}

        {error ? <ErrorMessage message={error} className="rsvp-alert" /> : null}
        {success ? <SuccessMessage message={success} className="rsvp-alert" /> : null}

        {status ? (
          <Typography variant="body2" className="rsvp-status">
            Your RSVP: <b>{status}</b>
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
