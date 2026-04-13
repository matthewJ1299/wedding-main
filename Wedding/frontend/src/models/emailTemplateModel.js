/**
 * Email Template model definition
 * 
 * @typedef {Object} EmailTemplate
 * @property {string} id - Unique identifier for the template
 * @property {string} name - Display name of the template
 * @property {string} subject - Subject line for the email
 * @property {string} text - Plain text version of the template
 * @property {string} html - HTML version of the template
 * @property {Object} variables - Variables that can be used in the template
 */

/**
 * Available template variables
 */
export const TEMPLATE_VARIABLES = {
  GUEST_NAME: '{guestName}',
  GUEST_PARTNER: '{guestPartner}',
  WEDDING_DATE: '{weddingDate}',
  WEDDING_TIME: '{weddingTime}',
  WEDDING_LOCATION: '{weddingLocation}',
  RSVP_LINK: '{rsvpLink}',
  EVENT_ADDRESS: '{eventAddress}',
  WEBSITE_LINK: '{websiteLink}',
  RSVP_DEADLINE: '{rsvpDeadline}',
};

/**
 * Default email templates
 */
export const DEFAULT_TEMPLATES = [
  {
    id: 'save-the-date',
    name: 'Save the Date',
    subject: 'Save the Date - Wedding Invitation',
    text: `Dear ${TEMPLATE_VARIABLES.GUEST_NAME},

We're excited to announce that we're getting married!

Please save the date: ${TEMPLATE_VARIABLES.WEDDING_DATE} at ${TEMPLATE_VARIABLES.WEDDING_LOCATION}.

A formal invitation will follow. We can't wait to celebrate with you!

RSVP: ${TEMPLATE_VARIABLES.RSVP_LINK}

Warm regards,
The Happy Couple`,
    html: `<div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #043A14;">
  <h1 style="text-align: center; color: #043A14;">Save the Date</h1>
  <p style="font-size: 18px;">Dear ${TEMPLATE_VARIABLES.GUEST_NAME},</p>
  <p style="font-size: 18px;">We're excited to announce that we're getting married!</p>
  <h2 style="text-align: center;">Please save the date:</h2>
  <h3 style="text-align: center;">${TEMPLATE_VARIABLES.WEDDING_DATE}</h3>
  <h3 style="text-align: center;">${TEMPLATE_VARIABLES.WEDDING_LOCATION}</h3>
  <p style="font-size: 18px;">A formal invitation will follow. We can't wait to celebrate with you!</p>
  <p style="text-align: center; margin-top: 30px;">
    <a href="${TEMPLATE_VARIABLES.RSVP_LINK}" style="background-color: #043A14; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">RSVP Here</a>
  </p>
  <p style="font-size: 18px; text-align: center; margin-top: 30px;">Warm regards,<br/>The Happy Couple</p>
</div>`,
    variables: ['guestName', 'weddingDate', 'weddingLocation', 'rsvpLink']
  },
  {
    id: 'formal-invitation',
    name: 'Formal Invitation',
    subject: 'Wedding Invitation',
    text: `Dear ${TEMPLATE_VARIABLES.GUEST_NAME},

We are delighted to invite you to celebrate our marriage on ${TEMPLATE_VARIABLES.WEDDING_DATE} at ${TEMPLATE_VARIABLES.WEDDING_LOCATION}.

Address: ${TEMPLATE_VARIABLES.EVENT_ADDRESS}

${TEMPLATE_VARIABLES.GUEST_PARTNER ? 'You and ' + TEMPLATE_VARIABLES.GUEST_PARTNER + ' are' : 'You are'} cordially invited to join us for this special occasion.

Please RSVP by visiting: ${TEMPLATE_VARIABLES.RSVP_LINK}

We look forward to celebrating with you!

With love,
The Happy Couple`,
    html: `<div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #043A14; border: 1px solid #d4d4d4; border-radius: 5px;">
  <h1 style="text-align: center; color: #043A14;">Wedding Invitation</h1>
  <p style="font-size: 18px;">Dear ${TEMPLATE_VARIABLES.GUEST_NAME},</p>
  <p style="font-size: 18px; text-align: center; font-style: italic;">We are delighted to invite you to celebrate our marriage</p>
  <h2 style="text-align: center;">${TEMPLATE_VARIABLES.WEDDING_DATE}</h2>
  <h3 style="text-align: center;">${TEMPLATE_VARIABLES.WEDDING_LOCATION}</h3>
  <p style="text-align: center;">${TEMPLATE_VARIABLES.EVENT_ADDRESS}</p>
  <p style="font-size: 18px; text-align: center; margin-top: 20px;">${TEMPLATE_VARIABLES.GUEST_PARTNER ? 'You and ' + TEMPLATE_VARIABLES.GUEST_PARTNER + ' are' : 'You are'} cordially invited to join us for this special occasion.</p>
  <p style="text-align: center; margin-top: 30px;">
    <a href="${TEMPLATE_VARIABLES.RSVP_LINK}" style="background-color: #043A14; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">RSVP Here</a>
  </p>
  <p style="font-size: 18px; text-align: center; margin-top: 30px;">We look forward to celebrating with you!</p>
  <p style="font-size: 18px; text-align: center;">With love,<br/>The Happy Couple</p>
</div>`,
    variables: ['guestName', 'guestPartner', 'weddingDate', 'weddingLocation', 'eventAddress', 'rsvpLink']
  },
  {
    id: 'rsvp-confirmation',
    name: 'RSVP Confirmation',
    subject: 'Your RSVP Confirmation',
    text: `Dear ${TEMPLATE_VARIABLES.GUEST_NAME},

Thank you for your RSVP to our wedding. We ${TEMPLATE_VARIABLES.GUEST_PARTNER ? 'are excited to have you and ' + TEMPLATE_VARIABLES.GUEST_PARTNER : 'are excited to have you'} join us on our special day.

Date: ${TEMPLATE_VARIABLES.WEDDING_DATE}
Location: ${TEMPLATE_VARIABLES.WEDDING_LOCATION}

For more information, please visit our wedding website: ${TEMPLATE_VARIABLES.WEBSITE_LINK}

We look forward to celebrating with you!

With love,
The Happy Couple`,
    html: `<div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #043A14;">
  <h1 style="text-align: center; color: #043A14;">RSVP Confirmation</h1>
  <p style="font-size: 18px;">Dear ${TEMPLATE_VARIABLES.GUEST_NAME},</p>
  <p style="font-size: 18px;">Thank you for your RSVP to our wedding. We ${TEMPLATE_VARIABLES.GUEST_PARTNER ? 'are excited to have you and ' + TEMPLATE_VARIABLES.GUEST_PARTNER : 'are excited to have you'} join us on our special day.</p>
  <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f8f8f8;">
    <p><strong>Date:</strong> ${TEMPLATE_VARIABLES.WEDDING_DATE}</p>
    <p><strong>Location:</strong> ${TEMPLATE_VARIABLES.WEDDING_LOCATION}</p>
  </div>
  <p style="font-size: 18px;">For more information, please visit our wedding website:</p>
  <p style="text-align: center; margin-top: 20px;">
    <a href="${TEMPLATE_VARIABLES.WEBSITE_LINK}" style="background-color: #043A14; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Wedding Website</a>
  </p>
  <p style="font-size: 18px; text-align: center; margin-top: 30px;">We look forward to celebrating with you!</p>
  <p style="font-size: 18px; text-align: center;">With love,<br/>The Happy Couple</p>
</div>`,
    variables: ['guestName', 'guestPartner', 'weddingDate', 'weddingLocation', 'websiteLink']
  },
  {
    id: 'thank-you',
    name: 'Thank You',
    subject: 'Thank You for Sharing Our Special Day',
    text: `Dear ${TEMPLATE_VARIABLES.GUEST_NAME},

Thank you so much for being part of our wedding day. Your presence made our celebration even more special.

We are grateful for your love, support, and the wonderful memories we created together.

With heartfelt thanks,
The Happy Couple`,
    html: `<div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #043A14;">
  <h1 style="text-align: center; color: #043A14;">Thank You</h1>
  <p style="font-size: 18px;">Dear ${TEMPLATE_VARIABLES.GUEST_NAME},</p>
  <p style="font-size: 18px; text-align: center;">Thank you so much for being part of our wedding day.</p>
  <p style="font-size: 18px; text-align: center;">Your presence made our celebration even more special.</p>
  <p style="font-size: 18px; text-align: center; margin-top: 20px;">We are grateful for your love, support, and the wonderful memories we created together.</p>
  <p style="font-size: 18px; text-align: center; margin-top: 30px;">With heartfelt thanks,<br/>The Happy Couple</p>
</div>`,
    variables: ['guestName']
  }
];

/**
 * Populate a template with variable values
 * 
 * @param {string} content - Template content (HTML or text)
 * @param {Object} values - Values for template variables
 * @returns {string} - Populated template content
 */
export const populateTemplate = (content, values) => {
  if (!content) return content;
  if (!values) return content;

  const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let populatedContent = content;

  Object.keys(values).forEach((key) => {
    const value = values[key] ?? '';
    const safeKey = escapeRegExp(key);

    // Supports both `{var}` (legacy) and `{{var}}` / `{{ var }}` placeholder styles
    populatedContent = populatedContent
      // IMPORTANT: replace `{{var}}` first; otherwise `{var}` replacement inside will leave `{value}`
      .replace(new RegExp(`\\{\\{\\s*${safeKey}\\s*\\}\\}`, 'g'), String(value))
      .replace(new RegExp(`\\{${safeKey}\\}`, 'g'), String(value));
  });

  return populatedContent;
};

/**
 * Extract template variables from a template string
 * 
 * @param {string} content - Template content
 * @returns {Array<string>} - Array of variable names without brackets
 */
export const extractTemplateVariables = (content) => {
  const matches = content.match(/\{([^}]+)\}/g) || [];
  return [...new Set(matches.map(match => match.replace(/[{}]/g, '')))];
};