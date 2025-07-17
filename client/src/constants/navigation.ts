import { User } from '../types/graphql';
import { ROUTES, USER_ROLES } from './index';

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
 * Core navigation items for login feature only
 * Uses centralized route constants for consistency
 */
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: ROUTES.HOME,
    icon: 'home',
    requiresAuth: false,
    description: 'Landing page'
  },
  {
    id: 'login',
    label: 'Login',
    path: ROUTES.LOGIN,
    icon: 'login',
    requiresAuth: false,
    description: 'Sign in to your account'
  }
];

/**
 * Get navigation items for a specific user
 * Filters based on authentication status
 */
export const getNavItemsForUser = (user: User | null): NavItem[] => {
  if (!user) {
    // Show all public routes for unauthenticated users
    return NAV_ITEMS.filter(item => !item.requiresAuth);
  }

  // For authenticated users, show home and hide login
  return NAV_ITEMS.filter(item => {
    if (item.requiresAuth && !user) {
      return false;
    }
    
    // Hide login for authenticated users
    if (user && item.id === 'login') {
      return false;
    }

    return true;
  });
};

/**
 * Get navigation items for mobile menu
 * Simplified version for mobile devices
 */
export const getMobileNavItems = (user: User | null): NavItem[] => {
  return getNavItemsForUser(user);
}; 