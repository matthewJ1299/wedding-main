/**
 * Input validation middleware for API endpoints
 * Provides centralized validation logic following SOLID principles
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number format
 * @param {string} phone - Phone to validate
 * @returns {boolean} - True if valid
 */
const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^\+?\d{1,15}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @returns {boolean} - True if not empty
 */
const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim().length > 0;
};

/**
 * Validate UUID format
 * @param {string} id - ID to validate
 * @returns {boolean} - True if valid UUID
 */
const isValidUUID = (id) => {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

/**
 * Validation middleware for invitee data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const validateInvitee = (req, res, next) => {
  const errors = [];
  const { name, partner, email, phone, rsvp, allowPlusOne, plusOneName } = req.body;

  // Name validation
  if (!isRequired(name)) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  // Email validation
  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  // Phone validation
  if (phone && !isValidPhone(phone)) {
    errors.push('Invalid phone format. Use digits with optional + and max 15 digits');
  }

  // RSVP validation
  if (rsvp && !['pending', 'accepted', 'declined'].includes(rsvp)) {
    errors.push('RSVP status must be pending, accepted, or declined');
  }

  // Plus one validation
  if (allowPlusOne && rsvp === 'accepted' && !isRequired(plusOneName)) {
    errors.push('Plus one name is required when plus one is allowed and RSVP is accepted');
  }

  // Sanitize inputs
  if (name) req.body.name = sanitizeString(name);
  if (partner) req.body.partner = sanitizeString(partner);
  if (email) req.body.email = sanitizeString(email);
  if (phone) req.body.phone = sanitizeString(phone);
  if (plusOneName) req.body.plusOneName = sanitizeString(plusOneName);

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validation middleware for photo upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const validatePhotoUpload = (req, res, next) => {
  const errors = [];
  const file = req.file;

  // Check if file exists
  if (!file) {
    errors.push('No file provided');
  } else {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      errors.push('Invalid file type. Only JPEG, PNG, and WebP images are allowed');
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('File too large. Maximum size is 10MB');
    }
  }

  // Validate optional fields
  const { uploaderName, uploaderEmail } = req.body;
  
  if (uploaderEmail && !isValidEmail(uploaderEmail)) {
    errors.push('Invalid uploader email format');
  }

  if (uploaderName && uploaderName.trim().length > 100) {
    errors.push('Uploader name must be less than 100 characters');
  }

  // Sanitize inputs
  if (uploaderName) req.body.uploaderName = sanitizeString(uploaderName);
  if (uploaderEmail) req.body.uploaderEmail = sanitizeString(uploaderEmail);

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validation middleware for email data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const validateEmail = (req, res, next) => {
  const errors = [];
  const { to, subject, text, html } = req.body;

  // Required fields
  if (!isRequired(to)) {
    errors.push('Recipient email is required');
  } else if (!isValidEmail(to)) {
    errors.push('Invalid recipient email format');
  }

  if (!isRequired(subject)) {
    errors.push('Email subject is required');
  } else if (subject.trim().length > 200) {
    errors.push('Email subject must be less than 200 characters');
  }

  if (!isRequired(text)) {
    errors.push('Email text content is required');
  }

  // Sanitize inputs
  if (to) req.body.to = sanitizeString(to);
  if (subject) req.body.subject = sanitizeString(subject);
  if (text) req.body.text = sanitizeString(text);
  if (html) req.body.html = sanitizeString(html);

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validation middleware for UUID parameters
 * @param {string} paramName - Name of the parameter to validate
 * @returns {Function} - Middleware function
 */
const validateUUID = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!isValidUUID(id)) {
      return res.status(400).json({
        error: 'Invalid ID format',
        details: [`${paramName} must be a valid UUID`]
      });
    }

    next();
  };
};

/**
 * Validation middleware for query parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const validateQueryParams = (req, res, next) => {
  const errors = [];
  const { approved, limit, offset } = req.query;

  // Validate approved parameter
  if (approved && !['true', 'false'].includes(approved)) {
    errors.push('Approved parameter must be true or false');
  }

  // Validate limit parameter
  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be a number between 1 and 100');
    }
  }

  // Validate offset parameter
  if (offset) {
    const offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      errors.push('Offset must be a non-negative number');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      details: errors
    });
  }

  next();
};

module.exports = {
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
};





