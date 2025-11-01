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
    GITHUB: 'https://github.com/thangtruong1808',
    LINKEDIN: 'https://www.linkedin.com/in/thang-truong-00b245200/',
    FACEBOOK: 'https://www.facebook.com/profile.php?id=100051753410222',
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
 * Theme variables for consistent theming and improved readability across themes
 */
export const FOOTER_STYLES = {
  // Color schemes using theme variables
  COLORS: {
    borderColor: 'var(--border-color)',
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    textMuted: 'var(--text-muted)',
    textDisabled: 'var(--text-disabled, var(--text-muted))',
    accent: 'var(--accent-from)',
    accentHover: 'var(--accent-from)',
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
    FOCUS_RING: 'focus:outline-none focus:ring-2',
    FOCUS_RING_COLOR: 'var(--accent-ring)',
  },
} as const;
