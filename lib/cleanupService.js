const fs = require('fs').promises;
const path = require('path');

// Simple logger for Next.js environment
const logger = {
  info: (message, ...args) => console.log(`[CLEANUP] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[CLEANUP] ${message}`, ...args),
  error: (message, ...args) => console.error(`[CLEANUP] ${message}`, ...args)
};

class CleanupService {
  constructor() {
    this.screenshotDir = path.join(process.cwd(), 'screenshots');
  }

  async cleanupScreenshot(screenshotId) {
    try {
      const files = await fs.readdir(this.screenshotDir);
      const screenshotFiles = files.filter(file => file.includes(screenshotId));
      
      if (screenshotFiles.length === 0) {
        logger.warn(`No screenshot files found for ID: ${screenshotId}`);
        return { success: true, message: 'No files found to cleanup' };
      }

      let cleanedFiles = [];
      for (const file of screenshotFiles) {
        const filepath = path.join(this.screenshotDir, file);
        try {
          await fs.unlink(filepath);
          cleanedFiles.push(file);
          logger.info(`Cleaned up screenshot file: ${file}`);
        } catch (error) {
          logger.error(`Failed to delete file ${file}:`, error.message);
        }
      }

      return {
        success: true,
        message: `Cleaned up ${cleanedFiles.length} file(s)`,
        files: cleanedFiles
      };
    } catch (error) {
      logger.error(`Failed to cleanup screenshot ${screenshotId}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async cleanupOldScreenshots(maxAgeMinutes = 60) {
    try {
      const files = await fs.readdir(this.screenshotDir);
      const now = Date.now();
      const maxAge = maxAgeMinutes * 60 * 1000;
      
      let cleanedFiles = [];
      for (const file of files) {
        const filepath = path.join(this.screenshotDir, file);
        try {
          const stats = await fs.stat(filepath);
          
          if (now - stats.mtime.getTime() > maxAge) {
            await fs.unlink(filepath);
            cleanedFiles.push(file);
            logger.info(`Cleaned up old screenshot: ${file}`);
          }
        } catch (error) {
          logger.error(`Failed to check/delete file ${file}:`, error.message);
        }
      }

      return {
        success: true,
        message: `Cleaned up ${cleanedFiles.length} old file(s)`,
        files: cleanedFiles
      };
    } catch (error) {
      logger.error('Failed to cleanup old screenshots:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getScreenshotStats() {
    try {
      const files = await fs.readdir(this.screenshotDir);
      const stats = [];
      
      for (const file of files) {
        const filepath = path.join(this.screenshotDir, file);
        try {
          const fileStats = await fs.stat(filepath);
          stats.push({
            filename: file,
            size: fileStats.size,
            created: fileStats.mtime,
            ageMinutes: Math.floor((Date.now() - fileStats.mtime.getTime()) / (60 * 1000))
          });
        } catch (error) {
          logger.error(`Failed to get stats for file ${file}:`, error.message);
        }
      }

      return {
        success: true,
        totalFiles: stats.length,
        totalSize: stats.reduce((sum, file) => sum + file.size, 0),
        files: stats
      };
    } catch (error) {
      logger.error('Failed to get screenshot stats:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async cleanupByPattern(pattern) {
    try {
      const files = await fs.readdir(this.screenshotDir);
      const regex = new RegExp(pattern);
      const matchingFiles = files.filter(file => regex.test(file));
      
      if (matchingFiles.length === 0) {
        return {
          success: true,
          message: 'No files matched the pattern',
          files: []
        };
      }

      let cleanedFiles = [];
      for (const file of matchingFiles) {
        const filepath = path.join(this.screenshotDir, file);
        try {
          await fs.unlink(filepath);
          cleanedFiles.push(file);
          logger.info(`Cleaned up file matching pattern: ${file}`);
        } catch (error) {
          logger.error(`Failed to delete file ${file}:`, error.message);
        }
      }

      return {
        success: true,
        message: `Cleaned up ${cleanedFiles.length} file(s) matching pattern`,
        files: cleanedFiles
      };
    } catch (error) {
      logger.error(`Failed to cleanup files by pattern ${pattern}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = CleanupService;