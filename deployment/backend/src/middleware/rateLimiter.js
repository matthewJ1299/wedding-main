/**
 * Rate limiting middleware for API endpoints
 * Prevents abuse and ensures fair usage of resources
 */

const rateLimit = require('express-rate-limit');

/**
 * Create rate limiter with custom options
 * @param {Object} options - Rate limiter options
 * @returns {Function} - Rate limiter middleware
 */
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.round(options.windowMs / 1000)
      });
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

/**
 * Strict rate limiter for sensitive endpoints
 * More restrictive limits for admin and upload endpoints
 */
const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Rate limit exceeded for sensitive operations',
    retryAfter: '15 minutes'
  }
});

/**
 * Moderate rate limiter for general API endpoints
 * Standard limits for most API operations
 */
const moderateRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Rate limit exceeded',
    retryAfter: '15 minutes'
  }
});

/**
 * Lenient rate limiter for public endpoints
 * More permissive limits for public-facing endpoints
 */
const lenientRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: {
    error: 'Rate limit exceeded',
    retryAfter: '15 minutes'
  }
});

/**
 * Upload rate limiter for file uploads
 * Special limits for file upload operations
 */
const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    error: 'Upload rate limit exceeded',
    retryAfter: '1 hour'
  }
});

/**
 * Email rate limiter for email sending
 * Prevents email spam and abuse
 */
const emailRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 emails per hour
  message: {
    error: 'Email rate limit exceeded',
    retryAfter: '1 hour'
  }
});

/**
 * Login rate limiter for authentication
 * Prevents brute force attacks
 */
const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    error: 'Too many login attempts',
    retryAfter: '15 minutes'
  }
});

/**
 * Admin rate limiter for admin operations
 * Strict limits for admin panel access
 */
const adminRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 admin requests per 15 minutes
  message: {
    error: 'Admin rate limit exceeded',
    retryAfter: '15 minutes'
  }
});

/**
 * Health check rate limiter
 * Very permissive for monitoring systems
 */
const healthRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 health checks per minute
  message: {
    error: 'Health check rate limit exceeded',
    retryAfter: '1 minute'
  }
});

/**
 * Custom rate limiter for specific endpoints
 * @param {Object} options - Custom options
 * @returns {Function} - Rate limiter middleware
 */
const customRateLimiter = (options) => createRateLimiter(options);

/**
 * Skip rate limiting for trusted IPs
 * @param {Array} trustedIPs - Array of trusted IP addresses
 * @returns {Function} - Skip function
 */
const skipTrustedIPs = (trustedIPs = []) => {
  return (req) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    return trustedIPs.includes(clientIP);
  };
};

/**
 * Skip rate limiting for authenticated users
 * @param {Object} req - Express request object
 * @returns {boolean} - True if should skip
 */
const skipAuthenticated = (req) => {
  // This would need to be implemented based on your auth system
  return req.user && req.user.authenticated;
};

module.exports = {
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
};



