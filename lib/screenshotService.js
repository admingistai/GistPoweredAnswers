const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Simple logger for Next.js environment
const logger = {
  info: (message, ...args) => console.log(`[INFO] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[WARN] ${message}`, ...args),
  error: (message, ...args) => console.error(`[ERROR] ${message}`, ...args)
};

class ScreenshotService {
  constructor() {
    this.browser = null;
    this.screenshotDir = path.join(process.cwd(), 'screenshots');
    this.maxRetries = 3;
    this.timeout = 30000;
  }

  async initialize() {
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
      
      // Check if we can find a browser executable
      let executablePath;
      try {
        executablePath = puppeteer.executablePath();
        logger.info(`Found browser executable at: ${executablePath}`);
      } catch (execError) {
        logger.warn('No browser executable found, will try to download');
      }
      
      // Try different browser launch configurations
      const launchConfigs = [
        // First try: Use downloaded Chrome
        {
          headless: 'new',
          executablePath: path.join(__dirname, '../../chrome/mac_arm-140.0.7271.0/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ],
          defaultViewport: null
        },
        // Second try: Use system Chrome if available
        {
          headless: 'new',
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ],
          defaultViewport: null
        },
        // Third try: Standard configuration with Puppeteer's Chrome
        {
          headless: 'new',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ],
          defaultViewport: null
        },
        // Fourth try: Minimal configuration
        {
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          defaultViewport: null
        },
        // Fifth try: Even more minimal
        {
          headless: 'new',
          args: [],
          defaultViewport: null
        }
      ];

      let lastError;
      for (let i = 0; i < launchConfigs.length; i++) {
        try {
          logger.info(`Attempting browser launch with config ${i + 1}/${launchConfigs.length}`);
          
          // Skip configs with executable paths that don't exist
          if (launchConfigs[i].executablePath && !require('fs').existsSync(launchConfigs[i].executablePath)) {
            logger.info(`Executable not found: ${launchConfigs[i].executablePath}, skipping...`);
            continue;
          }
          
          this.browser = await puppeteer.launch(launchConfigs[i]);
          
          // Test the browser by creating a page
          const testPage = await this.browser.newPage();
          await testPage.close();
          
          logger.info('Screenshot service initialized successfully');
          return;
        } catch (error) {
          lastError = error;
          logger.warn(`Browser launch attempt ${i + 1} failed: ${error.message}`);
          if (this.browser) {
            try {
              await this.browser.close();
            } catch (closeError) {
              // Ignore close errors
            }
            this.browser = null;
          }
        }
      }
      
      // If all configurations failed, provide helpful error message
      const errorMessage = `All browser launch attempts failed. Last error: ${lastError?.message || 'Unknown error'}. 
      
Please try:
1. Run: npx @puppeteer/browsers install chrome
2. Or install Chrome manually: brew install --cask google-chrome
3. Check network connectivity`;
      
