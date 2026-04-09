/**
 * PostgreSQL backup utility via pg_dump / psql (requires client tools on PATH).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { logger } = require('./logger');

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !String(url).trim()) {
    throw new Error('DATABASE_URL is required');
  }
  return String(url).trim();
}

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    logger.info('Created backup directory');
  }
}

function assertToolAvailable(cmd) {
  const r = spawnSync(cmd, ['--version'], { encoding: 'utf8' });
  if (r.error && r.error.code === 'ENOENT') {
    throw new Error(`${cmd} not found. Install PostgreSQL client tools and ensure they are on PATH.`);
  }
}

/**
 * @param {string} customName
 * @returns {string}
 */
const createBackup = (customName = null) => {
  try {
    ensureBackupDir();
    assertToolAvailable('pg_dump');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = customName || `backup_${timestamp}.sql`;
    const backupPath = path.join(BACKUP_DIR, backupName);
    const dbUrl = getDatabaseUrl();

    const r = spawnSync('pg_dump', ['--dbname', dbUrl, '-F', 'p', '-f', backupPath], {
      encoding: 'utf8',
    });
    if (r.status !== 0) {
      throw new Error(r.stderr || r.stdout || `pg_dump failed with code ${r.status}`);
    }

    const stats = fs.statSync(backupPath);
    logger.info({
      type: 'backup',
      action: 'created',
      backupPath,
      size: `${Math.round(stats.size / 1024)}KB`,
      timestamp: new Date().toISOString(),
    });

    return backupPath;
  } catch (error) {
    logger.logError(error, { type: 'backup_creation' });
    throw error;
  }
};

const listBackups = () => {
  try {
    ensureBackupDir();
    return fs
      .readdirSync(BACKUP_DIR)
      .filter((file) => file.endsWith('.sql'))
      .map((file) => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          sizeFormatted: `${Math.round(stats.size / 1024)}KB`,
          created: stats.birthtime,
          modified: stats.mtime,
        };
      })
      .sort((a, b) => b.created - a.created);
  } catch (error) {
    logger.logError(error, { type: 'backup_list' });
    throw error;
  }
};

/**
 * @param {string} backupName
 * @returns {string}
 */
const restoreBackup = (backupName) => {
  try {
    assertToolAvailable('psql');
    const backupPath = path.join(BACKUP_DIR, backupName);
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupName}`);
    }

    createBackup(`pre_restore_${Date.now()}.sql`);
    const dbUrl = getDatabaseUrl();
    const r = spawnSync('psql', ['--dbname', dbUrl, '-v', 'ON_ERROR_STOP=1', '-f', backupPath], {
      encoding: 'utf8',
    });
    if (r.status !== 0) {
      throw new Error(r.stderr || r.stdout || `psql restore failed with code ${r.status}`);
    }

    logger.info({
      type: 'backup',
      action: 'restored',
      backupName,
      timestamp: new Date().toISOString(),
    });

    return dbUrl;
  } catch (error) {
    logger.logError(error, { type: 'backup_restore' });
    throw error;
  }
};

/**
 * @param {number} keepCount
 * @returns {string[]}
 */
const cleanupOldBackups = (keepCount = 10) => {
  try {
    const backups = listBackups();
    const backupsToDelete = backups.slice(keepCount);
    const deletedBackups = [];
    backupsToDelete.forEach((backup) => {
      fs.unlinkSync(backup.path);
      deletedBackups.push(backup.name);
    });
    if (deletedBackups.length > 0) {
      logger.info({
        type: 'backup',
        action: 'cleanup',
        deletedCount: deletedBackups.length,
        deletedBackups,
        timestamp: new Date().toISOString(),
      });
    }
    return deletedBackups;
  } catch (error) {
    logger.logError(error, { type: 'backup_cleanup' });
    throw error;
  }
};

const getBackupInfo = () => {
  try {
    ensureBackupDir();
    const backups = listBackups();
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
    return {
      directory: BACKUP_DIR,
      totalBackups: backups.length,
      totalSize,
      totalSizeFormatted: `${Math.round(totalSize / 1024 / 1024)}MB`,
      oldestBackup: backups.length > 0 ? backups[backups.length - 1].created : null,
      newestBackup: backups.length > 0 ? backups[0].created : null,
    };
  } catch (error) {
    logger.logError(error, { type: 'backup_info' });
    throw error;
  }
};

if (require.main === module) {
  const command = process.argv[2];
  switch (command) {
    case 'create': {
      const customName = process.argv[3];
      const backupPath = createBackup(customName || null);
      console.log(`Backup created: ${backupPath}`);
      break;
    }
    case 'list': {
      const backups = listBackups();
      console.log('Available backups:');
      backups.forEach((backup) => {
        console.log(`  ${backup.name} (${backup.sizeFormatted}) - ${backup.created}`);
      });
      break;
    }
    case 'restore': {
      const backupName = process.argv[3];
      if (!backupName) {
        console.error('Please specify backup name to restore');
        process.exit(1);
      }
      restoreBackup(backupName);
      console.log(`Database restored from: ${backupName}`);
      break;
    }
    case 'cleanup': {
      const keepCount = parseInt(process.argv[3], 10) || 10;
      const deleted = cleanupOldBackups(keepCount);
      console.log(`Cleaned up ${deleted.length} old backups`);
      break;
    }
    case 'info': {
      const info = getBackupInfo();
      console.log('Backup Information:');
      console.log(`  Directory: ${info.directory}`);
      console.log(`  Total backups: ${info.totalBackups}`);
      console.log(`  Total size: ${info.totalSizeFormatted}`);
      break;
    }
    default:
      console.log('Usage: node dbBackup.js [create|list|restore|cleanup|info] [options]');
      console.log('  create [name]  - Create a SQL backup (pg_dump)');
      console.log('  list           - List all backups');
      console.log('  restore <name> - Restore from backup (psql)');
      console.log('  cleanup [n]    - Delete old backups (keep n most recent)');
      console.log('  info           - Show backup directory info');
      break;
  }
}

module.exports = {
  createBackup,
  listBackups,
  restoreBackup,
  cleanupOldBackups,
  getBackupInfo,
};
