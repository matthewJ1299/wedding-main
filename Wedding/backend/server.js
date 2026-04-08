#!/usr/bin/env node

/**
 * Standalone Express server wrapper for Next.js application
 * Compatible with Node.js 18+ with fallback database support
 */

const express = require('express');
const next = require('next');
const compression = require('compression');
const helmet = require('helmet');
const { allowedOriginFromExpress } = require('./cors-origin.cjs');

// API routes use Node's built-in node:sqlite (see repositories / openDatabaseSync)
const dbType = 'node:sqlite';

// Rate limiting fallback
let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch (error) {
  console.log('⚠️  Using basic rate limiting fallback');
  rateLimit = (options) => (req, res, next) => {
    // Basic rate limiting fallback
    next();
  };
}

// cPanel "startup file only" deployments may launch server.js without NODE_ENV.
// Default to production so Next does not run in dev mode on the live server.
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log('NODE_ENV not set; defaulting to production.');
}
const dev = process.env.NODE_ENV === 'development';
const hostname = 'localhost';
const port = process.env.PORT || 3001;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

function applyCors(res, req) {
  const origin = allowedOriginFromExpress(req);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '600');
}

app.prepare().then(() => {
  const server = express();

  // Security middleware
  server.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  // Compression middleware
  server.use(compression());

  // Body parsing middleware
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // CORS before rate limiting so 429 and error paths still expose CORS headers to the browser
  server.use('/api', (req, res, next) => {
    applyCors(res, req);
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    handler: (req, res, next, options) => {
      applyCors(res, req);
      res.status(options.statusCode).json({ error: options.message });
    }
  });

  server.use('/api', limiter);

  // Request logging middleware
  server.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
    next();
  });

  // Health check endpoint
  server.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      databaseType: dbType
    });
  });

  // API routes are handled by Next.js API routes
  // All other routes are handled by Next.js
  server.all('*', (req, res) => {
    return Promise.resolve(handle(req, res)).catch((err) => {
      console.error('Next.js handle error:', err);
      if (!res.headersSent) {
        applyCors(res, req);
        res.status(500).json({
          error: 'Internal Server Error',
          message: dev ? err.message : 'Something went wrong'
        });
      }
    });
  });

  // Error handling middleware
  server.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    if (!res.headersSent) {
      applyCors(res, req);
      res.status(500).json({
        error: 'Internal Server Error',
        message: dev ? err.message : 'Something went wrong'
      });
    }
  });

  // Start server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Backend server ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`> Node.js version: ${process.version}`);
    console.log(`> Database: ${dbType}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