      throw new Error(errorMessage);
    } catch (error) {
      logger.error('Failed to initialize screenshot service:', error.message);
      throw error;
    }
  }

  async captureScreenshot(url, options = {}) {
    const startTime = Date.now();
    const screenshotId = uuidv4();
    
    let page = null;
    let retryCount = 0;
    
    const config = {
      fullPage: options.fullPage !== false,
      quality: options.quality || 90,
      type: options.type || 'jpeg',
      viewport: options.viewport || { width: 1366, height: 768 },
      waitForSelector: options.waitForSelector || null,
      waitTime: options.waitTime || 2000,
      timeout: options.timeout || this.timeout,
      ...options
    };

    while (retryCount < this.maxRetries) {
      try {
        if (!this.browser) {
          await this.initialize();
        }

        page = await this.browser.newPage();
        
        await page.setViewport(config.viewport);
        
        // Set user agent based on viewport width
        const isMobileView = config.viewport.width < 768;
        const userAgent = isMobileView 
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
          : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        
        await page.setUserAgent(userAgent);
        
        await page.setRequestInterception(true);
        page.on('request', (request) => {
          const resourceType = request.resourceType();
          if (['font', 'media'].includes(resourceType)) {
            request.abort();
          } else {
            request.continue();
          }
        });

        logger.info(`Attempting to capture screenshot for ${url} (attempt ${retryCount + 1})`);
        
        const response = await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: config.timeout
        });

        if (!response || !response.ok()) {
          throw new Error(`HTTP ${response?.status() || 'unknown'}: Failed to load page`);
        }

        if (config.waitForSelector) {
          await page.waitForSelector(config.waitForSelector, { timeout: 10000 });
        }

        if (config.waitTime > 0) {
          await new Promise(resolve => setTimeout(resolve, config.waitTime));
        }

        await page.evaluate(() => {
          return new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0);
                setTimeout(resolve, 500);
              }
            }, 100);
          });
        });

        const filename = `screenshot-${screenshotId}-${Date.now()}.${config.type}`;
        const filepath = path.join(this.screenshotDir, filename);

        const screenshotBuffer = await page.screenshot({
          path: filepath,
          fullPage: config.fullPage,
          quality: config.type === 'jpeg' ? config.quality : undefined,
          type: config.type
        });

        const stats = await fs.stat(filepath);
        const duration = Date.now() - startTime;

        logger.info(`Screenshot captured successfully: ${filename} (${stats.size} bytes, ${duration}ms)`);

        await page.close();

        return {
          success: true,
          screenshotId,
          filename,
          filepath,
          url,
          size: stats.size,
          duration,
          timestamp: new Date().toISOString(),
          config: {
            fullPage: config.fullPage,
            viewport: config.viewport,
            type: config.type,
            quality: config.quality
          }
        };

      } catch (error) {
        retryCount++;
        logger.warn(`Screenshot attempt ${retryCount} failed for ${url}:`, error.message);

        if (page) {
          try {
            await page.close();
          } catch (closeError) {
            logger.warn('Failed to close page:', closeError.message);
          }
        }

        if (retryCount >= this.maxRetries) {
          const duration = Date.now() - startTime;
          logger.error(`Failed to capture screenshot for ${url} after ${this.maxRetries} attempts:`, error.message);
          
          return {
            success: false,
            error: error.message,
            screenshotId,
            url,
            duration,
            attempts: retryCount,
            timestamp: new Date().toISOString()
          };
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  }

  async cleanup(screenshotId) {
    try {
      const files = await fs.readdir(this.screenshotDir);
      const screenshotFiles = files.filter(file => file.includes(screenshotId));
      
      for (const file of screenshotFiles) {
        const filepath = path.join(this.screenshotDir, file);
        await fs.unlink(filepath);
        logger.info(`Cleaned up screenshot file: ${file}`);
      }
    } catch (error) {
      logger.warn(`Failed to cleanup screenshot ${screenshotId}:`, error.message);
    }
  }

  async cleanupOldScreenshots(maxAgeMinutes = 60) {
    try {
      const files = await fs.readdir(this.screenshotDir);
      const now = Date.now();
      const maxAge = maxAgeMinutes * 60 * 1000;
      
      for (const file of files) {
        const filepath = path.join(this.screenshotDir, file);
        const stats = await fs.stat(filepath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filepath);
          logger.info(`Cleaned up old screenshot: ${file}`);
        }
      }
    } catch (error) {
      logger.warn('Failed to cleanup old screenshots:', error.message);
    }
  }

  async close() {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
        logger.info('Screenshot service closed successfully');
      } catch (error) {
        logger.warn('Failed to close browser:', error.message);
      }
    }
  }

  async getScreenshotInfo(screenshotId) {
    try {
      const files = await fs.readdir(this.screenshotDir);
      const screenshotFile = files.find(file => file.includes(screenshotId));
      
      if (!screenshotFile) {
        return null;
      }
      
      const filepath = path.join(this.screenshotDir, screenshotFile);
      const stats = await fs.stat(filepath);
      
      return {
        filename: screenshotFile,
        filepath,
        size: stats.size,
        created: stats.mtime
      };
    } catch (error) {
      logger.warn(`Failed to get screenshot info for ${screenshotId}:`, error.message);
      return null;
    }
  }
}

module.exports = ScreenshotService;