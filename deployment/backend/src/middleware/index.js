/**
 * Middleware barrel export
 * Provides centralized exports for all middleware functions
 */

// Validation middleware
export {
  validateInvitee,
  validatePhotoUpload,
  validateEmail,
  validateUUID,
  validateQueryParams,
  isValidEmail,
  isValidPhone,
  isRequired,
  isValidUUID,
  sanitizeString
} from './validation';

// Sanitization middleware
export {
  sanitizeHTML,
  sanitizeString as sanitizeInput,
  sanitizeObject,
  sanitizeBody,
  sanitizeQuery,
  sanitizeParams,
  sanitizeAll,
  sanitizeFilename,
  sanitizeEmail,
  sanitizePhone
} from './sanitization';

// Rate limiting middleware
export {
  createRateLimiter,
  strictRateLimiter,
  moderateRateLimiter,
  lenientRateLimiter,
  uploadRateLimiter,
  emailRateLimiter,
  loginRateLimiter,
  adminRateLimiter,
  healthRateLimiter,
  customRateLimiter,
  skipTrustedIPs,
  skipAuthenticated
} from './rateLimiter';



