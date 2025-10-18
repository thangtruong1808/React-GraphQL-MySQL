import { Op } from 'sequelize';
import { User, Project, Task, Notification } from '../../db';
import { setActivityContext, clearActivityContext } from '../../db/utils/activityContext';

/**
 * User Management Resolvers
 * Handles CRUD operations for user management in dashboard
 * Follows GraphQL best practices with proper error handling
 */

/**
 * Get paginated users with search functionality
 * Supports searching by first name, last name, or email
 */
export const getUsers = async (
  _: any,
  { limit = 10, offset = 0, search, sortBy = "createdAt", sortOrder = "DESC" }: { 
    limit?: number; 
    offset?: number; 
    search?: string; 
    sortBy?: string; 
    sortOrder?: string; 
  }
) => {
  try {
    // Build search conditions
    const whereConditions: any = {
      isDeleted: false
    };

    // Add search functionality if search term provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereConditions[Op.or] = [
        { firstName: { [Op.like]: searchTerm } },
        { lastName: { [Op.like]: searchTerm } },
        { email: { [Op.like]: searchTerm } }
      ];
    }

    // Get users with pagination
    // Validate and map sortBy field to database column
    const allowedSortFields = ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt', 'updatedAt'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const { count, rows: users } = await User.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [[validSortBy, validSortOrder]],
      attributes: ['id', 'uuid', 'email', 'firstName', 'lastName', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
      raw: false // Ensure we get Sequelize model instances
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      users: users.map(user => ({
        id: user.id.toString(),
        uuid: user.uuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isDeleted: user.isDeleted ?? false,
        version: user.version ?? 1,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString()
      })),
      paginationInfo: {
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        totalCount: count,
        currentPage,
        totalPages
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create a new user
 * Validates input and creates user with hashed password
 */
export const createUser = async (
  _: any,
  { input }: { input: { email: string; password: string; firstName: string; lastName: string; role: string } },
  context: any
) => {
  try {
    // Set activity context for logged-in user
    if (context.user) {
      setActivityContext({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role
      });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({
      where: { email: input.email, isDeleted: false }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = await User.create({
      email: input.email,
      password: input.password, // Will be hashed by model hook
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role
    });

    // Create notification for user creation
    try {
      const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
      await Notification.create({
        userId: newUser.id,
        message: `New user "${input.firstName} ${input.lastName}" (${input.email}) has been created with role "${input.role}" by ${actorName}`
      });
    } catch (notificationError) {
      // Log notification error but don't fail the user creation
      console.error('Failed to create notification for user creation:', notificationError);
    }

    return {
      id: newUser.id.toString(),
      uuid: newUser.uuid,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      isDeleted: newUser.isDeleted ?? false,
      version: newUser.version ?? 1,
      createdAt: newUser.createdAt?.toISOString(),
      updatedAt: newUser.updatedAt?.toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Clear activity context after operation
    clearActivityContext();
  }
};

/**
 * Update an existing user
 * Validates input and updates user fields
 */
export const updateUser = async (
  _: any,
  { id, input }: { id: string; input: { email?: string; firstName?: string; lastName?: string; role?: string } },
  context: any
) => {
  try {
    // Set activity context for logged-in user
    if (context.user) {
      setActivityContext({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role
      });
    }

    // Find user by ID
    const user = await User.findOne({
      where: { id: parseInt(id), isDeleted: false }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is being changed and if it already exists
    if (input.email && input.email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: input.email, isDeleted: false }
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    // Store original values for notification
    const originalData = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };

    // Update user fields
    const updateData: any = {};
    if (input.email) updateData.email = input.email;
    if (input.firstName) updateData.firstName = input.firstName;
    if (input.lastName) updateData.lastName = input.lastName;
    if (input.role) updateData.role = input.role;

    await user.update(updateData);

    // Create notification for user update
    try {
      const changes = [];
      if (input.email && input.email !== originalData.email) {
        changes.push(`email from "${originalData.email}" to "${input.email}"`);
      }
      if (input.firstName && input.firstName !== originalData.firstName) {
        changes.push(`first name from "${originalData.firstName}" to "${input.firstName}"`);
      }
      if (input.lastName && input.lastName !== originalData.lastName) {
        changes.push(`last name from "${originalData.lastName}" to "${input.lastName}"`);
      }
      if (input.role && input.role !== originalData.role) {
        changes.push(`role from "${originalData.role}" to "${input.role}"`);
      }

      if (changes.length > 0) {
        const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
        await Notification.create({
          userId: user.id,
          message: `User "${user.firstName} ${user.lastName}" (${user.email}) has been updated: ${changes.join(', ')} by ${actorName}`
        });
      }
    } catch (notificationError) {
      // Log notification error but don't fail the user update
      console.error('Failed to create notification for user update:', notificationError);
    }

    return {
      id: user.id.toString(),
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isDeleted: user.isDeleted ?? false,
      version: user.version ?? 1,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Clear activity context after operation
    clearActivityContext();
  }
};

/**
 * Delete a user (soft delete)
 * Sets isDeleted flag to true instead of removing from database
 */
export const deleteUser = async (
  _: any,
  { id }: { id: string },
  context: any
) => {
  try {
    // Check if user has admin or project manager role
    if (!context.user || (context.user.role !== 'ADMIN' && context.user.role !== 'Project Manager')) {
      throw new Error('Only administrators and project managers can delete users');
    }

    // Set activity context for logged-in user
    if (context.user) {
      setActivityContext({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role
      });
    }

    // Find user by ID
    const user = await User.findOne({
      where: { id: parseInt(id), isDeleted: false }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user owns any projects
    const ownedProjectsCount = await Project.count({
      where: { ownerId: user.id, isDeleted: false }
    });

    // Check if user has any assigned tasks
    const assignedTasksCount = await Task.count({
      where: { assignedTo: user.id, isDeleted: false }
    });

    // Prevent deletion if user has active projects or tasks
    if (ownedProjectsCount > 0 || assignedTasksCount > 0) {
      throw new Error(`Cannot delete user. They own ${ownedProjectsCount} projects and have ${assignedTasksCount} assigned tasks. Please reassign or delete these first.`);
    }

    // Store user data for notification before deletion
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    // Soft delete user without triggering hooks
    await user.update({ isDeleted: true }, { hooks: false });
    
    // Create notification for user deletion
    try {
      const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
      await Notification.create({
        userId: user.id,
        message: `User "${userData.firstName} ${userData.lastName}" (${userData.email}) with role "${userData.role}" has been deleted by ${actorName}`
      });
    } catch (notificationError) {
      // Log notification error but don't fail the user deletion
      console.error('Failed to create notification for user deletion:', notificationError);
    }
    
    // Manually trigger activity logging for deletion
    const { createActivityLog, generateActionDescription, extractEntityName } = await import('../../db/utils/activityLogger');
    await createActivityLog({
      type: 'USER_DELETED',
      action: generateActionDescription('delete', 'user', extractEntityName(user, 'user')),
      targetUserId: user.id,
      metadata: {
        email: user.email,
        role: user.role
      }
    });

    return true;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Clear activity context after operation
    clearActivityContext();
  }
};

/**
 * Check if user can be deleted
 * Returns deletion eligibility and impact details
 */
export const checkUserDeletion = async (
  _: any,
  { userId }: { userId: string },
  context: any
) => {
  try {
    // Check if user has admin or project manager role
    if (!context.user || (context.user.role !== 'ADMIN' && context.user.role !== 'Project Manager')) {
      throw new Error('Only administrators and project managers can check user deletion eligibility');
    }

    const userIdInt = parseInt(userId);

    // Find user by ID
    const user = await User.findOne({
      where: { id: userIdInt, isDeleted: false }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user owns any projects
    const ownedProjectsCount = await Project.count({
      where: { ownerId: userIdInt, isDeleted: false }
    });

    // Check if user has any assigned tasks
    const assignedTasksCount = await Task.count({
      where: { assignedTo: userIdInt, isDeleted: false }
    });

    const canDelete = ownedProjectsCount === 0 && assignedTasksCount === 0;
    const message = canDelete 
      ? 'User can be safely deleted'
      : `Cannot delete user. They own ${ownedProjectsCount} projects and have ${assignedTasksCount} assigned tasks. Please reassign or delete these first.`;

    return {
      canDelete,
      ownedProjectsCount,
      assignedTasksCount,
      message
    };
  } catch (error) {
    throw new Error(`Failed to check user deletion eligibility: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * User management resolvers object
 * Exports all user management GraphQL resolvers
 */
export const userManagementResolvers = {
  Query: {
    users: getUsers,
    checkUserDeletion
  },
  Mutation: {
    createUser,
    updateUser,
    deleteUser
  }
};
