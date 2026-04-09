/**
 * API service for email operations
 */

import { apiFetch } from './apiFetch';

export const API_ENDPOINTS = {
  SEND_EMAIL: '/api/send-email',
};

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * @param {object} emailData
 * @param {string} emailData.to
 * @param {string} emailData.subject
 * @param {string} emailData.text
 * @param {string} [emailData.html]
 * @returns {Promise<object>}
 */
export const sendEmail = async (emailData) => {
  console.log('[API] sendEmail payload:', {
    to: emailData.to,
    subject: emailData.subject,
    hasHtml: Boolean(emailData.html),
    timestamp: new Date().toISOString(),
  });

  const data = await apiFetch(`${BASE_URL}${API_ENDPOINTS.SEND_EMAIL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData),
  });

  console.log('[API] sendEmail response:', data);
  return data;
};
