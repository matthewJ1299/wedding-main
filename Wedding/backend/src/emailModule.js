
import nodemailer from 'nodemailer';

// Check if email credentials are available
const hasEmailCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASS;

let transporter = null;

if (hasEmailCredentials) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  console.warn('⚠️ Email credentials not configured. Emails will be logged to console only.');
}

/**
 * Send an email using Gmail SMTP or log to console in development
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - HTML body (optional)
 * @returns {Promise}
 */
export function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@wedding.local',
    to,
    subject,
    text,
    html
  };

  // Log email details
  console.log('📧 Email Details:', {
    to: mailOptions.to,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html ? 'HTML content present' : 'No HTML content',
    timestamp: new Date().toISOString(),
    hasCredentials: hasEmailCredentials
  });

  if (!hasEmailCredentials) {
    console.log('📧 Email would be sent (credentials not configured):', mailOptions);
    // Return a resolved promise to simulate successful email sending
    return Promise.resolve({ messageId: 'dev-' + Date.now() });
  }

  return transporter.sendMail(mailOptions);
}
