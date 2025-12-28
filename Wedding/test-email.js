import { sendEmail } from './backend/src/emailModule.js';

async function testEmail() {
  try {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
      html: '<p>This is a test email in HTML</p>'
    });
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

testEmail();