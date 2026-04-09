import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { logger } from '../../../utils/logger.js';
import { getDb } from '../../../db/database.js';
import { getUploadsDir } from '../../../utils/paths.js';

export const runtime = 'nodejs';

/**
 * Health check endpoint for monitoring
 * Returns application status, database connectivity, and system information
 */
export async function GET() {
  try {
    const startTime = Date.now();

    let dbOk = false;
    let dbError = null;
    try {
      await getDb().query('SELECT 1 AS ok');
      dbOk = true;
    } catch (e) {
      dbError = e.message;
    }

    const logsPath = path.join(process.cwd(), 'logs');
    const logsExist = fs.existsSync(logsPath);

    const uploadsPath = getUploadsDir();
    const uploadsExist = fs.existsSync(uploadsPath);

    const memoryUsage = process.memoryUsage();

    const envCheck = {
      NODE_ENV: !!process.env.NODE_ENV,
      PORT: !!process.env.PORT,
      DATABASE_URL: !!process.env.DATABASE_URL,
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_USER: !!(process.env.SMTP_USER || process.env.EMAIL_USER),
      SMTP_FROM: !!process.env.SMTP_FROM,
      ORIGIN_URL: !!process.env.ORIGIN_URL,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    };

    const responseTime = Date.now() - startTime;

    const healthStatus = {
      status: dbOk ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      nodeEnv: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      responseTime: `${responseTime}ms`,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      },
      database: {
        connected: dbOk,
        error: dbError,
      },
      directories: {
        logs: logsExist,
        uploads: uploadsExist,
      },
      envCheck,
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
      },
    };

    logger.info({
      type: 'health_check',
      responseTime,
      status: healthStatus.status,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(healthStatus, { status: dbOk ? 200 : 503 });
  } catch (error) {
    logger.logError(error, { type: 'health_check' });

    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
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
      uptime: process.uptime(),
    });
  } catch (error) {
    logger.logError(error, { type: 'ping' });
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
