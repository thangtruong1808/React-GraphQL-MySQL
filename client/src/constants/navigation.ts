import { User } from '../types/graphql';
import { ROUTE_PATHS } from './routingConstants';

/**
 * Navigation Configuration
 * Defines NavBar items for the minimal login feature application
 */

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  roles?: string[];
  requiresAuth: boolean;
  description?: string;
}

/**
 * Core navigation items for TaskFlow project management platform
 * Uses centralized route constants for consistency
 */
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: ROUTE_PATHS.HOME,
    icon: 'home',
    requiresAuth: false,
    description: 'Discover TaskFlow platform'
  },
  {
    id: 'projects',
    label: 'Projects',
    path: ROUTE_PATHS.PROJECTS,
    icon: 'folder',
    requiresAuth: false,
    description: 'Explore all projects'
  },
  {
    id: 'team',
    label: 'Team',
    path: ROUTE_PATHS.TEAM,
    icon: 'users',
    requiresAuth: false,
    description: 'Meet our team members'
  },
  {
    id: 'about',
    label: 'About',
    path: ROUTE_PATHS.ABOUT,
    icon: 'info',
    requiresAuth: false,
    description: 'Learn about TaskFlow'
  },
  {
    id: 'login',
    label: 'Login',
    path: ROUTE_PATHS.LOGIN,
    icon: 'login',
    requiresAuth: false,
    description: 'Sign in to your account'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTE_PATHS.DASHBOARD,
    icon: 'dashboard',
    requiresAuth: true,
    description: 'Your project dashboard'
  }
];

/**
 * Get navigation items for a specific user
 * Filters based on authentication status and user role
 */
export const getNavItemsForUser = (user: User | null): NavItem[] => {
  if (!user) {
    // Show all public routes for unauthenticated users (Projects, Team, About, Login)
    return NAV_ITEMS.filter(item => !item.requiresAuth && item.id !== 'home');
  }

  // For authenticated users, show dashboard and hide login
  return NAV_ITEMS.filter(item => {
    if (item.requiresAuth && !user) {
      return false;
    }
    
    // Hide login for authenticated users
    if (user && item.id === 'login') {
      return false;
    }

    // Show dashboard for authenticated users
    if (user && item.id === 'dashboard') {
      return true;
    }

    // Show public items for authenticated users
    return !item.requiresAuth;
  });
};

/**
 * Get navigation items for mobile menu
 * Simplified version for mobile devices
 */
export const getMobileNavItems = (user: User | null): NavItem[] => {
  return getNavItemsForUser(user);
}; 