import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Mobile() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleTryItNowClick = () => {
    router.push('/mobile-try');
  };

  return (
    <>
      <Head>
        <title>Ask Anything - Mobile</title>
        <meta name="description" content="The perfect AI companion for any website" />
        <link rel="icon" href="/Gist_Mark_000000.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Gist_Mark_000000.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Gist_Mark_000000.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="mobile-app">
        {/* Header Section */}
        <section className={`mobile-header-section ${isLoaded ? 'fade-in' : ''}`}>
          <div className="mobile-container">
            <h1 className="mobile-main-title">
              Introducing<br />
              <span className="highlight-text">Ask<span className="sparkle">✨</span><br />Anything</span>
            </h1>
          </div>
        </section>

        {/* Video + Publishers Section */}
        <section className={`mobile-video-section ${isLoaded ? 'fade-in-delayed' : ''}`}>
          <div className="mobile-container">
            <div className="hero-video">
              <video 
                title="GPA Demo Video"
                controls
                autoPlay
                muted
                loop
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/GPA-basic-demo-gif.mp4" type="video/mp4" />
                <source src="/GPA-basic-demo-gif.webm" type="video/webm" />
                <source src="/GPA%20basic%20demo%20gif.mov" type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
              <div className="publisher-section">
                <p className="publisher-text">Trusted by 500+ publishers</p>
                <div className="publisher-logos">
                  <img src="/publishers-logos-black.png" alt="Trusted Publishers" onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.src = '/publishers-logos.png';
                  }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Try It Now Section */}
        <section className={`mobile-cta-section ${isLoaded ? 'fade-in-delayed-2' : ''}`}>
          <div className="mobile-container">
            <button 
              className="mobile-try-btn"
              onClick={handleTryItNowClick}
            >
              Try It Now
            </button>
          </div>
        </section>

        {/* Content Section */}
        <section className={`mobile-content-section ${isLoaded ? 'fade-in-delayed-3' : ''}`}>
          <div className="mobile-container">
            <h2 className="mobile-subtitle">
              The perfect AI companion for any website.
            </h2>
            <p className="mobile-description">
              Replace your site's search with the Ask Anything™ button and drive AI engagement, grow traffic, and unlock new revenue.
            </p>
          </div>
        </section>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .mobile-app {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 50%, #a855f7 100%);
          color: white;
        }

        .mobile-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
          text-align: center;
        }

        /* Header Section */
        .mobile-header-section {
          padding: 3rem 0 2rem 0;
          text-align: center;
        }

        .mobile-main-title {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1rem;
          color: white;
        }

        .highlight-text {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient 3s ease infinite;
        }

        .sparkle {
          display: inline-block;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
        }

        /* Video Section */
        .mobile-video-section {
          padding: 1rem 0 2rem 0;
        }

        /* Reuse exact hero-video styling from desktop */
        .hero-video {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: visible;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
          margin: 0 auto;
          max-width: 400px;
        }

        .publisher-section {
          margin-top: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          width: 100%;
          position: relative;
          z-index: 1000;
        }

        .publisher-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .publisher-logos {
          text-align: center;
          width: 100%;
          min-height: 80px;
          position: relative;
          z-index: 1000;
          background: transparent;
          pointer-events: auto;
        }

        .publisher-logos img {
          max-width: 100%;
          width: auto;
          height: auto;
          max-height: 90px;
          opacity: 0.8;
          transition: opacity 0.3s ease;
          display: block;
          margin: 0 auto;
          position: relative;
          z-index: 1001;
          filter: brightness(0) invert(1);
        }

        .publisher-logos:hover img {
          opacity: 1;
        }

        /* Try It Now Section */
        .mobile-cta-section {
          padding: 2rem 0;
        }

        .mobile-try-btn {
          background: white;
          color: #6b46c1;
          border: none;
          border-radius: 50px;
          padding: 1.2rem 3rem;
          font-size: 1.3rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          font-family: 'Inter', sans-serif;
        }

        .mobile-try-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          background: #f8f9fa;
        }

        .mobile-try-btn:active {
          transform: translateY(0);
        }

        /* Content Section */
        .mobile-content-section {
          padding: 2rem 0 4rem 0;
        }

        .mobile-subtitle {
          font-size: 1.8rem;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 1.5rem;
          color: white;
        }

        .mobile-description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          max-width: 600px;
          margin: 0 auto;
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

        .fade-in-delayed-3 {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease 0.6s forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .mobile-main-title {
            font-size: 2.5rem;
          }
          
          .mobile-container {
            padding: 0 1rem;
          }
          
          .mobile-try-btn {
            padding: 1rem 2.5rem;
            font-size: 1.2rem;
          }
          
          .hero-video {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}