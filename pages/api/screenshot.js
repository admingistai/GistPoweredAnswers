const ScreenshotService = require('../../lib/screenshotService');
const URLValidator = require('../../lib/urlValidator');

let screenshotService = null;

const getScreenshotService = () => {
  if (!screenshotService) {
    screenshotService = new ScreenshotService();
  }
  return screenshotService;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, options = {} } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    const validation = URLValidator.isValidURL(url);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Get screenshot service instance
    const service = getScreenshotService();

    // Capture screenshot
    const result = await service.captureScreenshot(validation.url, options);

    if (!result.success) {
      return res.status(500).json({ 
        error: 'Failed to capture screenshot',
        details: result.error 
      });
    }

    // Return screenshot info
    res.json({
      success: true,
      screenshotId: result.screenshotId,
      filename: result.filename,
      url: result.url,
      size: result.size,
      duration: result.duration,
      timestamp: result.timestamp,
      screenshotUrl: `/screenshots/${result.filename}`
    });

  } catch (error) {
    console.error('Screenshot API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}