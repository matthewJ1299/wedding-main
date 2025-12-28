const { sendEmail } = require('./emailModule');

// Example usage: node testEmail.js recipient@example.com
const [,, to] = process.argv;

if (!to) {
  console.error('Usage: node testEmail.js recipient@example.com');
  process.exit(1);
}

sendEmail({
  to,
  subject: 'Test Email from Wedding App',
  text: 'This is a test email sent using Gmail SMTP and nodemailer.',
  html: '<b>This is a test email sent using Gmail SMTP and nodemailer.</b>'
})
  .then(info => {
    console.log('Email sent:', info.response);
  })
  .catch(err => {
    console.error('Error sending email:', err);
  });
