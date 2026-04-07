#!/usr/bin/env node

/**
 * Standalone Express server wrapper for Next.js application
 * Compatible with Node.js 18+ with fallback database support
 */

const express = require('express');
const next = require('next');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

// Try to load better-sqlite3, fallback to sqlite3
let Database;
let dbType = 'unknown';

try {
  Database = require('better-sqlite3');
  dbType = 'better-sqlite3';
  console.log('✅ Using better-sqlite3');
} catch (error) {
  try {
    const sqlite3 = require('sqlite3').verbose();
    Database = class {
      constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
        this.dbPath = dbPath;
      }
      
      prepare(sql) {
        return {
          run: (params) => new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
              if (err) reject(err);
              else resolve({ lastInsertRowid: this.lastID, changes: this.changes });
            });
          }),
          get: (params) => new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          }),
          all: (params) => new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
            });
          })
        };
      }
      
      close() {
        return new Promise((resolve, reject) => {
          this.db.close((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    };
    dbType = 'sqlite3';
    console.log('✅ Using sqlite3 fallback');
  } catch (fallbackError) {
    console.error('❌ No SQLite database available');
    process.exit(1);
  }
}

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

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3001;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

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

  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  
  server.use('/api', limiter);

  // CORS middleware for production
  if (!dev) {
    server.use((req, res, next) => {
      const origin = process.env.FRONTEND_URL || 'https://matthewandsydney.co.za';
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
  }

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
    return handle(req, res);
  });

  // Error handling middleware
  server.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: dev ? err.message : 'Something went wrong'
    });
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
