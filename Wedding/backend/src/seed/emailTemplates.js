export const DEFAULT_EMAIL_TEMPLATES = [
  {
    id: 'tpl-welcome-1',
    name: 'Invitation - Save the Date',
    subject: 'Save the Date: Matt & Sydney',
    text: 'Hi {{name}}, please save the date for our wedding! Visit {{invitationLink}} to view your invite.',
    html: '<p>Hi <strong>{{name}}</strong>,</p><p>Please save the date for our wedding!</p><p><a href="{{invitationLink}}">View your invitation</a></p>'
  },
  {
    id: 'tpl-rsvp-reminder-1',
    name: 'RSVP Reminder',
    subject: 'RSVP Reminder for Matt & Sydney',
    text: 'Hi {{name}}, this is a friendly reminder to RSVP. Visit {{rsvpLink}} to respond.',
    html: '<p>Hi <strong>{{name}}</strong>,</p><p>This is a friendly reminder to RSVP.</p><p><a href="{{rsvpLink}}">Respond here</a></p>'
  }
];




