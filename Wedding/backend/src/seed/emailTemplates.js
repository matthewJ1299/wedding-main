import { GENERATED_EMAIL_BODIES } from './generatedEmailBodies.js';

const { invite, rsvpYes, rsvpNo } = GENERATED_EMAIL_BODIES;

/**
 * Default rows only (no legacy welcome/reminder). Primary CTA uses `{rsvpLink}`.
 * Coolify: set REPLACE_EMAIL_TEMPLATES=true so docker-entrypoint replaces all DB rows on deploy.
 */
export const DEFAULT_EMAIL_TEMPLATES = [
  {
    id: 'tpl-canva-invite',
    name: 'Formal invitation (Canva email)',
    subject: "You're invited — Matt & Sydney",
    text: invite.text,
    html: invite.html,
  },
  {
    id: 'tpl-canva-rsvp-yes',
    name: 'RSVP thanks — attending',
    subject: 'Thank you for your RSVP — see you soon',
    text: rsvpYes.text,
    html: rsvpYes.html,
  },
  {
    id: 'tpl-canva-rsvp-no',
    name: 'RSVP thanks — unable to attend',
    subject: 'Thank you for your RSVP',
    text: rsvpNo.text,
    html: rsvpNo.html,
  },
];
