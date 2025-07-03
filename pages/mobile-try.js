import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function MobileTry() {
  const [targetUrl, setTargetUrl] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [screenshotResult, setScreenshotResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleTryItClick = async () => {
    if (!targetUrl.trim()) {
      alert('Please enter a URL first');
      return;
    }

    setIsCapturingScreenshot(true);
    setScreenshotResult(null);

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: targetUrl,
          options: {
            viewport: { width: 1366, height: 768 },
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

      const screenshotWindow = window.open('', '_blank');
      screenshotWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Screenshot: ${result.url}</title>
          <style>
            body { margin: 0; padding: 0; background: #f0f0f0; }
            .screenshot-container { text-align: center; padding: 20px; }
            .screenshot-img { max-width: 100%; height: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="screenshot-container">
            <img src="${result.screenshotUrl}" alt="Screenshot of ${result.url}" class="screenshot-img" />
          </div>
          <script src="/widget.js"></script>
        </body>
        </html>
      `);
      screenshotWindow.document.close();

    } catch (error) {
      console.error('Screenshot capture failed:', error);
      alert(`Failed to capture screenshot: ${error.message}`);
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  const handleBackClick = () => {
    router.push('/mobile');
  };

  return (
    <>
      <Head>
        <title>Try Ask Anything - Mobile</title>
        <meta name="description" content="Preview Ask Anything on your website" />
        <link rel="icon" href="/Gist_Mark_000000.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Gist_Mark_000000.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Gist_Mark_000000.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="mobile-try-app">
        {/* Header */}
        <section className={`mobile-header ${isLoaded ? 'fade-in' : ''}`}>
          <div className="mobile-container">
            <button className="back-btn" onClick={handleBackClick}>
              ← Back
            </button>
            <h1 className="page-title">Try Ask Anything</h1>
            <p className="page-subtitle">Preview it on your website</p>
          </div>
        </section>

        {/* URL Input Section */}
        <section className={`mobile-input-section ${isLoaded ? 'fade-in-delayed' : ''}`}>
          <div className="mobile-container">
            <div className="input-wrapper">
              <input
                type="text"
                className="url-input"
                placeholder="Enter your website URL"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && targetUrl.trim() && handleTryItClick()}
              />
              <button
                className={`try-btn ${isCapturingScreenshot ? 'capturing' : ''}`}
                onClick={handleTryItClick}
                disabled={!targetUrl.trim() || isCapturingScreenshot}
              >
                {isCapturingScreenshot ? (
                  <>
                    Capturing
                    <span className="button-spinner"></span>
                  </>
                ) : (
                  'Try It'
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Instructions Section */}
        <section className={`mobile-instructions ${isLoaded ? 'fade-in-delayed-2' : ''}`}>
          <div className="mobile-container">
            <div className="instruction-card">
              <h3>How it works:</h3>
              <ol>
                <li>Enter your website URL above</li>
                <li>We'll capture a screenshot of your site</li>
                <li>See Ask Anything™ in action on your page</li>
                <li>Experience AI-powered search for yourself</li>
              </ol>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .mobile-try-app {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 50%, #a855f7 100%);
          color: white;
        }

        .mobile-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Header */
        .mobile-header {
          padding: 2rem 0 1.5rem 0;
          text-align: center;
          position: relative;
        }

        .back-btn {
          position: absolute;
          left: 1.5rem;
          top: 2rem;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 400;
        }

        /* Input Section */
        .mobile-input-section {
          padding: 2rem 0;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .url-input {
          width: 100%;
          padding: 1rem 1.2rem;
          font-size: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .url-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .url-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.15);
        }

        .try-btn {
          width: 100%;
          background: white;
          color: #6b46c1;
          border: none;
          border-radius: 25px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .try-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          background: #f8f9fa;
        }

        .try-btn:active {
          transform: translateY(0);
        }

        .try-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .try-btn.capturing {
          background: #e2e8f0;
          color: #64748b;
        }

        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #cbd5e1;
          border-top: 2px solid #6b46c1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Instructions */
        .mobile-instructions {
          padding: 1.5rem 0 3rem 0;
        }

        .instruction-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          max-width: 400px;
          margin: 0 auto;
          text-align: left;
        }

        .instruction-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }

        .instruction-card ol {
          list-style: none;
          counter-reset: step-counter;
        }

        .instruction-card li {
          counter-increment: step-counter;
          margin-bottom: 0.8rem;
          padding-left: 2rem;
          position: relative;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
        }

        .instruction-card li::before {
          content: counter(step-counter);
          position: absolute;
          left: 0;
          top: 0;
          background: white;
          color: #6b46c1;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
        }

        /* Animations */
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
        }

        .fade-in-delayed {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease 0.2s forwards;
        }

        .fade-in-delayed-2 {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease 0.4s forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .page-title {
            font-size: 2rem;
          }
          
          .mobile-container {
            padding: 0 1rem;
          }
          
          .back-btn {
            left: 1rem;
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }
          
          .input-wrapper {
            max-width: 100%;
          }
          
          .instruction-card {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}