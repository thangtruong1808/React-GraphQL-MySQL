/**
 * Routing Constants
 * Centralized configuration for all routing-related constants
 * Follows best practices for maintainability and consistency
 */

/**
 * Route Paths
 * Defines all application route paths
 */
export const ROUTE_PATHS = {
  // Public routes (accessible without authentication)
  LOGIN: '/login',
  
  // Protected routes (require authentication)
  HOME: '/',
  
  // API routes
  GRAPHQL: '/graphql',
  HEALTH: '/health',
} as const;

/**
 * Route Protection Levels
 * Defines which routes require authentication
 */
export const ROUTE_PROTECTION = {
  // Public routes (no authentication required)
  PUBLIC: [
    ROUTE_PATHS.LOGIN,
  ],
  
  // Protected routes (authentication required)
  PROTECTED: [
    ROUTE_PATHS.HOME,
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
    [ROUTE_PATHS.HOME]: 'Home',
  },
  
  // Route descriptions for SEO
  DESCRIPTIONS: {
    [ROUTE_PATHS.LOGIN]: 'Sign in to your account',
    [ROUTE_PATHS.HOME]: 'Welcome to the application',
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

/**
 * Route Error Messages
 * Centralized error messages for routing scenarios
 */
export const ROUTE_ERROR_MESSAGES = {
  // Authentication errors
  ACCESS_DENIED: 'Access denied. Please log in to continue.',
  UNAUTHORIZED: 'You are not authorized to access this page.',
  
  // Navigation errors
  PAGE_NOT_FOUND: 'Page not found.',
  NAVIGATION_FAILED: 'Navigation failed. Please try again.',
  
  // General errors
  UNKNOWN_ROUTE_ERROR: 'An unexpected error occurred during navigation.',
} as const;

/**
 * Route Success Messages
 * Centralized success messages for routing scenarios
 */
export const ROUTE_SUCCESS_MESSAGES = {
  // Navigation
  NAVIGATION_SUCCESS: 'Navigation completed successfully',
  
  // Authentication
  LOGIN_REDIRECT: 'Redirecting to login page...',
  HOME_REDIRECT: 'Redirecting to home page...',
} as const;
