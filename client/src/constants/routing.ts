/**
 * Routing Configuration Constants
 * Defines route paths, protection levels, and navigation settings
 * Centralized configuration for maintainability and consistency
 */

/**
 * Route Paths
 * Defines all application route paths
 */
export const ROUTE_PATHS = {
  // Public routes (accessible without authentication)
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Protected routes (require authentication)
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // API routes
  GRAPHQL: '/graphql',
  HEALTH: '/health',
  
  // Fallback route
  NOT_FOUND: '/404',
} as const;

/**
 * Route Protection Levels
 * Defines which routes require authentication
 */
export const ROUTE_PROTECTION = {
  // Public routes (no authentication required)
  PUBLIC: [
    ROUTE_PATHS.LOGIN,
    ROUTE_PATHS.REGISTER,
    ROUTE_PATHS.FORGOT_PASSWORD,
    ROUTE_PATHS.RESET_PASSWORD,
  ],
  
  // Protected routes (authentication required)
  PROTECTED: [
    ROUTE_PATHS.HOME,
    ROUTE_PATHS.DASHBOARD,
    ROUTE_PATHS.PROFILE,
    ROUTE_PATHS.SETTINGS,
  ],
  
  // API routes (no protection needed)
  API: [
    ROUTE_PATHS.GRAPHQL,
    ROUTE_PATHS.HEALTH,
  ],
} as const;

/**
 * Route Configuration
 * Defines route metadata and behavior
 */
export const ROUTE_CONFIG = {
  // Default redirect paths
  DEFAULT_AUTHENTICATED_ROUTE: ROUTE_PATHS.HOME,
  DEFAULT_UNAUTHENTICATED_ROUTE: ROUTE_PATHS.LOGIN,
  
  // Route titles for navigation
  TITLES: {
    [ROUTE_PATHS.LOGIN]: 'Login',
    [ROUTE_PATHS.REGISTER]: 'Register',
    [ROUTE_PATHS.FORGOT_PASSWORD]: 'Forgot Password',
    [ROUTE_PATHS.RESET_PASSWORD]: 'Reset Password',
    [ROUTE_PATHS.HOME]: 'Home',
    [ROUTE_PATHS.DASHBOARD]: 'Dashboard',
    [ROUTE_PATHS.PROFILE]: 'Profile',
    [ROUTE_PATHS.SETTINGS]: 'Settings',
    [ROUTE_PATHS.NOT_FOUND]: 'Page Not Found',
  },
  
  // Route descriptions for SEO
  DESCRIPTIONS: {
    [ROUTE_PATHS.LOGIN]: 'Sign in to your account',
    [ROUTE_PATHS.REGISTER]: 'Create a new account',
    [ROUTE_PATHS.FORGOT_PASSWORD]: 'Reset your password',
    [ROUTE_PATHS.RESET_PASSWORD]: 'Set your new password',
    [ROUTE_PATHS.HOME]: 'Welcome to the application',
    [ROUTE_PATHS.DASHBOARD]: 'View your dashboard',
    [ROUTE_PATHS.PROFILE]: 'Manage your profile',
    [ROUTE_PATHS.SETTINGS]: 'Application settings',
    [ROUTE_PATHS.NOT_FOUND]: 'Page not found',
  },
} as const;

/**
 * Navigation Configuration
 * Defines navigation behavior and settings
 */
export const NAVIGATION_CONFIG = {
  // Redirect behavior
  REDIRECT_REPLACE: true, // Use replace instead of push for redirects
  
  // Scroll behavior
  SCROLL_TO_TOP: true, // Scroll to top on route change
  
  // Loading states
  SHOW_LOADING_ON_NAVIGATION: true, // Show loading during navigation
  
  // Route change delay
  ROUTE_CHANGE_DELAY: 100, // Delay in milliseconds for route changes
} as const; 