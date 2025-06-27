import '../styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Listen for analytics events from iframes (cloned webpages)
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'ANALYTICS_EVENT') {
        try {
          amplitude.track(event.data.eventName, event.data.properties);
          console.log('📊 Received Analytics Event from iframe:', event.data.eventName, event.data.properties);
        } catch (error) {
          console.error('Error tracking iframe analytics event:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Kalam:wght@300;400;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}