import React, { useMemo, useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Divider, Alert, FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField, Button } from '@mui/material';
import { useInvitees } from '../../contexts/InviteeContext';
import { useEmailTemplates } from '../../contexts/EmailTemplateContext';
import { sendEmail } from '../../services/emailService';
import { trackEmail, EMAIL_EVENTS, generateTrackingPixel } from '../../services/emailTrackingService';
import { APP_URLS } from '../../utils/constants';
import { getEmailTemplateMergeDefaults } from '../../utils/emailTemplateDefaults';
import EmailTemplateManager from '../../components/email/EmailTemplateManager';
import EmailPreview from '../../components/email/EmailPreview';
import EmailStats from '../../components/email/EmailStats';

/**
 * Enhanced Email Tab Component with template support
 * 
 * @returns {JSX.Element} - EmailTab component
 */
const EmailTab = () => {
  const { invitees } = useInvitees();
  const { selectedTemplate, prepareTemplate } = useEmailTemplates();
  const [emailTab, setEmailTab] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '', severity: 'info' });
  const [recipientGroup, setRecipientGroup] = useState('all');
  const [previewInvitee, setPreviewInvitee] = useState(null);
  const [bulkSending, setBulkSending] = useState(false);

  // Check if email is valid
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const recipientGroups = useMemo(() => ([
    { value: 'all', label: 'All invitees (valid email)' },
    { value: 'accepted', label: 'Accepted (valid email)' },
    { value: 'declined', label: 'Declined (valid email)' },
    { value: 'pending', label: 'Pending / No response (valid email)' },
  ]), []);

  const validInvitees = useMemo(
    () => invitees.filter((inv) => inv?.email && isValidEmail(inv.email)),
    [invitees]
  );

  const groupRecipients = useMemo(() => {
    if (recipientGroup === 'all') return validInvitees;
    return validInvitees.filter((inv) => (inv.rsvp || 'pending').toLowerCase() === recipientGroup);
  }, [recipientGroup, validInvitees]);

  const toRecipientData = (inv) => {
    if (!inv) return null;
    const siteUrl = (APP_URLS.SITE_URL || '').replace(/\/+$/, '');
    const invitationLink = inv.id ? `${siteUrl}/invitation/${inv.id}` : '';
    const rsvpLink = inv.id ? `${siteUrl}/rsvp/${inv.id}` : '';
    return {
      ...getEmailTemplateMergeDefaults(),
      guestName: inv.name || '',
      guestPartner: inv.partner || '',
      email: inv.email || '',
      phone: inv.phone || '',
      rsvp: inv.rsvp || 'pending',
      rsvpLink,
      invitationLink,

      name: inv.name || '',
      partner: inv.partner || '',
    };
  };

  const previewRecipientData = useMemo(
    () => toRecipientData(previewInvitee),
    [previewInvitee]
  );

  // Handle sending an email
  const handleSendEmail = async (emailData) => {
    try {
      // Generate tracking ID
      const trackingId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Add tracking pixel and link tracking
      const trackedHtml = emailData.html 
        ? `${emailData.html}${generateTrackingPixel(trackingId)}`
        : emailData.html;
      
      const fullEmailData = {
        ...emailData,
        html: trackedHtml
      };
      
      // Send the email
      await sendEmail(fullEmailData);
      
      // Track the email send event
      trackEmail({
        to: emailData.to,
        subject: emailData.subject,
        templateId: selectedTemplate?.id,
        event: EMAIL_EVENTS.SENT,
        metadata: {
          trackingId,
          recipientId: previewInvitee?.id
        }
      });
      
      setNotification({
        show: true,
        message: `Email sent to ${emailData.to}`,
        severity: 'success'
      });
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Track failure
      trackEmail({
        to: emailData.to,
        subject: emailData.subject,
        templateId: selectedTemplate?.id,
        event: EMAIL_EVENTS.FAILED,
        metadata: {
          error: error.message
        }
      });
      
      setNotification({
        show: true,
        message: `Failed to send email: ${error.message}`,
        severity: 'error'
      });
      
      return false;
    }
  };

  const handleSendToGroup = async () => {
    if (!selectedTemplate) {
      setNotification({
        show: true,
        message: 'Please select a template first',
        severity: 'warning'
      });
      return;
    }

    if (groupRecipients.length === 0) {
      setNotification({
        show: true,
        message: 'No valid recipients found for this group',
        severity: 'warning'
      });
      return;
    }

    setBulkSending(true);
    let successCount = 0;
    let failCount = 0;

    for (const recipient of groupRecipients) {
      try {
        const preparedTemplate = prepareTemplate(selectedTemplate.id, toRecipientData(recipient));
        const trackingId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const trackedHtml = preparedTemplate?.html
          ? `${preparedTemplate.html}${generateTrackingPixel(trackingId)}`
          : preparedTemplate?.html;

        await sendEmail({
          to: recipient.email,
          subject: preparedTemplate.subject,
          text: preparedTemplate.text,
          html: trackedHtml
        });

        trackEmail({
          to: recipient.email,
          subject: preparedTemplate.subject,
          templateId: selectedTemplate?.id,
          event: EMAIL_EVENTS.SENT,
          metadata: {
            trackingId,
            recipientId: recipient.id,
            recipientGroup
          }
        });

        successCount++;
      } catch (error) {
        console.error(`Error sending to ${recipient.email}:`, error);
        failCount++;
        trackEmail({
          to: recipient.email,
          subject: selectedTemplate?.subject,
          templateId: selectedTemplate?.id,
          event: EMAIL_EVENTS.FAILED,
          metadata: {
            error: error.message,
            recipientId: recipient.id,
            recipientGroup
          }
        });
      }
    }

    setBulkSending(false);
    setNotification({
      show: true,
      message: `Group send complete. Sent ${successCount}. Failed ${failCount}.`,
      severity: failCount > 0 ? 'warning' : 'success'
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Tabs 
        value={emailTab} 
        onChange={(_, val) => setEmailTab(val)} 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Templates" />
        <Tab label="Send Email" />
        <Tab label="Statistics" />
      </Tabs>
      
      {notification.show && (
        <Alert 
          severity={notification.severity} 
          sx={{ mb: 3 }}
          onClose={() => setNotification({ ...notification, show: false })}
        >
          {notification.message}
        </Alert>
      )}
      
      {emailTab === 0 && (
        <EmailTemplateManager />
      )}
      
      {emailTab === 1 && (
        <Box>
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Send Email</Typography>
            <Divider sx={{ mb: 3 }} />
            
            {!selectedTemplate ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                Select a template from the Templates tab to continue
              </Alert>
            ) : (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="recipient-group-label">Recipient group</InputLabel>
                    <Select
                      labelId="recipient-group-label"
                      value={recipientGroup}
                      label="Recipient group"
                      onChange={(e) => setRecipientGroup(e.target.value)}
                    >
                      {recipientGroups.map((g) => (
                        <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Autocomplete
                    options={validInvitees}
                    value={previewInvitee}
                    onChange={(_, value) => setPreviewInvitee(value)}
                    getOptionLabel={(option) => `${option.name || 'Unnamed'} — ${option.email || ''}`}
                    renderInput={(params) => (
                      <TextField {...params} size="small" label="Preview as (optional)" />
                    )}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Group recipients: {groupRecipients.length}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleSendToGroup}
                      disabled={bulkSending || groupRecipients.length === 0}
                    >
                      {bulkSending ? 'Sending...' : 'Send to group'}
                    </Button>
                  </Box>
                </Box>

                <EmailPreview 
                  template={selectedTemplate}
                  recipientData={previewRecipientData}
                  onSend={handleSendEmail}
                />
              </>
            )}
          </Paper>
        </Box>
      )}
      
      {emailTab === 2 && (
        <EmailStats />
      )}
    </Box>
  );
};

export default EmailTab;