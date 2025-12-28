/**
 * Input sanitization middleware for XSS protection
 * Sanitizes all incoming data to prevent XSS attacks
 */

/**
 * Sanitize HTML content by removing dangerous tags and attributes
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return html;
  
  return html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove dangerous tags
    .replace(/<(iframe|object|embed|form|input|textarea|button)\b[^>]*>/gi, '')
    // Remove dangerous attributes
    .replace(/\s*(onload|onerror|onclick|onmouseover|onfocus|onblur)\s*=\s*["'][^"']*["']/gi, '');
};

/**
 * Sanitize string input by removing potentially dangerous content
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '');
};

/**
 * Sanitize object recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
};

/**
 * Middleware to sanitize request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

/**
 * Middleware to sanitize query parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const sanitizeQuery = (req, res, next) => {
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  next();
};

/**
 * Middleware to sanitize URL parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const sanitizeParams = (req, res, next) => {
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
};

/**
 * Comprehensive sanitization middleware
 * Sanitizes body, query, and params
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const sanitizeAll = (req, res, next) => {
  sanitizeBody(req, res, () => {
    sanitizeQuery(req, res, () => {
      sanitizeParams(req, res, next);
    });
  });
};

/**
 * Sanitize filename to prevent directory traversal
 * @param {string} filename - Filename to sanitize
 * @returns {string} - Sanitized filename
 */
const sanitizeFilename = (filename) => {
  if (typeof filename !== 'string') return '';
  
  return filename
    // Remove directory traversal attempts
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove dangerous characters
    .replace(/[<>:"|?*]/g, '')
    // Limit length
    .substring(0, 255);
};

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  return email
    .trim()
    .toLowerCase()
    // Remove dangerous characters
    .replace(/[<>\"'`]/g, '')
    // Limit length
    .substring(0, 254);
};

/**
 * Sanitize phone number
 * @param {string} phone - Phone number to sanitize
 * @returns {string} - Sanitized phone number
 */
const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return '';
  
  return phone
    .trim()
    // Keep only digits, plus sign, spaces, hyphens, and parentheses
    .replace(/[^\d\+\s\-\(\)]/g, '')
    // Limit length
    .substring(0, 20);
};

module.exports = {
  sanitizeHTML,
  sanitizeString,
  sanitizeObject,
  sanitizeBody,
  sanitizeQuery,
  sanitizeParams,
  sanitizeAll,
  sanitizeFilename,
  sanitizeEmail,
  sanitizePhone
};



