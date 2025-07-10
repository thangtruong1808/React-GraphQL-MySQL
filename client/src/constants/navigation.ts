import { User } from '../types/graphql';
import { ROUTES, USER_ROLES } from './index';

/**
 * Navigation Configuration
 * Defines NavBar items based on user roles and database schema
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
 * Core navigation items based on database schema
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
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
    requiresAuth: true,
    description: 'User overview and quick actions'
  },
  {
    id: 'projects',
    label: 'Projects',
    path: ROUTES.PROJECTS,
    icon: 'folder',
    requiresAuth: true,
    description: 'Manage projects and teams'
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: ROUTES.TASKS,
    icon: 'checklist',
    requiresAuth: true,
    description: 'View and manage tasks'
  },
  {
    id: 'team',
    label: 'Team',
    path: ROUTES.TEAM,
    icon: 'users',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    requiresAuth: true,
    description: 'User management and roles'
  },
  {
    id: 'reports',
    label: 'Reports',
    path: ROUTES.REPORTS,
    icon: 'chart',
    requiresAuth: true,
    description: 'Analytics and insights'
  },
  {
    id: 'activity',
    label: 'Activity',
    path: ROUTES.ACTIVITY,
    icon: 'activity',
    requiresAuth: true,
    description: 'Activity logs and history'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: ROUTES.NOTIFICATIONS,
    icon: 'bell',
    requiresAuth: true,
    description: 'User notifications'
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    path: ROUTES.ADMIN,
    icon: 'settings',
    roles: [USER_ROLES.ADMIN],
    requiresAuth: true,
    description: 'System administration'
  }
];

/**
 * Get navigation items for a specific user
 * Filters based on authentication and user role
 */
export const getNavItemsForUser = (user: User | null): NavItem[] => {
  if (!user) {
    return NAV_ITEMS.filter(item => !item.requiresAuth);
  }

  return NAV_ITEMS.filter(item => {
    // Check if user is authenticated for protected routes
    if (item.requiresAuth && !user) {
      return false;
    }

    // Check role-based access
    if (item.roles && !item.roles.includes(user.role)) {
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
  const allItems = getNavItemsForUser(user);
  
  // Prioritize core items for mobile
  const priorityItems = ['home', 'dashboard', 'projects', 'tasks'];
  
  return allItems.filter(item => 
    priorityItems.includes(item.id) || 
    item.id === 'notifications' // Keep notifications for mobile
  );
}; 