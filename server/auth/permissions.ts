import { GraphQLError } from 'graphql';
import { User, Project, ProjectMember, Task, Comment, Permission } from '../db';
import { AUTHZ_CONFIG, ERROR_MESSAGES } from '../constants';
import { GraphQLContext } from '../graphql/context';

/**
 * Permission System
 * Handles role-based access control and fine-grained permissions
 */

/**
 * Check if user has required role
 * @param user - User object with role
 * @param requiredRole - Minimum required role
 * @returns True if user has sufficient role
 */
export const hasRole = (user: User, requiredRole: keyof typeof AUTHZ_CONFIG.ROLES): boolean => {
  if (!user || !user.role) return false;
  
  const userRoleLevel = AUTHZ_CONFIG.ROLES[user.role as keyof typeof AUTHZ_CONFIG.ROLES];
  const requiredRoleLevel = AUTHZ_CONFIG.ROLES[requiredRole];
  
  return userRoleLevel >= requiredRoleLevel;
};

/**
 * Check if user has specific permission on resource
 * @param userId - User ID
 * @param resourceType - Type of resource (PROJECT, TASK, COMMENT)
 * @param resourceId - Resource ID
 * @param requiredPermission - Required permission level
 * @returns Promise<boolean> - True if user has permission
 */
export const hasPermission = async (
  userId: number,
  resourceType: 'PROJECT' | 'TASK' | 'COMMENT',
  resourceId: number,
  requiredPermission: keyof typeof AUTHZ_CONFIG.PERMISSIONS
): Promise<boolean> => {
  try {
    // Find specific permission for this user and resource
    const permission = await Permission.findOne({
      where: {
        userId,
        resourceType: AUTHZ_CONFIG.RESOURCE_TYPES[resourceType],
        resourceId,
      },
    });

    if (!permission) return false;

    // Check permission hierarchy
    const permissionLevels = {
      READ: 1,
      WRITE: 2,
      DELETE: 3,
      ADMIN: 4,
    };

    const userPermissionLevel = permissionLevels[permission.permission];
    const requiredPermissionLevel = permissionLevels[requiredPermission];

    return userPermissionLevel >= requiredPermissionLevel;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Check if user is project member with specific role
 * @param userId - User ID
 * @param projectId - Project ID
 * @param requiredRole - Required project role
 * @returns Promise<boolean> - True if user has project role
 */
export const hasProjectRole = async (
  userId: number,
  projectId: number,
  requiredRole: keyof typeof AUTHZ_CONFIG.PROJECT_ROLES
): Promise<boolean> => {
  try {
    const membership = await ProjectMember.findOne({
      where: {
        userId,
        projectId,
        isDeleted: false,
      },
    });

    if (!membership) return false;

    // Check project role hierarchy
    const roleLevels = {
      VIEWER: 1,
      EDITOR: 2,
      OWNER: 3,
    };

    const userRoleLevel = roleLevels[membership.getDataValue('role') as keyof typeof roleLevels];
    const requiredRoleLevel = roleLevels[requiredRole];

    return userRoleLevel >= requiredRoleLevel;
  } catch (error) {
    console.error('Error checking project role:', error);
    return false;
  }
};

/**
 * Check if user owns the resource
 * @param userId - User ID
 * @param resourceType - Type of resource
 * @param resourceId - Resource ID
 * @returns Promise<boolean> - True if user owns the resource
 */
export const isResourceOwner = async (
  userId: number,
  resourceType: 'PROJECT' | 'TASK' | 'COMMENT',
  resourceId: string | number
): Promise<boolean> => {
  try {
    switch (resourceType) {
      case 'PROJECT':
        const project = await Project.findByPk(resourceId);
        // For projects, we need to check if the user is the owner
        // Projects use owner_id (INT) not UUID
        if (project?.getDataValue('owner_id')) {
          return project.getDataValue('owner_id') === userId;
        }
        return false;
      
      case 'TASK':
        const task = await Task.findByPk(resourceId);
        // For tasks, we need to check if the user is the assignee
        // Tasks use assigned_to (INT) not UUID
        if (task?.getDataValue('assigned_to')) {
          return task.getDataValue('assigned_to') === userId;
        }
        return false;
      
      case 'COMMENT':
        const comment = await Comment.findByPk(resourceId);
        // For comments, we need to check if the user is the author
        // Comments use user_id (INT) not UUID
        if (comment?.getDataValue('user_id')) {
          return comment.getDataValue('user_id') === userId;
        }
        return false;
      
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking resource ownership:', error);
    return false;
  }
};

/**
 * Require authentication - throws error if user not authenticated
 * @param context - GraphQL context
 * @returns User object if authenticated
 */
export const requireAuth = (context: GraphQLContext): User => {
  if (!context.user) {
    throw new GraphQLError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.user;
};

/**
 * Require specific role - throws error if user doesn't have role
 * @param context - GraphQL context
 * @param requiredRole - Required role
 * @returns User object if has role
 */
export const requireRole = (context: GraphQLContext, requiredRole: keyof typeof AUTHZ_CONFIG.ROLES): User => {
  const user = requireAuth(context);
  
  if (!hasRole(user, requiredRole)) {
    throw new GraphQLError(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS, {
      extensions: { code: 'FORBIDDEN' },
    });
  }
  
  return user;
};

/**
 * Require permission on resource - throws error if user doesn't have permission
 * @param context - GraphQL context
 * @param resourceType - Resource type
 * @param resourceId - Resource ID
 * @param requiredPermission - Required permission
 * @returns Promise<User> - User object if has permission
 */
export const requirePermission = async (
  context: GraphQLContext,
  resourceType: 'PROJECT' | 'TASK' | 'COMMENT',
  resourceId: number,
  requiredPermission: keyof typeof AUTHZ_CONFIG.PERMISSIONS
): Promise<User> => {
  const user = requireAuth(context);
  
  // Admins have all permissions
  if (hasRole(user, 'ADMIN')) {
    return user;
  }
  
  // Check specific permission
  const hasSpecificPermission = await hasPermission(user.id, resourceType, resourceId, requiredPermission);
  if (hasSpecificPermission) {
    return user;
  }
  
  // Check if user owns the resource
  const isOwner = await isResourceOwner(user.id, resourceType, resourceId);
  if (isOwner) {
    return user;
  }
  
  throw new GraphQLError(ERROR_MESSAGES.ACCESS_DENIED, {
    extensions: { code: 'FORBIDDEN' },
  });
};

/**
 * Require project role - throws error if user doesn't have project role
 * @param context - GraphQL context
 * @param projectId - Project ID
 * @param requiredRole - Required project role
 * @returns Promise<User> - User object if has project role
 */
export const requireProjectRole = async (
  context: GraphQLContext,
  projectId: number,
  requiredRole: keyof typeof AUTHZ_CONFIG.PROJECT_ROLES
): Promise<User> => {
  const user = requireAuth(context);
  
  // Admins have all project permissions
  if (hasRole(user, 'ADMIN')) {
    return user;
  }
  
  // Check project membership and role
  const hasProjectAccess = await hasProjectRole(user.id, projectId, requiredRole);
  if (hasProjectAccess) {
    return user;
  }
  
  throw new GraphQLError(ERROR_MESSAGES.ACCESS_DENIED, {
    extensions: { code: 'FORBIDDEN' },
  });
};

/**
 * Grant permission to user on resource
 * @param userId - User ID
 * @param resourceType - Resource type
 * @param resourceId - Resource ID
 * @param permission - Permission level
 * @returns Promise<Permission> - Created permission
 */
export const grantPermission = async (
  userId: number,
  resourceType: 'PROJECT' | 'TASK' | 'COMMENT',
  resourceId: number,
  permission: keyof typeof AUTHZ_CONFIG.PERMISSIONS
): Promise<Permission> => {
  try {
    const [permissionRecord] = await Permission.findOrCreate({
      where: {
        userId,
        resourceType: AUTHZ_CONFIG.RESOURCE_TYPES[resourceType],
        resourceId,
      },
      defaults: {
        userId,
        resourceType: AUTHZ_CONFIG.RESOURCE_TYPES[resourceType],
        resourceId,
        permission: AUTHZ_CONFIG.PERMISSIONS[permission],
      },
    });

    // Update permission if it already exists
    if (permissionRecord.permission !== AUTHZ_CONFIG.PERMISSIONS[permission]) {
      await permissionRecord.update({
        permission: AUTHZ_CONFIG.PERMISSIONS[permission],
      });
    }

    return permissionRecord;
  } catch (error) {
    console.error('Error granting permission:', error);
    throw new GraphQLError('Failed to grant permission', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
};

/**
 * Revoke permission from user on resource
 * @param userId - User ID
 * @param resourceType - Resource type
 * @param resourceId - Resource ID
 * @returns Promise<boolean> - True if permission was revoked
 */
export const revokePermission = async (
  userId: number,
  resourceType: 'PROJECT' | 'TASK' | 'COMMENT',
  resourceId: number
): Promise<boolean> => {
  try {
    const deletedCount = await Permission.destroy({
      where: {
        userId,
        resourceType: AUTHZ_CONFIG.RESOURCE_TYPES[resourceType],
        resourceId,
      },
    });

    return deletedCount > 0;
  } catch (error) {
    console.error('Error revoking permission:', error);
    throw new GraphQLError('Failed to revoke permission', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
};
