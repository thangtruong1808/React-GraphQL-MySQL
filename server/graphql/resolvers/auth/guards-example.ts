/**
 * Authentication Guards Example
 * Demonstrates how to use different guard types for role-based access control
 * This file serves as a reference for future development and expansion
 * 
 * SCENARIOS:
 * - Role-based access control: Different permissions for different user roles
 * - Future expansion: Easy to add new protected resolvers
 * - Code organization: Centralized authorization logic
 * - Maintainability: Clear separation of concerns
 */

import { withAuth, withRole, withAdmin, withManager } from '../../../auth/guard';

/**
 * Example: Admin-only operations
 * Only users with ADMIN role can access these resolvers
 * 
 * USAGE: Wrap resolvers that require admin privileges
 * SCENARIOS:
 * - User management: Create, update, delete users
 * - System configuration: Update application settings
 * - Analytics: Access to all system data
 */
export const adminOnlyResolvers = {
  // Example: Get all users (admin only)
  getAllUsers: withAdmin(async (_: any, __: any, context: any) => {
    // Admin guard already validated user has ADMIN role
    // Business logic here
    return [];
  }),

  // Example: Delete user (admin only)
  deleteUser: withAdmin(async (_: any, { userId }: { userId: string }, context: any) => {
    // Admin guard already validated user has ADMIN role
    // Business logic here
    return { success: true };
  }),
};

/**
 * Example: Manager or higher role operations
 * Users with MANAGER or ADMIN role can access these resolvers
 * 
 * USAGE: Wrap resolvers that require manager privileges
 * SCENARIOS:
 * - Project management: Create, update, delete projects
 * - Team management: Assign users to projects
 * - Reporting: Access to team data
 */
export const managerOrHigherResolvers = {
  // Example: Create project (manager or admin)
  createProject: withManager(async (_: any, { input }: { input: any }, context: any) => {
    // Manager guard already validated user has MANAGER or ADMIN role
    // Business logic here
    return { id: '1', name: input.name };
  }),

  // Example: Get team members (manager or admin)
  getTeamMembers: withManager(async (_: any, __: any, context: any) => {
    // Manager guard already validated user has MANAGER or ADMIN role
    // Business logic here
    return [];
  }),
};

/**
 * Example: Specific role requirements
 * Users with specific role levels can access these resolvers
 * 
 * USAGE: Wrap resolvers that require specific role levels
 * SCENARIOS:
 * - Developer tasks: Basic project access
 * - Manager tasks: Team management access
 * - Admin tasks: System-wide access
 */
export const specificRoleResolvers = {
  // Example: Developer can view assigned tasks
  getMyTasks: withRole(async (_: any, __: any, context: any) => {
    // Role guard already validated user has at least DEVELOPER role
    // Business logic here
    return [];
  }, 'DEVELOPER'),

  // Example: Manager can view all project tasks
  getAllProjectTasks: withRole(async (_: any, { projectId }: { projectId: string }, context: any) => {
    // Role guard already validated user has at least MANAGER role
    // Business logic here
    return [];
  }, 'MANAGER'),
};

/**
 * Example: Custom authentication with additional checks
 * Basic authentication with custom business logic
 * 
 * USAGE: Wrap resolvers that need custom validation
 * SCENARIOS:
 * - Resource ownership: Check if user owns the resource
 * - Time-based access: Check if operation is allowed at current time
 * - Feature flags: Check if feature is enabled for user
 */
export const customAuthResolvers = {
  // Example: Update own profile (authenticated users)
  updateMyProfile: withAuth(async (_: any, { input }: { input: any }, context: any) => {
    // Auth guard already validated user is authenticated
    // Additional business logic here (e.g., check if user is updating their own profile)
    return { success: true };
  }, (context: any) => {
    // Custom guard logic
    if (!context.user) {
      throw new Error('Authentication required');
    }
    return context.user;
  }),
};

/**
 * Example: How to integrate guards in main resolvers
 * This shows the pattern for adding guards to new resolvers
 */
export const exampleIntegration = {
  Query: {
    // Basic authentication
    myProfile: withAuth((_, __, context) => context.user, (context) => {
      if (!context.user) throw new Error('Authentication required');
      return context.user;
    }),

    // Role-based access
    adminDashboard: withAdmin((_, __, context) => {
      // Only admins can access this
      return { stats: [] };
    }),

    // Specific role requirement
    managerReports: withRole((_, __, context) => {
      // Only managers and admins can access this
      return { reports: [] };
    }, 'MANAGER'),
  },

  Mutation: {
    // Admin-only mutation
    createUser: withAdmin(async (_, { input }, context) => {
      // Only admins can create users
      return { id: '1', email: input.email };
    }),

    // Manager or higher mutation
    assignProject: withManager(async (_, { projectId, userId }, context) => {
      // Only managers and admins can assign projects
      return { success: true };
    }),
  },
}; 