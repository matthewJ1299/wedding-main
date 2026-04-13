import { GENERATED_EMAIL_BODIES } from './generatedEmailBodies.js';

const { invite, rsvpYes, rsvpNo } = GENERATED_EMAIL_BODIES;

/** Canva-export layouts: merge fields match app constants + per-invitee fields from Admin email tab. */
const CANVA_LAYOUT_TEMPLATES = [
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

export const DEFAULT_EMAIL_TEMPLATES = [
  {
    id: 'tpl-welcome-1',
    name: 'Invitation - Save the Date',
    subject: 'Save the Date: Matt & Sydney',
    text: 'Hi {{name}}, please save the date for our wedding! Visit {{invitationLink}} to view your invite.',
    html: '<p>Hi <strong>{{name}}</strong>,</p><p>Please save the date for our wedding!</p><p><a href="{{invitationLink}}">View your invitation</a></p>',
  },
  {
    id: 'tpl-rsvp-reminder-1',
    name: 'RSVP Reminder',
    subject: 'RSVP Reminder for Matt & Sydney',
    text: 'Hi {{name}}, this is a friendly reminder to RSVP. Visit {{rsvpLink}} to respond.',
    html: '<p>Hi <strong>{{name}}</strong>,</p><p>This is a friendly reminder to RSVP.</p><p><a href="{{rsvpLink}}">Respond here</a></p>',
  },
  ...CANVA_LAYOUT_TEMPLATES,
];
