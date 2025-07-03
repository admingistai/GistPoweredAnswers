const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path: fileParts } = req.query;
    const filename = Array.isArray(fileParts) ? fileParts.join('/') : fileParts;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const screenshotPath = path.join(process.cwd(), 'screenshots', filename);
    
    // Check if file exists
    if (!fs.existsSync(screenshotPath)) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }

    // Get file stats
    const stats = fs.statSync(screenshotPath);
    
    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Stream the file
    const readStream = fs.createReadStream(screenshotPath);
    readStream.pipe(res);

  } catch (error) {
    console.error('Error serving screenshot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}