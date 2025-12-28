import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Divider, Alert } from '@mui/material';
import { useInvitees } from '../../contexts/InviteeContext';
import { useEmailTemplates } from '../../contexts/EmailTemplateContext';
import { sendEmail } from '../../services/emailService';
import { trackEmail, EMAIL_EVENTS, generateTrackingPixel } from '../../services/emailTrackingService';
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
  const [recipientStatus] = useState('all');
  const [notification, setNotification] = useState({ show: false, message: '', severity: 'info' });
  const [selectedRecipient] = useState(null);

  // Filter invitees based on status
  const getFilteredInvitees = () => {
    let recipients = invitees;
    if (recipientStatus !== 'all') {
      recipients = invitees.filter(inv => (inv.rsvp || 'pending').toLowerCase() === recipientStatus);
    }
    return recipients.filter(inv => inv.email && isValidEmail(inv.email));
  };

  // Check if email is valid
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
          recipientId: selectedRecipient?.id
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

  // Send email to all filtered recipients
  // This function is defined for future use in the bulk email sending feature
  // eslint-disable-next-line no-unused-vars
  const handleBulkSend = async () => {
    const recipients = getFilteredInvitees();
    
    if (!selectedTemplate) {
      setNotification({
        show: true,
        message: 'Please select a template first',
        severity: 'warning'
      });
      return;
    }
    
    if (recipients.length === 0) {
      setNotification({
        show: true,
        message: 'No valid recipients found',
        severity: 'warning'
      });
      return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (const recipient of recipients) {
      try {
        // Prepare template for this recipient
        const preparedTemplate = prepareTemplate(selectedTemplate.id, {
          guestName: recipient.name,
          guestPartner: recipient.partner,
          email: recipient.email,
          // Add other variables as needed
        });
        
        // Send email
        await sendEmail({
          to: recipient.email,
          subject: preparedTemplate.subject,
          text: preparedTemplate.text,
          html: preparedTemplate.html
        });
        
        // Track success
        successCount++;
      } catch (error) {
        console.error(`Error sending to ${recipient.email}:`, error);
        failCount++;
      }
    }
    
    setNotification({
      show: true,
      message: `Sent ${successCount} emails successfully. ${failCount > 0 ? `Failed: ${failCount}` : ''}`,
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
              <EmailPreview 
                template={selectedTemplate}
                recipientData={selectedRecipient}
                onSend={handleSendEmail}
              />
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