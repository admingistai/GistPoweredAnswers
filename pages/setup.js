import React from 'react';
import { trackSignUpCompleted, trackGoogleSignUp, trackAppleSignUp, trackGithubSignUp, trackWordPressSignUp, trackDrupalSignUp, trackWixSignUp } from '../utils/analytics';
import { useRouter } from 'next/router';

export default function Setup() {
  const router = useRouter();
  return (
    <div className="setup-root centered">
      <div className="signup-form-container centered">
        <div className="signup-logo-container">
          <img src="/gist-logo.png" alt="Gist Logo" className="signup-big-logo" />
        </div>
        <h2 className="signup-title" style={{textAlign: 'center'}}>To Get the Ask Anything Button, Sign Up Below:</h2>
        <form className="signup-form" onSubmit={e => { 
          e.preventDefault(); 
          const email = e.target.email.value;
          const name = e.target.fullname.value;
          trackSignUpCompleted(email); 
          router.push('/dashboard'); 
        }}>
          <label htmlFor="fullname" className="signup-label">Full Name</label>
          <input type="text" id="fullname" className="signup-input reduced-gap" placeholder="Your Full Name" required />
          <label htmlFor="email" className="signup-label">Email</label>
          <input type="email" id="email" className="signup-input reduced-gap" placeholder="you@example.com" required />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <div className="social-signup-divider">or sign up with</div>
        <div className="social-signup-btns">
          <button className="social-btn google" onClick={trackGoogleSignUp} type="button">Google</button>
          <button className="social-btn apple" onClick={trackAppleSignUp} type="button">Apple</button>
          <button className="social-btn github" onClick={trackGithubSignUp} type="button">GitHub</button>
          <button className="social-btn wordpress" onClick={trackWordPressSignUp} type="button">WordPress</button>
          <button className="social-btn drupal" onClick={trackDrupalSignUp} type="button">Drupal</button>
          <button className="social-btn wix" onClick={trackWixSignUp} type="button">Wix</button>
        </div>
      </div>
      <style jsx>{`
        .setup-root.centered {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(120deg, #f7f8fa 0%, #fafdff 100%);
        }
        .signup-form-container.centered {
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
          padding: 36px 18px 32px 18px;
          background: rgba(255,255,255,0.98);
          border-radius: 18px;
          box-shadow: 0 2px 16px rgba(80,120,200,0.07);
          display: flex;
          flex-direction: column;
          align-items: center;
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
        .signup-title {
          font-size: 1.5rem;
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
          flex-wrap: wrap;
          gap: 10px;
          width: 100%;
          justify-content: center;
        }
        .social-btn {
          flex: 1 1 40%;
          min-width: 120px;
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
      `}</style>
    </div>
  );
}
