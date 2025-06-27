import React, { useState } from 'react';
import { trackSignUpCompleted, trackGoogleSignUp, trackAppleSignUp, trackGithubSignUp, trackWordPressSignUp, trackDrupalSignUp, trackWixSignUp, trackEvent } from '../utils/analytics';
import { useRouter } from 'next/router';
import URLInputForm from '../components/URLInputForm';

export default function Setup() {
  const [modalOpen, setModalOpen] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState(null);
  const router = useRouter();
  // Helper to push amplitude event and open modal
  const handleButtonClick = (eventName) => (e) => {
    e.preventDefault();
    trackEvent(eventName);
    setModalOpen(true);
  };

  // Amplitude event for URL preview
  const handleUrlPreview = async (url) => {
    setUrlLoading(true);
    setUrlError(null);
    trackEvent('Setup Page URL Preview', { url });
    try {
      // Test if the URL is accessible
      const testResponse = await fetch(`/api/proxy?url=${encodeURIComponent(url)}&test=true`);
      const testResult = await testResponse.json();
      if (!testResponse.ok) {
        throw new Error(testResult.error || 'Unable to reach the specified website');
      }
      setUrlLoading(false);
      window.open(`/api/proxy?url=${encodeURIComponent(url)}`, '_blank');
    } catch (err) {
      setUrlLoading(false);
      setUrlError(err.message);
    }
  };

  return (
    <div className="setup-root centered">
      <div className="setup-shadow-container">
        <div className="signup-form-container centered">
          <div className="signup-logo-container">
            <img src="/gist-logo.png" alt="Gist Logo" className="signup-big-logo" />
          </div>
          <h2 className="signup-title" style={{textAlign: 'center'}}>To Get the Ask Anything Button, Sign Up Below:</h2>
          <form className="signup-form" onSubmit={handleButtonClick('Sign Up Button Clicked')}>
            <label htmlFor="email" className="signup-label">Email</label>
            <input type="email" id="email" className="signup-input reduced-gap" placeholder="you@example.com" required />
            <button type="submit" className="signup-btn" onClick={handleButtonClick('Sign Up Button Clicked')}>Sign Up</button>
          </form>
          <div className="social-signup-divider">or sign up with</div>
          <div className="social-signup-btns">
            <button className="social-btn google" onClick={handleButtonClick('Google Sign Up Clicked')} type="button">Google</button>
            <button className="social-btn apple" onClick={handleButtonClick('Apple Sign Up Clicked')} type="button">Apple</button>
            <button className="social-btn github" onClick={handleButtonClick('GitHub Sign Up Clicked')} type="button">GitHub</button>
            <button className="social-btn wordpress" onClick={handleButtonClick('WordPress Sign Up Clicked')} type="button">WordPress</button>
            <button className="social-btn drupal" onClick={handleButtonClick('Drupal Sign Up Clicked')} type="button">Drupal</button>
            <button className="social-btn wix" onClick={handleButtonClick('Wix Sign Up Clicked')} type="button">Wix</button>
          </div>
          {/* URL Input Pill Box Preview */}
          <div className="setup-url-preview-section">
            <URLInputForm onSubmit={handleUrlPreview} loading={urlLoading} error={urlError} />
          </div>
        </div>
        {modalOpen && (
          <div className="coming-soon-modal-overlay">
            <div className="coming-soon-modal">
              <button className="modal-close-btn" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
              <div className="coming-soon-text">Coming Soon...</div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .setup-root.centered {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f7f8fa;
        }
        .setup-shadow-container {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(60, 60, 90, 0.13), 0 1.5px 6px rgba(60, 60, 90, 0.07);
          padding: 40px 32px 32px 32px;
          max-width: 420px;
          width: 100%;
        }
        .signup-form-container.centered {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .signup-logo-container {
          margin-bottom: 18px;
        }
        .signup-big-logo {
          width: 70px;
          height: 70px;
        }
        .signup-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 18px;
          color: #222;
        }
        .signup-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .signup-label {
          font-size: 1rem;
          font-weight: 500;
          color: #333;
        }
        .signup-input {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          font-size: 1rem;
        }
        .signup-btn {
          background: linear-gradient(90deg, #4B9FE1, #8860D0);
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          padding: 10px 0;
          font-size: 1rem;
          margin-top: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .signup-btn:hover {
          background: linear-gradient(90deg, #8860D0, #4B9FE1);
        }
        .social-signup-divider {
          margin: 18px 0 10px 0;
          color: #888;
          font-size: 0.98rem;
        }
        .social-signup-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          width: 100%;
          justify-content: center;
          margin-bottom: 18px;
        }
        .social-btn {
          flex: 1 1 40%;
          min-width: 120px;
          padding: 10px 0;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          margin-bottom: 0;
        }
        .social-btn.google {
          background: #fff;
          color: #4285F4;
          border: 1.5px solid #4285F4;
        }
        .social-btn.google:hover {
          background: #4285F4;
          color: #fff;
        }
        .social-btn.apple {
          background: #fff;
          color: #111;
          border: 1.5px solid #111;
        }
        .social-btn.apple:hover {
          background: #111;
          color: #fff;
        }
        .social-btn.github {
          background: #fff;
          color: #24292e;
          border: 1.5px solid #24292e;
        }
        .social-btn.github:hover {
          background: #24292e;
          color: #fff;
        }
        .social-btn.wordpress {
          background: #fff;
          color: #21759b;
          border: 1.5px solid #21759b;
        }
        .social-btn.wordpress:hover {
          background: #21759b;
          color: #fff;
        }
        .social-btn.drupal {
          background: #fff;
          color: #0678be;
          border: 1.5px solid #0678be;
        }
        .social-btn.drupal:hover {
          background: #0678be;
          color: #fff;
        }
        .social-btn.wix {
          background: #fff;
          color: #ffbe00;
          border: 1.5px solid #ffbe00;
        }
        .social-btn.wix:hover {
          background: #ffbe00;
          color: #fff;
        }
        .setup-url-preview-section {
          margin-top: 18px;
          width: 100%;
        }
        .coming-soon-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.25);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .coming-soon-modal {
          background: #fff;
          border-radius: 12px;
          padding: 32px 32px 24px 32px;
          box-shadow: 0 8px 32px rgba(60, 60, 90, 0.13), 0 1.5px 6px rgba(60, 60, 90, 0.07);
          position: relative;
          min-width: 320px;
          max-width: 90vw;
        }
        .modal-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #888;
          cursor: pointer;
        }
        .coming-soon-text {
          font-size: 1.2rem;
          color: #333;
          text-align: center;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
}
