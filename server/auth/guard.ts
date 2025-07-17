import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../graphql/context';
import { AUTHZ_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Authentication Guard
 * Provides middleware functions for protecting GraphQL resolvers
 */

/**
 * Guard function that requires authentication
 * @param context - GraphQL context
 * @returns User object if authenticated
 */
export const authGuard = (context: GraphQLContext) => {
  if (!context.user) {
    throw new GraphQLError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.user;
};

/**
 * Guard function that requires specific role
 * @param requiredRole - Minimum required role
 * @returns Function that takes context and returns user if authorized
 */
export const roleGuard = (requiredRole: keyof typeof AUTHZ_CONFIG.ROLES) => {
  return (context: GraphQLContext) => {
    const user = authGuard(context);
    
    const userRoleLevel = AUTHZ_CONFIG.ROLES[user.role as keyof typeof AUTHZ_CONFIG.ROLES];
    const requiredRoleLevel = AUTHZ_CONFIG.ROLES[requiredRole];
    
    if (userRoleLevel < requiredRoleLevel) {
      throw new GraphQLError(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS, {
        extensions: { code: 'FORBIDDEN' },
      });
    }
    
    return user;
  };
};

/**
 * Guard function that requires admin role
 * @param context - GraphQL context
 * @returns User object if admin
 */
export const adminGuard = (context: GraphQLContext) => {
  return roleGuard('ADMIN')(context);
};

/**
 * Guard function that requires manager or higher role
 * @param context - GraphQL context
 * @returns User object if manager or admin
 */
export const managerGuard = (context: GraphQLContext) => {
  return roleGuard('MANAGER')(context);
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
