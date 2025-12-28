/**
 * Structured logging utility for production monitoring
 * Uses Winston for robust logging capabilities
 */

const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    format: consoleFormat,
  }),
  
  // Error log file
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Combined log file
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  transports,
  exitOnError: false,
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log API request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const logRequest = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.http(`${req.method} ${req.url} - ${req.ip}`);
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

/**
 * Log error with context
 * @param {Error} error - Error object
 * @param {Object} context - Additional context information
 */
const logError = (error, context = {}) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log database operation
 * @param {string} operation - Operation type (create, read, update, delete)
 * @param {string} table - Table name
 * @param {Object} data - Data involved in operation
 */
const logDatabaseOperation = (operation, table, data = {}) => {
  logger.info({
    type: 'database',
    operation,
    table,
    data: JSON.stringify(data),
    timestamp: new Date().toISOString()
  });
};

/**
 * Log email operation
 * @param {string} operation - Operation type (send, template_created, etc.)
 * @param {Object} data - Email data
 */
const logEmailOperation = (operation, data = {}) => {
  logger.info({
    type: 'email',
    operation,
    to: data.to,
    subject: data.subject,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log admin action
 * @param {string} action - Admin action performed
 * @param {Object} context - Additional context
 */
const logAdminAction = (action, context = {}) => {
  logger.info({
    type: 'admin',
    action,
    context,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log application startup
 * @param {Object} config - Application configuration
 */
const logStartup = (config = {}) => {
  logger.info({
    type: 'startup',
    message: 'Application started',
    config: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      hasDatabase: !!config.databasePath,
      hasEmail: !!config.emailConfigured
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  logRequest,
  logError,
  logDatabaseOperation,
  logEmailOperation,
  logAdminAction,
  logStartup
};

