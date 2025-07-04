const CleanupService = require('../../lib/cleanupService');

let cleanupService = null;

const getCleanupService = () => {
  if (!cleanupService) {
    cleanupService = new CleanupService();
  }
  return cleanupService;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { screenshotId, action = 'cleanup', maxAgeMinutes = 60, pattern } = req.body;
    const service = getCleanupService();
    let result;

    switch (action) {
      case 'cleanup':
        if (!screenshotId) {
          return res.status(400).json({ error: 'screenshotId is required for cleanup action' });
        }
        result = await service.cleanupScreenshot(screenshotId);
        break;

      case 'cleanup-old':
        result = await service.cleanupOldScreenshots(maxAgeMinutes);
        break;

      case 'cleanup-pattern':
        if (!pattern) {
          return res.status(400).json({ error: 'pattern is required for cleanup-pattern action' });
        }
        result = await service.cleanupByPattern(pattern);
        break;

      case 'stats':
        result = await service.getScreenshotStats();
        break;

      default:
        return res.status(400).json({ error: 'Invalid action. Use: cleanup, cleanup-old, cleanup-pattern, or stats' });
    }

    if (!result.success) {
      return res.status(500).json({ 
        error: 'Cleanup operation failed',
        details: result.error 
      });
    }

    res.json(result);

  } catch (error) {
    console.error('Cleanup API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

// Handle cleanup requests from sendBeacon (sent as plain text)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};