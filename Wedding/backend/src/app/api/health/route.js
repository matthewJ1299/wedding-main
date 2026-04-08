import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { logger } from '../../../utils/logger.js';

export const runtime = 'nodejs';

/**
 * Health check endpoint for monitoring
 * Returns application status, database connectivity, and system information
 */
export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check database file exists
    const dbPath = path.join(process.cwd(), 'data.sqlite');
    const dbExists = fs.existsSync(dbPath);
    const dbStats = dbExists ? fs.statSync(dbPath) : null;
    
    // Check logs directory
    const logsPath = path.join(process.cwd(), 'logs');
    const logsExist = fs.existsSync(logsPath);
    
    // Check uploads directory
    const uploadsPath = path.join(process.cwd(), 'uploads');
    const uploadsExist = fs.existsSync(uploadsPath);
    
    // Memory usage
    const memoryUsage = process.memoryUsage();
    
    // Environment variables check
    const envCheck = {
      NODE_ENV: !!process.env.NODE_ENV,
      PORT: !!process.env.PORT,
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      ORIGIN_URL: !!process.env.ORIGIN_URL,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL
    };
    
    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      responseTime: `${responseTime}ms`,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      },
      database: {
        exists: dbExists,
        size: dbStats ? `${Math.round(dbStats.size / 1024)}KB` : null,
        lastModified: dbStats ? dbStats.mtime.toISOString() : null
      },
      directories: {
        logs: logsExist,
        uploads: uploadsExist
      },
      environment: envCheck,
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      }
    };
    
    // Log health check
    logger.info({
      type: 'health_check',
      responseTime,
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(healthStatus, { status: 200 });
    
  } catch (error) {
    logger.logError(error, { type: 'health_check' });
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * Simple ping endpoint for basic connectivity check
 */
export async function POST() {
  try {
    return NextResponse.json({
      status: 'pong',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    logger.logError(error, { type: 'ping' });
    return NextResponse.json({
      status: 'error',
      error: error.message
    }, { status: 500 });
  }
}

