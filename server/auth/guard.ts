import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../graphql/context';
import { requireAuth, requireRole, requirePermission, requireProjectRole } from './permissions';
import { AUTHZ_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Authentication Guard
 * Provides middleware functions for protecting GraphQL resolvers and routes
 */

/**
 * Guard function that requires authentication
 * @param context - GraphQL context
 * @returns User object if authenticated
 */
export const authGuard = (context: GraphQLContext) => {
  return requireAuth(context);
};

/**
 * Guard function that requires specific role
 * @param requiredRole - Minimum required role
 * @returns Function that takes context and returns user if authorized
 */
export const roleGuard = (requiredRole: keyof typeof AUTHZ_CONFIG.ROLES) => {
  return (context: GraphQLContext) => {
    return requireRole(context, requiredRole);
  };
};

/**
 * Guard function that requires admin role
 * @param context - GraphQL context
 * @returns User object if admin
 */
export const adminGuard = (context: GraphQLContext) => {
  return requireRole(context, 'ADMIN');
};

/**
 * Guard function that requires manager or higher role
 * @param context - GraphQL context
 * @returns User object if manager or admin
 */
export const managerGuard = (context: GraphQLContext) => {
  return requireRole(context, 'MANAGER');
};

/**
 * Guard function that requires permission on specific resource
 * @param resourceType - Type of resource
 * @param resourceId - Resource ID (can be from args or context)
 * @param requiredPermission - Required permission level
 * @returns Function that takes context and returns user if authorized
 */
export const permissionGuard = (
  resourceType: 'PROJECT' | 'TASK' | 'COMMENT',
  resourceId: (args: any, context: GraphQLContext) => number,
  requiredPermission: keyof typeof AUTHZ_CONFIG.PERMISSIONS
) => {
  return async (context: GraphQLContext, args: any) => {
    const id = resourceId(args, context);
    return await requirePermission(context, resourceType, id, requiredPermission);
  };
};

/**
 * Guard function that requires project role
 * @param projectId - Project ID (can be from args or context)
 * @param requiredRole - Required project role
 * @returns Function that takes context and returns user if authorized
 */
export const projectRoleGuard = (
  projectId: (args: any, context: GraphQLContext) => number,
  requiredRole: keyof typeof AUTHZ_CONFIG.PROJECT_ROLES
) => {
  return async (context: GraphQLContext, args: any) => {
    const id = projectId(args, context);
    return await requireProjectRole(context, id, requiredRole);
  };
};

/**
 * Higher-order function that wraps resolver with authentication guard
 * @param resolver - Original resolver function
 * @param guard - Guard function to apply
 * @returns Wrapped resolver with authentication
 */
export const withAuth = <T extends any[], R>(
  resolver: (...args: T) => Promise<R> | R,
  guard: (context: GraphQLContext, ...args: any[]) => any
) => {
  return async (...args: T): Promise<R> => {
    const context = args[2] as GraphQLContext;
    
    try {
      // Apply guard to check authentication/authorization
      await guard(context, ...args);
      
      // If guard passes, execute original resolver
      return await resolver(...args);
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }
  };
};

/**
 * Higher-order function that wraps resolver with role guard
 * @param resolver - Original resolver function
 * @param requiredRole - Required role
 * @returns Wrapped resolver with role check
 */
export const withRole = <T extends any[], R>(
  resolver: (...args: T) => Promise<R> | R,
  requiredRole: keyof typeof AUTHZ_CONFIG.ROLES
) => {
  return withAuth(resolver, roleGuard(requiredRole));
};

/**
 * Higher-order function that wraps resolver with admin guard
 * @param resolver - Original resolver function
 * @returns Wrapped resolver with admin check
 */
export const withAdmin = <T extends any[], R>(
  resolver: (...args: T) => Promise<R> | R
) => {
  return withAuth(resolver, adminGuard);
};

/**
 * Higher-order function that wraps resolver with manager guard
 * @param resolver - Original resolver function
 * @returns Wrapped resolver with manager check
 */
export const withManager = <T extends any[], R>(
  resolver: (...args: T) => Promise<R> | R
) => {
  return withAuth(resolver, managerGuard);
};

/**
 * Higher-order function that wraps resolver with permission guard
 * @param resolver - Original resolver function
 * @param resourceType - Resource type
 * @param resourceIdExtractor - Function to extract resource ID from args
 * @param requiredPermission - Required permission
 * @returns Wrapped resolver with permission check
 */
export const withPermission = <T extends any[], R>(
  resolver: (...args: T) => Promise<R> | R,
  resourceType: 'PROJECT' | 'TASK' | 'COMMENT',
  resourceIdExtractor: (args: any, context: GraphQLContext) => number,
  requiredPermission: keyof typeof AUTHZ_CONFIG.PERMISSIONS
) => {
  return withAuth(resolver, permissionGuard(resourceType, resourceIdExtractor, requiredPermission));
};

/**
 * Higher-order function that wraps resolver with project role guard
 * @param resolver - Original resolver function
 * @param projectIdExtractor - Function to extract project ID from args
 * @param requiredRole - Required project role
 * @returns Wrapped resolver with project role check
 */
export const withProjectRole = <T extends any[], R>(
  resolver: (...args: T) => Promise<R> | R,
  projectIdExtractor: (args: any, context: GraphQLContext) => number,
  requiredRole: keyof typeof AUTHZ_CONFIG.PROJECT_ROLES
) => {
  return withAuth(resolver, projectRoleGuard(projectIdExtractor, requiredRole));
};
