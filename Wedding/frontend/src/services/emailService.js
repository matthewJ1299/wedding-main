/**
 * API service for email operations
 */

/**
 * Configuration for API endpoints
 */
export const API_ENDPOINTS = {
  SEND_EMAIL: '/api/send-email',
};

/**
 * Base URL for API requests
 */
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Send an email via the backend API
 * 
 * @param {Object} emailData - Email data
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.text - Plain text email content
 * @param {string} [emailData.html] - HTML email content (optional)
 * @returns {Promise<Object>} - API response
 * @throws {Error} - If the API call fails
 */
export const sendEmail = async (emailData) => {
  try {
    // Log email details before sending
    console.log('📧 Attempting to send email:', {
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html ? 'HTML content present' : 'No HTML content',
      timestamp: new Date().toISOString()
    });

    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.SEND_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Email sending failed:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error || 'Unknown error'
      });
      throw new Error(data.error || 'Failed to send email');
    }

    console.log('✅ Email sent successfully:', {
      to: emailData.to,
      subject: emailData.subject,
      response: data
    });

    return data;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw error;
  }
};