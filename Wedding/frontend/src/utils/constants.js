/**
 * Application constants and configuration values
 * Centralizes hardcoded values for easier maintenance and environment-specific configuration
 */

/**
 * Default admin email (can be overridden by environment variables)
 */
export const DEFAULT_ADMIN_EMAIL = 'matthew.j@live.com';

/**
 * Wedding date for countdown timer and other date-related features
 */
export const WEDDING_DATE = '2026-10-03T15:00:00'; // October 3rd, 2026 at 3:00 PM

/**
 * Wedding venue information
 */
export const WEDDING_VENUE = {
  name: 'De Harte Venue',
  location: '206 Rentia St, Onderstepoort, Pretoria, 0110',
  address: 'De Harte, Onderstepoort',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=206+Rentia+St,+Onderstepoort,+Pretoria,+0110'
};

/**
 * Wedding couple information
 */
export const WEDDING_COUPLE = {
  groom: 'Matt',
  bride: 'Sydney',
  fullNames: 'Matt & Sydney'
};

/**
 * Application URLs (can be overridden by environment variables)
 */
export const APP_URLS = {
  API_BASE: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  SITE_URL: process.env.REACT_APP_SITE_URL || 'http://localhost:3000',
  ADMIN_EMAIL: process.env.REACT_APP_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL
};

/**
 * File upload configuration
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_FILES_PER_UPLOAD: 5
};

/**
 * Email configuration
 */
export const EMAIL_CONFIG = {
  FROM_NAME: 'Matt & Sydney',
  FROM_EMAIL: APP_URLS.ADMIN_EMAIL,
  REPLY_TO: APP_URLS.ADMIN_EMAIL
};

/**
 * RSVP configuration
 */
export const RSVP_CONFIG = {
  DEADLINE: '2026-06-03', // May 3 , 2026
  STATUSES: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    DECLINED: 'declined'
  }
};

/**
 * Theme configuration
 */
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#2d5c3a',
  SECONDARY_COLOR: '#bdbdbd',
  ACCENT_COLOR: '#39834d',
  FONT_FAMILIES: {
    PRIMARY: 'Cormorant Garamond, serif',
    SCRIPT: 'Great Vibes, cursive',
    SANS_SERIF: 'Arial, sans-serif'
  }
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  INVITEES: '/api/invitees',
  EMAIL_TEMPLATES: '/api/email-templates',
  SEND_EMAIL: '/api/send-email',
  PHOTOS: '/api/photos',
  HEALTH: '/api/health',
  SEED: '/api/seed'
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH: 'wedding_auth',
  THEME: 'wedding_theme',
  EMAIL_TRACKING: 'wedding_email_tracking',
  PHOTOS: 'wedding_photos'
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  EMAIL_SEND_FAILED: 'Failed to send email. Please try again later.',
  FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid image.',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB.'
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  RSVP_ACCEPTED: 'RSVP accepted! Thank you for confirming your attendance.',
  RSVP_DECLINED: 'RSVP declined. Thank you for letting us know.',
  EMAIL_SENT: 'Email sent successfully!',
  PHOTO_UPLOADED: 'Photo uploaded successfully!',
  INVITEE_ADDED: 'Invitee added successfully!',
  INVITEE_UPDATED: 'Invitee updated successfully!',
  INVITEE_DELETED: 'Invitee deleted successfully!',
  DETAILS_UPDATED: 'Your details have been updated successfully!'
};

