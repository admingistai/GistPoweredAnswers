import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function TryIt() {
  const [isLoading, setIsLoading] = useState(false);
  const [screenshotResult, setScreenshotResult] = useState(null);
  const [error, setError] = useState(null);
  const [screenshotId, setScreenshotId] = useState(null);
  const router = useRouter();
  const { url } = router.query;

  // Cleanup function to delete screenshot
  const cleanupScreenshot = useCallback(async (id) => {
    if (!id) return;
    
    try {
      await fetch('/api/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ screenshotId: id }),
      });
    } catch (error) {
      console.error('Failed to cleanup screenshot:', error);
    }
  }, []);

  // Setup cleanup on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (screenshotId) {
        // Use sendBeacon for reliable cleanup on page unload
        navigator.sendBeacon('/api/cleanup', JSON.stringify({ screenshotId }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [screenshotId]);

  // Capture screenshot when URL is provided
  useEffect(() => {
    if (!url) return;

    const captureScreenshot = async () => {
      setIsLoading(true);
      setError(null);
      setScreenshotResult(null);

      try {
        // Preprocess URL - add https:// if no protocol specified
        let processedUrl = url.trim();
        if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
          processedUrl = 'https://' + processedUrl;
        }

        // Get current viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const response = await fetch('/api/screenshot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: processedUrl,
            options: {
              viewport: { width: viewportWidth, height: viewportHeight },
              fullPage: true,
              quality: 90
            }
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to capture screenshot');
        }

        setScreenshotResult(result);
        setScreenshotId(result.screenshotId);

        // Set up auto-cleanup after 1 hour
        setTimeout(() => {
          cleanupScreenshot(result.screenshotId);
        }, 60 * 60 * 1000);

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    captureScreenshot();
  }, [url, cleanupScreenshot]);

  // Load widget script after screenshot is displayed
  useEffect(() => {
    if (screenshotResult && !isLoading) {
      // Remove any existing widget scripts
      const existingScripts = document.querySelectorAll('script[src*="widget.js"]');
      existingScripts.forEach(script => script.remove());

      // Create and inject new widget script
      const script = document.createElement('script');
      script.src = '/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup script on unmount
        const scripts = document.querySelectorAll('script[src*="widget.js"]');
        scripts.forEach(s => s.remove());
      };
    }
  }, [screenshotResult, isLoading]);

  // Show URL input prompt if no URL provided
  if (!url) {
    return (
      <>
        <Head>
          <title>Try It - Website Screenshot with Widget</title>
          <meta name="description" content="Try our website screenshot tool with AI widget overlay" />
          <link rel="icon" href="/Gist_Mark_000000.png" />
        </Head>
        <div className="tryit-container">
          <div className="url-prompt">
            <h1>Try It Out</h1>
            <p>Please provide a URL parameter to capture a screenshot.</p>
            <p>Example: <code>/tryit?url=example.com</code></p>
          </div>
        </div>
        <style jsx>{`
          .tryit-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .url-prompt {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            backdrop-filter: blur(10px);
          }
          h1 {
            margin: 0 0 1rem 0;
            font-size: 2.5rem;
          }
          p {
            margin: 0.5rem 0;
            font-size: 1.1rem;
          }
          code {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Capturing {url} - Try It</title>
        <meta name="description" content={`Capturing screenshot of ${url} with AI widget overlay`} />
        <link rel="icon" href="/Gist_Mark_000000.png" />
      </Head>
      
      <div className="tryit-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <h2>Capturing...</h2>
              <p>Taking a screenshot of {url}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-content">
              <h2>Oops! Something went wrong</h2>
              <p>{error}</p>
              <button onClick={() => router.reload()}>Try Again</button>
            </div>
          </div>
        )}

        {screenshotResult && !isLoading && (
          <div className="screenshot-display">
            <img 
              src={screenshotResult.screenshotUrl} 
              alt={`Screenshot of ${screenshotResult.url}`}
              className="screenshot-image"
            />
          </div>
        )}
      </div>


      <style jsx>{`
        .tryit-container {
          min-height: 100vh;
          background: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-content {
          text-align: center;
          color: white;
          padding: 2rem;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 2rem;
        }

        .loading-content h2 {
          margin: 0 0 1rem 0;
          font-size: 2rem;
          font-weight: 600;
        }

        .loading-content p {
          margin: 0;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        }

        .error-content {
          text-align: center;
          color: white;
          padding: 2rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .error-content h2 {
          margin: 0 0 1rem 0;
          font-size: 2rem;
        }

        .error-content p {
          margin: 0 0 2rem 0;
          font-size: 1.1rem;
        }

        .error-content button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .error-content button:hover {
          background: white;
          color: #ff6b6b;
        }

        .screenshot-display {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: auto;
        }

        .screenshot-image {
          width: 100%;
          height: auto;
          display: block;
          margin: 0;
          border: none;
        }

        @media (max-width: 768px) {
          .screenshot-display {
            height: 100vh;
          }
        }
      `}</style>
    </>
  );
}