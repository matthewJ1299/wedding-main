import nodemailer from 'nodemailer';

function parseSmtpPort() {
  const raw = process.env.SMTP_PORT || '587';
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : 587;
}

function isSmtpSecure() {
  return String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
}

function smtpAuthUser() {
  return process.env.SMTP_USER || process.env.EMAIL_USER;
}

function smtpAuthPass() {
  return process.env.SMTP_PASS || process.env.EMAIL_PASS;
}

function hasSmtpTransportConfig() {
  if (!process.env.SMTP_HOST) {
    return false;
  }
  const user = smtpAuthUser();
  if (user) {
    return Boolean(smtpAuthPass());
  }
  return true;
}

const hasEmailCredentials = hasSmtpTransportConfig();

let transporter = null;

if (hasEmailCredentials) {
  const authUser = smtpAuthUser();
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseSmtpPort(),
    secure: isSmtpSecure(),
    auth: authUser
      ? { user: authUser, pass: smtpAuthPass() || '' }
      : undefined,
  });
} else {
  console.warn(
    'Email SMTP not configured (set SMTP_HOST and, if required, SMTP_USER / SMTP_PASS). Emails will be logged only.'
  );
}

function resolveFromAddress() {
  return (
    process.env.SMTP_FROM ||
    smtpAuthUser() ||
    process.env.ADMIN_EMAIL ||
    'noreply@localhost'
  );
}

/**
 * Send mail via SMTP, or log only when SMTP is not configured.
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} [options.html]
 * @returns {Promise}
 */
export function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: resolveFromAddress(),
    to,
    subject,
    text,
    html,
  };

  console.log('Email details:', {
    to: mailOptions.to,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html ? 'HTML content present' : 'No HTML content',
    timestamp: new Date().toISOString(),
    smtpConfigured: hasEmailCredentials,
  });

  if (!hasEmailCredentials || !transporter) {
    console.log('Email not sent (SMTP not configured):', mailOptions);
    return Promise.resolve({ messageId: 'dev-' + Date.now() });
  }

  return transporter.sendMail(mailOptions);
}
