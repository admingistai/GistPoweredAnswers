import React from 'react';
import { trackSignUpClicked, trackGoogleSignUpClicked, trackAppleSignUpClicked, trackGithubSignUpClicked } from '../utils/analytics';
import { useRouter } from 'next/router';

export default function Setup() {
  const router = useRouter();
  return (
    <div className="setup-root">
      <div className="setup-left">
        <div className="signup-form-container">
          <div className="signup-logo-container">
            <img src="/gist-logo.png" alt="Gist Logo" className="signup-big-logo" />
          </div>
          <h2 className="signup-title">Sign Up</h2>
          <form className="signup-form" onSubmit={e => { e.preventDefault(); trackSignUpClicked(); router.push('/dashboard'); }}>
            <label htmlFor="email" className="signup-label">Email</label>
            <input type="email" id="email" className="signup-input reduced-gap" placeholder="you@example.com" required />
            <label htmlFor="password" className="signup-label">Password</label>
            <input type="password" id="password" className="signup-input reduced-gap" placeholder="Password" required />
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
          <div className="social-signup-divider">or sign up with</div>
          <div className="social-signup-btns">
            <button className="social-btn google" onClick={trackGoogleSignUpClicked} type="button">Google</button>
            <button className="social-btn apple" onClick={trackAppleSignUpClicked} type="button">Apple</button>
            <button className="social-btn github" onClick={trackGithubSignUpClicked} type="button">GitHub</button>
          </div>
        </div>
      </div>
      <div className="setup-right">
        <div className="signup-preview-bg">
          <div className="signup-preview-card">
            <div className="signup-widget-mockup-large">
              <div className="widget-pill-large">
                <img src="/gist-logo.png" alt="Gist Logo" className="widget-logo-large" />
                <span className="widget-text-large">Ask Anything<sup style={{fontSize: '0.7em'}}>™</sup></span>
                <span className="widget-mic-large" role="img" aria-label="mic">🎤</span>
              </div>
              <div className="widget-glow-anim"></div>
            </div>
            <div className="signup-preview-desc-large">Upgrade your site today.</div>
            <div className="floating-blob blob1"></div>
            <div className="floating-blob blob2"></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .setup-root {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(120deg, #f7f8fa 0%, #fafdff 100%);
          position: relative;
        }
        .background-art {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
        }
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.18;
          pointer-events: none;
        }
        .bg-blob1 {
          width: 420px;
          height: 420px;
          background: linear-gradient(120deg, #FF8C42 0%, #4B9FE1 100%);
          left: -120px;
          top: -120px;
        }
        .bg-blob2 {
          width: 320px;
          height: 320px;
          background: linear-gradient(120deg, #8860D0 0%, #4B9FE1 100%);
          right: -100px;
          bottom: -80px;
        }
        .bg-blob3 {
          width: 180px;
          height: 180px;
          background: linear-gradient(120deg, #4B9FE1 0%, #FF8C42 100%);
          left: 60vw;
          top: 60vh;
        }
        .setup-left {
          width: 33.33%;
          min-width: 320px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 0 16px rgba(80,120,200,0.04);
          z-index: 2;
        }
        .signup-logo-container {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 0;
          margin-bottom: 12px;
        }
        .signup-big-logo {
          width: 92px;
          height: 92px;
          object-fit: contain;
          filter: drop-shadow(0 4px 24px #4B9FE133);
        }
        .signup-form-container {
          width: 100%;
          max-width: 340px;
          padding: 36px 18px 32px 18px;
          background: rgba(255,255,255,0.98);
          border-radius: 18px;
          box-shadow: 0 2px 16px rgba(80,120,200,0.07);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .signup-title {
          font-size: 2rem;
          font-weight: 700;
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
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 2px;
          color: #444;
        }
        .signup-input {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 7px;
          font-size: 15px;
          margin-bottom: 6px;
        }
        .signup-btn {
          width: 100%;
          padding: 11px 0;
          background: linear-gradient(90deg, #FF8C42, #4B9FE1, #8860D0);
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 7px;
          margin-top: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(75,159,225,0.08);
          transition: background 0.2s, color 0.2s;
        }
        .signup-btn:hover {
          background: linear-gradient(90deg, #FF8C42, #4B9FE1, #8860D0);
          color: #fff;
        }
        .social-signup-divider {
          margin: 10px 0 8px 0;
          color: #888;
          font-size: 14px;
          text-align: center;
        }
        .social-signup-btns {
          display: flex;
          gap: 10px;
          width: 100%;
          justify-content: center;
        }
        .social-btn {
          flex: 1;
          padding: 9px 0;
          border-radius: 7px;
          border: 1px solid #e0e0e0;
          background: #fafbfc;
          color: #333;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border 0.2s;
        }
        .social-btn:hover {
          background: #f1f1f9;
          color: #222;
          border-color: #bdbdbd;
        }
        .setup-right {
          width: 66.67%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(120deg, #fafdff 0%, #f7f8fa 100%);
          position: relative;
          overflow: hidden;
        }
        .signup-preview-bg {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .signup-preview-card {
          position: relative;
          width: 520px;
          min-height: 340px;
          background: rgba(255,255,255,0.85);
          border-radius: 38px;
          box-shadow: 0 8px 48px 0 rgba(80,120,200,0.13), 0 1.5px 8px 0 rgba(80,120,200,0.07);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 36px 44px 36px;
          overflow: visible;
        }
        .signup-widget-mockup-large {
          position: relative;
          width: 370px;
          height: 74px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .widget-pill-large {
          width: 100%;
          height: 74px;
          background: linear-gradient(90deg, #FF8C42, #4B9FE1, #8860D0);
          border-radius: 37px;
          box-shadow: 0 4px 32px 0 rgba(75,159,225,0.18);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 38px 0 22px;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          position: relative;
          z-index: 2;
        }
        .widget-logo-large {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #fff;
          margin-right: 18px;
        }
        .widget-text-large {
          font-size: 1.45rem;
          font-weight: 700;
          color: #fff;
          margin-right: 18px;
        }
        .widget-mic-large {
          font-size: 1.5rem;
          margin-left: 8px;
        }
        .widget-glow-anim {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 340px;
          height: 60px;
          background: radial-gradient(circle, #4B9FE1 0%, #fff 80%);
          opacity: 0.18;
          filter: blur(18px);
          transform: translate(-50%, -50%);
          z-index: 1;
          pointer-events: none;
        }
        .signup-preview-desc-large {
          font-size: 1.25rem;
          color: #7a869a;
          font-style: italic;
          margin-top: 18px;
          text-align: center;
        }
        .floating-blob {
          position: absolute;
          border-radius: 50%;
          opacity: 0.18;
          filter: blur(18px);
          z-index: 0;
          pointer-events: none;
          animation: floatBlob 7s ease-in-out infinite alternate;
        }
        .blob1 {
          width: 120px;
          height: 120px;
          background: linear-gradient(120deg, #FF8C42 0%, #4B9FE1 100%);
          left: -60px;
          top: 40px;
          animation-delay: 0s;
        }
        .blob2 {
          width: 90px;
          height: 90px;
          background: linear-gradient(120deg, #8860D0 0%, #4B9FE1 100%);
          right: -40px;
          bottom: 30px;
          animation-delay: 2.5s;
        }
        @keyframes floatBlob {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-18px) scale(1.08); }
        }
        @media (max-width: 900px) {
          .setup-root { flex-direction: column; }
          .setup-left, .setup-right { width: 100%; min-width: 0; }
          .signup-preview-card { width: 98vw; min-height: 220px; padding: 32px 8px 24px 8px; }
          .signup-widget-mockup-large { width: 90vw; height: 54px; }
          .widget-pill-large { height: 54px; font-size: 1.1rem; padding: 0 18px 0 10px; }
          .widget-logo-large { width: 32px; height: 32px; margin-right: 8px; }
          .widget-text-large { font-size: 1rem; margin-right: 8px; }
          .widget-mic-large { font-size: 1rem; margin-left: 4px; }
          .widget-glow-anim { width: 90vw; height: 30px; }
        }
      `}</style>
      <div className="background-art">
        <div className="bg-blob bg-blob1"></div>
        <div className="bg-blob bg-blob2"></div>
        <div className="bg-blob bg-blob3"></div>
      </div>
    </div>
  );
}
