/**
 * Analytics utility for Amplitude event tracking
 * Centralizes all event tracking for GistPoweredAnswers application
 */

import * as amplitude from '@amplitude/analytics-browser';

/**
 * Track an event with Amplitude
 * @param {string} eventName - The name of the event
 * @param {object} properties - Event properties/parameters
 */
export const trackEvent = (eventName, properties = {}) => {
  try {
    // Add default properties
    const eventProperties = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...properties
    };

    amplitude.track(eventName, eventProperties);
    
    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventName, eventProperties);
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

/**
 * Track "Try It Clicked" event
 * @param {string} location - Where the button was clicked (hero, final-cta)
 * @param {string} url - The URL entered by the user
 */
export const trackTryItClicked = (location, url) => {
  trackEvent('Try It Clicked', {
    location,
    url,
    button_type: 'try_it'
  });
};

/**
 * Track "Get Started Clicked" event
 * @param {string} location - Where the button was clicked (hero, final-cta)
 */
export const trackGetStartedClicked = (location) => {
  trackEvent('Get Started Clicked', {
    location,
    button_type: 'get_started'
  });
};

/**
 * Track "Sign In" event
 */
export const trackSignInClicked = () => {
  trackEvent('Sign In', {
    button_type: 'sign_in'
  });
};

/**
 * Track "Next Clicked" event on cloned webpages
 */
export const trackNextClicked = () => {
  trackEvent('Next Clicked', {
    button_type: 'next',
    context: 'cloned_webpage_panel'
  });
};

/**
 * Track "Generate Clicked" event on setup page
 * @param {object} formData - The form data submitted
 */
export const trackGenerateClicked = (formData) => {
  trackEvent('Generate Clicked', {
    website_url: formData.websiteUrl,
    user_name: formData.name,
    user_email: formData.email,
    tools_selected: formData.tools,
    button_type: 'generate'
  });
};

/**
 * Track CMS platform clicked events
 * @param {string} cmsName - The name of the CMS platform (WordPress, Shopify, etc.)
 */
export const trackCMSClicked = (cmsName) => {
  trackEvent(`${cmsName} Clicked`, {
    cms_platform: cmsName.toLowerCase(),
    button_type: 'cms_integration'
  });
};

/**
 * Track "Sign Up Clicked" event on setup page
 */
export const trackSignUpClicked = () => {
  console.debug('[Amplitude] Event: Sign Up Clicked', { button_type: 'sign_up', context: 'setup_page' });
  trackEvent('Sign Up Clicked', {
    button_type: 'sign_up',
    context: 'setup_page'
  });
};

/**
 * Track "Google Sign Up Clicked" event on setup page
 */
export const trackGoogleSignUpClicked = () => {
  console.debug('[Amplitude] Event: Google Sign Up Clicked', { button_type: 'google_sign_up', context: 'setup_page' });
  trackEvent('Google Sign Up Clicked', {
    button_type: 'google_sign_up',
    context: 'setup_page'
  });
};

/**
 * Track "Apple Sign Up Clicked" event on setup page
 */
export const trackAppleSignUpClicked = () => {
  console.debug('[Amplitude] Event: Apple Sign Up Clicked', { button_type: 'apple_sign_up', context: 'setup_page' });
  trackEvent('Apple Sign Up Clicked', {
    button_type: 'apple_sign_up',
    context: 'setup_page'
  });
};

/**
 * Track "GitHub Sign Up Clicked" event on setup page
 */
export const trackGithubSignUpClicked = () => {
  console.debug('[Amplitude] Event: GitHub Sign Up Clicked', { button_type: 'github_sign_up', context: 'setup_page' });
  trackEvent('GitHub Sign Up Clicked', {
    button_type: 'github_sign_up',
    context: 'setup_page'
  });
};

/**
 * Initialize analytics tracking
 */
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    // Analytics is already initialized in _app.js, but we can add additional setup here if needed
    console.log('Analytics utility loaded');
  }
}; 