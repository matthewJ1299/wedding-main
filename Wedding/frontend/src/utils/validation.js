/**
 * Shared validation utilities for consistent form validation across the application
 * Follows DRY principle by centralizing validation logic
 */

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex pattern (allows + and digits, max 15 digits total excluding +)
 */
const PHONE_REGEX = /^\+?\d{1,15}$/;

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone is valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.trim());
};

/**
 * Validates required field
 * @param {string} value - Value to validate
 * @returns {boolean} - True if value is not empty
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim().length > 0;
};

/**
 * Validates name field (required, minimum length)
 * @param {string} name - Name to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateName = (name) => {
  if (!isRequired(name)) {
    return { isValid: false, message: 'Name is required.' };
  }
  
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long.' };
  }
  
  if (trimmedName.length > 100) {
    return { isValid: false, message: 'Name must be less than 100 characters.' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates email field
 * @param {string} email - Email to validate
 * @param {boolean} required - Whether email is required
 * @returns {Object} - Validation result with isValid and message
 */
export const validateEmail = (email, required = true) => {
  if (required && !isRequired(email)) {
    return { isValid: false, message: 'Email is required.' };
  }
  
  if (email && !isValidEmail(email)) {
    return { isValid: false, message: 'Invalid email address.' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates phone field
 * @param {string} phone - Phone to validate
 * @param {boolean} required - Whether phone is required
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePhone = (phone, required = false) => {
  if (required && !isRequired(phone)) {
    return { isValid: false, message: 'Phone number is required.' };
  }
  
  if (phone && !isValidPhone(phone)) {
    return { isValid: false, message: 'Invalid phone number. Use digits with optional + and max 15 digits.' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates plus one name field
 * @param {string} plusOneName - Plus one name to validate
 * @param {boolean} required - Whether plus one name is required
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePlusOneName = (plusOneName, required = false) => {
  if (required && !isRequired(plusOneName)) {
    return { isValid: false, message: 'Plus one name is required.' };
  }
  
  if (plusOneName) {
    const trimmedName = plusOneName.trim();
    if (trimmedName.length < 2) {
      return { isValid: false, message: 'Plus one name must be at least 2 characters long.' };
    }
    
    if (trimmedName.length > 100) {
      return { isValid: false, message: 'Plus one name must be less than 100 characters.' };
    }
  }
  
  return { isValid: true, message: '' };
};

/**
 * Comprehensive form validation for invitee data
 * @param {Object} data - Form data to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with errors object
 */
export const validateInviteeForm = (data, options = {}) => {
  const errors = {};
  
  // Name validation
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  // Email validation
  const emailValidation = validateEmail(data.email, options.emailRequired !== false);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  // Phone validation
  const phoneValidation = validatePhone(data.phone, options.phoneRequired);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.message;
  }
  
  // Plus one validation
  if (options.plusOneRequired && data.allowPlusOne) {
    const plusOneValidation = validatePlusOneName(data.plusOneName, true);
    if (!plusOneValidation.isValid) {
      errors.plusOneName = plusOneValidation.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitizes input by trimming whitespace and removing potential XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

