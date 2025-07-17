import { GraphQLSchema, GraphQLObjectType, GraphQLField, GraphQLFieldMap } from 'graphql';
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../context';
import { AUTHZ_CONFIG, ERROR_MESSAGES } from '../../constants';

/**
 * GraphQL Authorization Directive
 * Provides schema-level authorization using @auth directive
 */

// Directive name
const AUTH_DIRECTIVE = 'auth';

/**
 * Authorization directive arguments
 */
interface AuthDirectiveArgs {
  role?: keyof typeof AUTHZ_CONFIG.ROLES;
}

/**
 * Check if user has required role
 * @param user - User object with role
 * @param requiredRole - Minimum required role
 * @returns True if user has sufficient role
 */
const hasRole = (user: any, requiredRole: keyof typeof AUTHZ_CONFIG.ROLES): boolean => {
  if (!user || !user.role) return false;
  
  const userRoleLevel = AUTHZ_CONFIG.ROLES[user.role as keyof typeof AUTHZ_CONFIG.ROLES];
  const requiredRoleLevel = AUTHZ_CONFIG.ROLES[requiredRole];
  
  return userRoleLevel >= requiredRoleLevel;
};

/**
 * Create authorization middleware for a field
 * @param directiveArgs - Directive arguments
 * @returns Authorization middleware function
 */
const createAuthMiddleware = (directiveArgs: AuthDirectiveArgs) => {
  return (resolve: any) => {
    return async (parent: any, args: any, context: GraphQLContext, info: any) => {
      try {
        // Check authentication first
        if (!context.user) {
          throw new GraphQLError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        // Check role if specified
        if (directiveArgs.role && !hasRole(context.user, directiveArgs.role)) {
          throw new GraphQLError(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS, {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        // If all checks pass, execute the resolver
        return await resolve(parent, args, context, info);
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError(ERROR_MESSAGES.ACCESS_DENIED, {
          extensions: { code: 'FORBIDDEN' },
        });
      }
    };
  };
};

/**
 * Apply authorization directive to GraphQL schema
 * @param schema - GraphQL schema
 * @returns Schema with authorization applied
 */
export const applyAuthDirective = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, AUTH_DIRECTIVE)?.[0];
      
      if (authDirective) {
        const { resolve } = fieldConfig;
        
        // Create authorization middleware
        const authMiddleware = createAuthMiddleware(authDirective);
        
        // Wrap the resolver with authorization
        return {
          ...fieldConfig,
          resolve: authMiddleware(resolve),
        };
      }
      
      return fieldConfig;
    },
  });
};

/**
 * Helper function to create @auth directive for role-based access
 * @param role - Required role
 * @returns Directive string
 */
export const authRole = (role: keyof typeof AUTHZ_CONFIG.ROLES): string => {
  return `@auth(role: ${role})`;
};

/**
 * Helper function to create @auth directive for authentication only
 * @returns Directive string
 */
export const authRequired = (): string => {
  return '@auth';
};

/**
 * Example usage in schema:
 * 
 * type Query {
 *   users: [User!]! @auth(role: ADMIN)
 *   projects: [Project!]! @auth(role: MANAGER)
 *   tasks: [Task!]! @auth
 * }
 * 
 * type Mutation {
 *   createProject(input: CreateProjectInput!): Project! @auth(role: MANAGER)
 *   updateProject(id: ID!, input: UpdateProjectInput!): Project! @auth(role: MANAGER)
 *   deleteProject(id: ID!): Boolean! @auth(role: ADMIN)
 * }
 */
