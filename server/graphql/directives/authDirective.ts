import { GraphQLSchema, GraphQLObjectType, GraphQLField, GraphQLFieldMap } from 'graphql';
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../context';
import { requireAuth, requireRole, requirePermission, requireProjectRole } from '../../auth/permissions';
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
  permission?: keyof typeof AUTHZ_CONFIG.PERMISSIONS;
  resourceType?: 'PROJECT' | 'TASK' | 'COMMENT';
  resourceId?: string; // Field name to extract resource ID from
  projectRole?: keyof typeof AUTHZ_CONFIG.PROJECT_ROLES;
  projectId?: string; // Field name to extract project ID from
}

/**
 * Extract resource ID from resolver arguments
 * @param args - Resolver arguments
 * @param resourceIdField - Field name containing resource ID
 * @returns Resource ID
 */
const extractResourceId = (args: any, resourceIdField: string): number => {
  const resourceId = args[resourceIdField];
  if (!resourceId) {
    throw new GraphQLError(`Resource ID field '${resourceIdField}' is required`, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  return parseInt(resourceId, 10);
};

/**
 * Extract project ID from resolver arguments
 * @param args - Resolver arguments
 * @param projectIdField - Field name containing project ID
 * @returns Project ID
 */
const extractProjectId = (args: any, projectIdField: string): number => {
  const projectId = args[projectIdField];
  if (!projectId) {
    throw new GraphQLError(`Project ID field '${projectIdField}' is required`, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  return parseInt(projectId, 10);
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
        const user = requireAuth(context);

        // Check role if specified
        if (directiveArgs.role) {
          requireRole(context, directiveArgs.role);
        }

        // Check permission if specified
        if (directiveArgs.permission && directiveArgs.resourceType && directiveArgs.resourceId) {
          const resourceId = extractResourceId(args, directiveArgs.resourceId);
          await requirePermission(context, directiveArgs.resourceType, resourceId, directiveArgs.permission);
        }

        // Check project role if specified
        if (directiveArgs.projectRole && directiveArgs.projectId) {
          const projectId = extractProjectId(args, directiveArgs.projectId);
          await requireProjectRole(context, projectId, directiveArgs.projectRole);
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
 * Helper function to create @auth directive for permission-based access
 * @param permission - Required permission
 * @param resourceType - Resource type
 * @param resourceIdField - Field name containing resource ID
 * @returns Directive string
 */
export const authPermission = (
  permission: keyof typeof AUTHZ_CONFIG.PERMISSIONS,
  resourceType: 'PROJECT' | 'TASK' | 'COMMENT',
  resourceIdField: string
): string => {
  return `@auth(permission: ${permission}, resourceType: ${resourceType}, resourceId: "${resourceIdField}")`;
};

/**
 * Helper function to create @auth directive for project role access
 * @param projectRole - Required project role
 * @param projectIdField - Field name containing project ID
 * @returns Directive string
 */
export const authProjectRole = (
  projectRole: keyof typeof AUTHZ_CONFIG.PROJECT_ROLES,
  projectIdField: string
): string => {
  return `@auth(projectRole: ${projectRole}, projectId: "${projectIdField}")`;
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
 *   project(id: ID!): Project @auth(permission: READ, resourceType: PROJECT, resourceId: "id")
 *   task(id: ID!): Task @auth(permission: READ, resourceType: TASK, resourceId: "id")
 *   projectMembers(projectId: ID!): [ProjectMember!]! @auth(projectRole: VIEWER, projectId: "projectId")
 * }
 * 
 * type Mutation {
 *   createProject(input: CreateProjectInput!): Project! @auth(role: MANAGER)
 *   updateProject(id: ID!, input: UpdateProjectInput!): Project! @auth(permission: WRITE, resourceType: PROJECT, resourceId: "id")
 *   deleteProject(id: ID!): Boolean! @auth(permission: DELETE, resourceType: PROJECT, resourceId: "id")
 * }
 */
