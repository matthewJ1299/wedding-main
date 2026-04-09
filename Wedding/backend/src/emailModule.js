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
 * Rough plain-text fallback for multipart/alternative when only HTML is provided.
 * @param {string} html
 * @returns {string}
 */
function htmlToPlainText(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .slice(0, 20000);
}

/**
 * Send mail via SMTP, or log only when SMTP is not configured.
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} [options.text]
 * @param {string} [options.html]
 * @returns {Promise}
 */
export function sendEmail({ to, subject, text, html }) {
  const textTrim = text != null ? String(text).trim() : '';
  const htmlTrim = html != null ? String(html).trim() : '';
  const plainBody = textTrim || (htmlTrim ? htmlToPlainText(htmlTrim) : '');

  const mailOptions = {
    from: resolveFromAddress(),
    to,
    subject,
    text: plainBody || ' ',
    html: htmlTrim || undefined,
  };

  console.log('Email details:', {
    to: mailOptions.to,
    subject: mailOptions.subject,
    text: plainBody ? `${plainBody.slice(0, 120)}${plainBody.length > 120 ? '…' : ''}` : '(empty)',
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
