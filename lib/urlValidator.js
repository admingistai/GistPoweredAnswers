const validator = require('validator');

class URLValidator {
  static isValidURL(url) {
    try {
      if (!url || typeof url !== 'string') {
        return { isValid: false, error: 'URL must be a non-empty string' };
      }

      const trimmedUrl = url.trim();
      
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        return { isValid: false, error: 'URL must start with http:// or https://' };
      }

      if (!validator.isURL(trimmedUrl, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: false,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        disallow_auth: false
      })) {
        return { isValid: false, error: 'Invalid URL format' };
      }

      const urlObj = new URL(trimmedUrl);
      
      if (urlObj.hostname === 'localhost' || 
          urlObj.hostname === '127.0.0.1' || 
          urlObj.hostname.startsWith('192.168.') ||
          urlObj.hostname.startsWith('10.') ||
          (urlObj.hostname.startsWith('172.') && 
           parseInt(urlObj.hostname.split('.')[1]) >= 16 && 
           parseInt(urlObj.hostname.split('.')[1]) <= 31)) {
        return { isValid: false, error: 'Local network URLs are not allowed for security reasons' };
      }

      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
      }

      return { isValid: true, url: trimmedUrl };
    } catch (error) {
      return { isValid: false, error: 'Invalid URL: ' + error.message };
    }
  }

  static sanitizeURL(url) {
    if (!url) return null;
    
    let sanitized = url.trim();
    
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      sanitized = 'https://' + sanitized;
    }
    
    try {
      const urlObj = new URL(sanitized);
      return urlObj.toString();
    } catch (error) {
      return null;
    }
  }

  static extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return null;
    }
  }
}

module.exports = URLValidator;