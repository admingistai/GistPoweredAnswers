/**
 * Analytics utility for Amplitude event tracking
 * Centralizes all event tracking for GistPoweredAnswers application
 */

import * as amplitude from '@amplitude/analytics-browser';

// Initialize Amplitude with API key from environment variable
const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
if (apiKey) {
  amplitude.init(apiKey, undefined, {
    defaultTracking: true,
  });
  console.log('[Amplitude] Initialized');
} else {
  console.warn('[Amplitude] API key is missing! Amplitude will not be initialized.');
}

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
    
    // Log for debugging
    console.log('📊 Analytics Event:', eventName, eventProperties);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

/**
 * Track "Get Started Clicked" event on home page
 * @param {string} location - Where the button was clicked (hero, final-cta, header)
 */
export const trackGetStartedClicked = (location) => {
  trackEvent('Get Started Clicked', {
    location,
    button_type: 'get_started'
  });
};

/**
 * Track "Preview Created" event when user tries a URL
 * @param {string} url - The URL entered by the user
 * @param {string} location - Where the action was triggered from
 */
export const trackPreviewCreated = (url, location = 'home') => {
  trackEvent('Preview Created', {
    url,
    location,
    button_type: 'try_it'
  });
};

/**
 * Track "Sign Up Completed" event on setup page
 * @param {string} email - User's email (optional)
 */
export const trackSignUpCompleted = (email) => {
  trackEvent('Sign Up Completed', {
    email: email || '',
    auth_method: 'email',
    page: 'setup'
  });
};

/**
 * Track "Google Sign Up" event on setup page
 */
export const trackGoogleSignUp = () => {
  trackEvent('Google Sign Up', {
    auth_method: 'google',
    page: 'setup'
  });
};

/**
 * Track "Apple Sign Up" event on setup page
 */
export const trackAppleSignUp = () => {
  trackEvent('Apple Sign Up', {
    auth_method: 'apple',
    page: 'setup'
  });
};

/**
 * Track "GitHub Sign Up" event on setup page
 */
export const trackGithubSignUp = () => {
  trackEvent('GitHub Sign Up', {
    auth_method: 'github',
    page: 'setup'
  });
};

/**
 * Track "Widget Size Changed" event on cloned webpage side panel
 * @param {string} size - The size selected (small, medium, large)
 */
export const trackWidgetSizeChanged = (size) => {
  trackEvent('Widget Size Changed', {
    size,
    feature: 'appearance',
    panel: 'side_panel'
  });
};

/**
 * Track "Widget Style Changed" event on cloned webpage side panel
 * @param {string} style - The style selected (default, match)
 */
export const trackWidgetStyleChanged = (style) => {
  trackEvent('Widget Style Changed', {
    style,
    feature: 'appearance',
    panel: 'side_panel'
  });
};

/**
 * Track "Content Source Toggled" event on cloned webpage side panel
 * @param {string} source - The content source toggled
 * @param {boolean} enabled - Whether it was enabled or disabled
 */
export const trackContentSourceToggled = (source, enabled) => {
  trackEvent('Content Source Toggled', {
    source,
    enabled,
    feature: 'content',
    panel: 'side_panel'
  });
};

/**
 * Track "Goal Slider Changed" event on cloned webpage side panel
 * @param {number} value - The slider value (0-100)
 * @param {string} goal - The goal type (engagement, growth, monetization)
 */
export const trackGoalSliderChanged = (value, goal) => {
  trackEvent('Goal Slider Changed', {
    value,
    goal,
    feature: 'goals',
    panel: 'side_panel'
  });
};

/**
 * Track "Goal Feature Toggled" event on cloned webpage side panel
 * @param {string} feature - The feature toggled
 * @param {boolean} enabled - Whether it was enabled or disabled
 */
export const trackGoalFeatureToggled = (feature, enabled) => {
  trackEvent('Goal Feature Toggled', {
    feature,
    enabled,
    feature_type: 'goals',
    panel: 'side_panel'
  });
};

/**
 * Track "Panel Section Toggled" event on cloned webpage side panel
 * @param {string} section - The section toggled (appearance, content, goals)
 * @param {boolean} expanded - Whether it was expanded or collapsed
 */
export const trackPanelSectionToggled = (section, expanded) => {
  trackEvent('Panel Section Toggled', {
    section,
    expanded,
    panel: 'side_panel'
  });
};

/**
 * Track "Side Panel Toggled" event on cloned webpage
 * @param {boolean} open - Whether the panel was opened or closed
 */
export const trackSidePanelToggled = (open) => {
  trackEvent('Side Panel Toggled', {
    open,
    panel: 'side_panel'
  });
};

/**
 * Track "Next Clicked" event on cloned webpage side panel
 */
export const trackNextClicked = () => {
  trackEvent('Next Clicked', {
    button_type: 'next',
    context: 'cloned_webpage_panel'
  });
};

/**
 * Initialize analytics tracking
 */
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    console.log('Analytics utility loaded');
  }
}; 