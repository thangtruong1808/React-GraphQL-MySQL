import { GraphQLError } from 'graphql';
import { User, Permission } from '../../db';
import { GraphQLContext } from '../context';
import { withAdmin, withRole, withAuth } from '../../auth/guard';
import { grantPermission, revokePermission } from '../../auth/permissions';
import { AUTHZ_CONFIG, ERROR_MESSAGES } from '../../constants';

/**
 * Admin Resolvers
 * Demonstrates usage of authorization guards and permissions system
 */

/**
 * Get user permissions (admin only)
 * Demonstrates permission-based authorization
 */
const getUserPermissions = async (_: any, { userId }: { userId: string }, context: GraphQLContext) => {
  try {
    const permissions = await Permission.findAll({
      where: { userId: parseInt(userId, 10) },
      include: [{ model: User, as: 'permissionUser' }],
    });

    return permissions.map(permission => ({
      id: permission.id,
      userId: permission.userId.toString(),
      resourceType: permission.resourceType,
      resourceId: permission.resourceId.toString(),
      permission: permission.permission,
      createdAt: permission.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    throw new GraphQLError(ERROR_MESSAGES.DATABASE_ERROR, {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
};

/**
 * Grant permission to user (admin only)
 * Demonstrates permission management
 */
const grantUserPermission = async (
  _: any,
  { userId, resourceType, resourceId, permission }: {
    userId: string;
    resourceType: 'PROJECT' | 'TASK' | 'COMMENT';
    resourceId: string;
    permission: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
  },
  context: GraphQLContext
) => {
  try {
    const permissionRecord = await grantPermission(
      parseInt(userId, 10),
      resourceType,
      parseInt(resourceId, 10),
      permission
    );

    return {
      id: permissionRecord.id,
      userId: permissionRecord.userId.toString(),
      resourceType: permissionRecord.resourceType,
      resourceId: permissionRecord.resourceId.toString(),
      permission: permissionRecord.permission,
      createdAt: permissionRecord.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('Error granting permission:', error);
    throw new GraphQLError('Failed to grant permission', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
};

/**
 * Revoke permission from user (admin only)
 * Demonstrates permission management
 */
const revokeUserPermission = async (
  _: any,
  { userId, resourceType, resourceId }: {
    userId: string;
    resourceType: 'PROJECT' | 'TASK' | 'COMMENT';
    resourceId: string;
  },
  context: GraphQLContext
) => {
  try {
    const success = await revokePermission(
      parseInt(userId, 10),
      resourceType,
      parseInt(resourceId, 10)
    );

    return {
      success,
      message: success ? 'Permission revoked successfully' : 'Permission not found',
    };
  } catch (error) {
    console.error('Error revoking permission:', error);
    throw new GraphQLError('Failed to revoke permission', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
};

/**
 * Update user role (admin only)
 * Demonstrates role management
 */
const updateUserRole = async (
  _: any,
  { userId, role }: { userId: string; role: 'ADMIN' | 'MANAGER' | 'DEVELOPER' },
  context: GraphQLContext
) => {
  try {
    const user = await User.findByPk(parseInt(userId, 10));
    if (!user) {
      throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND, {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    await user.update({ role });

    return {
      id: user.id.toString(),
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    console.error('Error updating user role:', error);
    throw new GraphQLError('Failed to update user role', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
};

/**
 * Admin resolvers with authorization guards applied
 */
export const adminResolvers = {
  Query: {
    // Get user permissions - requires admin role
    userPermissions: withAdmin(getUserPermissions),
  },
  
  Mutation: {
    // Grant permission - requires admin role
    grantPermission: withAdmin(grantUserPermission),
    
    // Revoke permission - requires admin role
    revokePermission: withAdmin(revokeUserPermission),
    
    // Update user role - requires admin role
    updateUserRole: withAdmin(updateUserRole),
  },
}; 