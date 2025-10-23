/**
 * Footer Constants
 * Centralized configuration for footer behavior, styling, and content
 */

/**
 * Footer UI Configuration
 * Controls footer behavior and appearance
 */
export const FOOTER_UI = {
  // Animation and interaction settings
  HOVER_TRANSITION_DURATION: 300, // Duration for hover transitions in milliseconds
  SMOOTH_SCROLL_BEHAVIOR: 'smooth', // Smooth scroll behavior for internal links
  
  // Display settings
  SHOW_USER_CONTEXT: true, // Show user information in footer
  SHOW_SOCIAL_LINKS: true, // Show social media links
  SHOW_SYSTEM_STATUS: true, // Show system status indicator
  
  // Responsive breakpoints
  MOBILE_BREAKPOINT: 'md', // Breakpoint for mobile/desktop layout changes
} as const;

/**
 * Footer Links Configuration
 * External links and URLs used in footer
 */
export const FOOTER_LINKS = {
  // Social Media Links
  SOCIAL: {
    GITHUB: 'https://github.com',
    LINKEDIN: 'https://linkedin.com',
    TWITTER: 'https://twitter.com',
  },
  
  // Resource Links
  RESOURCES: {
    DOCUMENTATION: 'https://docs.taskflow.com',
    HELP_CENTER: 'https://help.taskflow.com',
    API_REFERENCE: 'https://api.taskflow.com',
    SYSTEM_STATUS: 'https://status.taskflow.com',
  },
  
  // Legal Links
  LEGAL: {
    PRIVACY_POLICY: 'https://taskflow.com/privacy',
    TERMS_OF_SERVICE: 'https://taskflow.com/terms',
  },
} as const;

/**
 * Footer Content Configuration
 * Text content and messages displayed in footer
 */
export const FOOTER_CONTENT = {
  // Company Information
  COMPANY: {
    NAME: 'TaskFlow',
    DESCRIPTION: 'Professional project management and task tracking platform designed for modern development teams.',
    LOGO_LETTER: 'T',
  },
  
  // User Context Messages
  USER_CONTEXT: {
    GUEST_MESSAGE: 'Get started with TaskFlow today',
    DASHBOARD_LINK: 'Go to Dashboard',
    SIGN_IN_LINK: 'Sign In',
  },
  
  // System Status
  SYSTEM_STATUS: {
    OPERATIONAL: 'All systems operational',
    TECHNOLOGIES: 'Built with React, GraphQL & MySQL',
  },
  
  // Copyright
  COPYRIGHT: {
    BASE_TEXT: 'All rights reserved.',
    CURRENT_YEAR: new Date().getFullYear(),
  },
} as const;

/**
 * Footer Styling Configuration
 * CSS classes and styling constants
 */
export const FOOTER_STYLES = {
  // Color schemes
  COLORS: {
    BACKGROUND: 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900',
    BORDER: 'border-gray-700',
    TEXT_PRIMARY: 'text-white',
    TEXT_SECONDARY: 'text-gray-300',
    TEXT_MUTED: 'text-gray-400',
    TEXT_DISABLED: 'text-gray-500',
    ACCENT: 'text-purple-400',
    ACCENT_HOVER: 'hover:text-purple-400',
  },
  
  // Layout classes
  LAYOUT: {
    CONTAINER: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    GRID: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
    FLEX_CENTER: 'flex items-center justify-center',
    FLEX_BETWEEN: 'flex flex-col md:flex-row justify-between items-center',
  },
  
  // Interactive elements
  INTERACTIVE: {
    TRANSITION: 'transition-colors duration-300',
    HOVER_SHADOW: 'hover:shadow-md',
    FOCUS_RING: 'focus:outline-none focus:ring-2 focus:ring-purple-500',
  },
} as const;
