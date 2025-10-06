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
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  TEAM: '/team',
  ABOUT: '/about',
  SEARCH: '/search',
  
  // Protected routes (require authentication)
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Dashboard routes (authenticated users only)
  DASHBOARD_USERS: '/dashboard/users',
  DASHBOARD_USERS_CREATE: '/dashboard/users/create',
  DASHBOARD_PROJECTS: '/dashboard/projects',
  DASHBOARD_TASKS: '/dashboard/tasks',
  DASHBOARD_COMMENTS: '/dashboard/comments',
  DASHBOARD_ACTIVITY: '/dashboard/activity',
  DASHBOARD_NOTIFICATIONS: '/dashboard/notifications',
  DASHBOARD_TAGS: '/dashboard/tags',
  
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
    ROUTE_PATHS.HOME,
    ROUTE_PATHS.LOGIN,
    ROUTE_PATHS.PROJECTS,
    ROUTE_PATHS.PROJECT_DETAIL,
    ROUTE_PATHS.TEAM,
    ROUTE_PATHS.ABOUT,
    ROUTE_PATHS.SEARCH,
  ],
  
  // Protected routes (authentication required)
  PROTECTED: [
    ROUTE_PATHS.DASHBOARD,
    ROUTE_PATHS.DASHBOARD_USERS,
    ROUTE_PATHS.DASHBOARD_PROJECTS,
    ROUTE_PATHS.DASHBOARD_TASKS,
    ROUTE_PATHS.DASHBOARD_COMMENTS,
    ROUTE_PATHS.DASHBOARD_ACTIVITY,
    ROUTE_PATHS.DASHBOARD_NOTIFICATIONS,
    ROUTE_PATHS.DASHBOARD_TAGS,
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
    [ROUTE_PATHS.HOME]: 'Dashboard',
    [ROUTE_PATHS.PROJECTS]: 'Projects',
    [ROUTE_PATHS.PROJECT_DETAIL]: 'Project Details',
    [ROUTE_PATHS.TEAM]: 'Team',
    [ROUTE_PATHS.ABOUT]: 'About',
    [ROUTE_PATHS.SEARCH]: 'Search',
    [ROUTE_PATHS.DASHBOARD]: 'Dashboard',
    [ROUTE_PATHS.DASHBOARD_USERS]: 'Users',
    [ROUTE_PATHS.DASHBOARD_PROJECTS]: 'Projects',
    [ROUTE_PATHS.DASHBOARD_TASKS]: 'Tasks',
    [ROUTE_PATHS.DASHBOARD_COMMENTS]: 'Comments',
    [ROUTE_PATHS.DASHBOARD_ACTIVITY]: 'Activity',
    [ROUTE_PATHS.DASHBOARD_NOTIFICATIONS]: 'Notifications',
    [ROUTE_PATHS.DASHBOARD_TAGS]: 'Tags',
  },
  
  // Route descriptions for SEO
  DESCRIPTIONS: {
    [ROUTE_PATHS.LOGIN]: 'Sign in to your account',
    [ROUTE_PATHS.HOME]: 'Your personal project dashboard',
    [ROUTE_PATHS.PROJECTS]: 'Explore all projects managed through TaskFlow',
    [ROUTE_PATHS.PROJECT_DETAIL]: 'View detailed information about a specific project',
    [ROUTE_PATHS.TEAM]: 'Meet our talented team members',
    [ROUTE_PATHS.ABOUT]: 'Learn more about TaskFlow platform',
    [ROUTE_PATHS.SEARCH]: 'Search for members, projects, and tasks',
    [ROUTE_PATHS.DASHBOARD]: 'Your personal project dashboard',
    [ROUTE_PATHS.DASHBOARD_USERS]: 'Manage users and team members',
    [ROUTE_PATHS.DASHBOARD_PROJECTS]: 'Manage and track your projects',
    [ROUTE_PATHS.DASHBOARD_TASKS]: 'Manage tasks and assignments',
    [ROUTE_PATHS.DASHBOARD_COMMENTS]: 'Manage comments and discussions',
    [ROUTE_PATHS.DASHBOARD_ACTIVITY]: 'View recent activity and logs',
    [ROUTE_PATHS.DASHBOARD_NOTIFICATIONS]: 'Manage your notifications',
    [ROUTE_PATHS.DASHBOARD_TAGS]: 'Manage task tags and categories',
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
