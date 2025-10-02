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
    id: 'search',
    label: 'Search',
    path: '#search',
    icon: 'search',
    requiresAuth: false,
    description: 'Search members, projects, and tasks'
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
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'user',
    requiresAuth: true,
    description: 'View your profile'
  },
  {
    id: 'signout',
    label: 'Sign Out',
    path: '/signout',
    icon: 'logout',
    requiresAuth: true,
    description: 'Sign out of your account'
  }
];

/**
 * Get navigation items for desktop navbar
 * Filters based on authentication status - excludes user-specific items
 */
export const getNavItemsForUser = (user: User | null): NavItem[] => {
  if (!user) {
    // Show all public routes for unauthenticated users (Home, Projects, Team, About, Login)
    return NAV_ITEMS.filter(item => !item.requiresAuth);
  }

  // For authenticated users, show only navigation items (no user-specific items)
  return NAV_ITEMS.filter(item => {
    // Hide login for authenticated users
    if (user && item.id === 'login') {
      return false;
    }

    // Hide user-specific items (profile, signout) from desktop navbar
    if (user && (item.id === 'profile' || item.id === 'signout')) {
      return false;
    }

    // Show all items that don't require auth (public items)
    if (!item.requiresAuth) {
      return true;
    }

    // Show dashboard for authenticated users (not profile/signout)
    if (item.requiresAuth && user && item.id === 'dashboard') {
      return true;
    }

    return false;
  });
};

/**
 * Get navigation items for mobile menu
 * Includes user-specific items (profile, signout) for mobile users
 */
export const getMobileNavItems = (user: User | null): NavItem[] => {
  if (!user) {
    // Show all public routes for unauthenticated users (Home, Projects, Team, About, Login)
    return NAV_ITEMS.filter(item => !item.requiresAuth);
  }

  // For authenticated users, show all items except profile (not implemented yet)
  return NAV_ITEMS.filter(item => {
    // Hide login for authenticated users
    if (user && item.id === 'login') {
      return false;
    }

    // Hide profile for authenticated users (not implemented yet)
    if (user && item.id === 'profile') {
      return false;
    }

    // Show all items that don't require auth (public items)
    if (!item.requiresAuth) {
      return true;
    }

    // Show signout for authenticated users
    if (item.requiresAuth && user && item.id === 'signout') {
      return true;
    }

    // Show dashboard for authenticated users
    if (item.requiresAuth && user && item.id === 'dashboard') {
      return true;
    }

    return false;
  });
}; 