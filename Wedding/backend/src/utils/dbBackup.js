/**
 * SQLite database backup utility
 * Creates timestamped backups of the database file
 */

const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');

const DB_PATH = path.join(process.cwd(), 'data.sqlite');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

/**
 * Ensure backup directory exists
 */
const ensureBackupDir = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    logger.info('Created backup directory');
  }
};

/**
 * Create a backup of the SQLite database
 * @param {string} customName - Optional custom backup name
 * @returns {string} - Path to the backup file
 */
const createBackup = (customName = null) => {
  try {
    ensureBackupDir();
    
    // Check if database exists
    if (!fs.existsSync(DB_PATH)) {
      throw new Error('Database file not found');
    }
    
    // Generate backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = customName || `backup_${timestamp}.sqlite`;
    const backupPath = path.join(BACKUP_DIR, backupName);
    
    // Copy database file
    fs.copyFileSync(DB_PATH, backupPath);
    
    // Get backup file stats
    const stats = fs.statSync(backupPath);
    
    logger.info({
      type: 'backup',
      action: 'created',
      backupPath,
      size: `${Math.round(stats.size / 1024)}KB`,
      timestamp: new Date().toISOString()
    });
    
    return backupPath;
    
  } catch (error) {
    logger.logError(error, { type: 'backup_creation' });
    throw error;
  }
};

/**
 * List all available backups
 * @returns {Array} - Array of backup file information
 */
const listBackups = () => {
  try {
    ensureBackupDir();
    
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.sqlite'))
      .map(file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          path: filePath,
          size: stats.size,
          sizeFormatted: `${Math.round(stats.size / 1024)}KB`,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.created - a.created); // Sort by creation date, newest first
    
    return files;
    
  } catch (error) {
    logger.logError(error, { type: 'backup_list' });
    throw error;
  }
};

/**
 * Restore database from backup
 * @param {string} backupName - Name of the backup file to restore
 * @returns {string} - Path to the restored database
 */
const restoreBackup = (backupName) => {
  try {
    const backupPath = path.join(BACKUP_DIR, backupName);
    
    // Check if backup exists
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupName}`);
    }
    
    // Create a backup of current database before restoring
    if (fs.existsSync(DB_PATH)) {
      const currentBackup = createBackup(`pre_restore_${Date.now()}.sqlite`);
      logger.info(`Created pre-restore backup: ${currentBackup}`);
    }
    
    // Copy backup to database location
    fs.copyFileSync(backupPath, DB_PATH);
    
    logger.info({
      type: 'backup',
      action: 'restored',
      backupName,
      timestamp: new Date().toISOString()
    });
    
    return DB_PATH;
    
  } catch (error) {
    logger.logError(error, { type: 'backup_restore' });
    throw error;
  }
};

/**
 * Delete old backups (keep only the most recent N backups)
 * @param {number} keepCount - Number of backups to keep
 * @returns {Array} - Array of deleted backup names
 */
const cleanupOldBackups = (keepCount = 10) => {
  try {
    const backups = listBackups();
    const backupsToDelete = backups.slice(keepCount);
    const deletedBackups = [];
    
    backupsToDelete.forEach(backup => {
      fs.unlinkSync(backup.path);
      deletedBackups.push(backup.name);
    });
    
    if (deletedBackups.length > 0) {
      logger.info({
        type: 'backup',
        action: 'cleanup',
        deletedCount: deletedBackups.length,
        deletedBackups,
        timestamp: new Date().toISOString()
      });
    }
    
    return deletedBackups;
    
  } catch (error) {
    logger.logError(error, { type: 'backup_cleanup' });
    throw error;
  }
};

/**
 * Get backup directory information
 * @returns {Object} - Backup directory stats
 */
const getBackupInfo = () => {
  try {
    ensureBackupDir();
    
    const backups = listBackups();
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
    
    return {
      directory: BACKUP_DIR,
      totalBackups: backups.length,
      totalSize: totalSize,
      totalSizeFormatted: `${Math.round(totalSize / 1024 / 1024)}MB`,
      oldestBackup: backups.length > 0 ? backups[backups.length - 1].created : null,
      newestBackup: backups.length > 0 ? backups[0].created : null
    };
    
  } catch (error) {
    logger.logError(error, { type: 'backup_info' });
    throw error;
  }
};

// CLI interface for running backups from command line
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      const customName = process.argv[3];
      const backupPath = createBackup(customName);
      console.log(`Backup created: ${backupPath}`);
      break;
      
    case 'list':
      const backups = listBackups();
      console.log('Available backups:');
      backups.forEach(backup => {
        console.log(`  ${backup.name} (${backup.sizeFormatted}) - ${backup.created}`);
      });
      break;
      
    case 'restore':
      const backupName = process.argv[3];
      if (!backupName) {
        console.error('Please specify backup name to restore');
        process.exit(1);
      }
      restoreBackup(backupName);
      console.log(`Database restored from: ${backupName}`);
      break;
      
    case 'cleanup':
      const keepCount = parseInt(process.argv[3]) || 10;
      const deleted = cleanupOldBackups(keepCount);
      console.log(`Cleaned up ${deleted.length} old backups`);
      break;
      
    case 'info':
      const info = getBackupInfo();
      console.log('Backup Information:');
      console.log(`  Directory: ${info.directory}`);
      console.log(`  Total backups: ${info.totalBackups}`);
      console.log(`  Total size: ${info.totalSizeFormatted}`);
      break;
      
    default:
      console.log('Usage: node dbBackup.js [create|list|restore|cleanup|info] [options]');
      console.log('  create [name]  - Create a backup');
      console.log('  list           - List all backups');
      console.log('  restore <name> - Restore from backup');
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
  getBackupInfo
};

