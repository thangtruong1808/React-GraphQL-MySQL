import { Op } from 'sequelize';
import { User } from '../../db';
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

    // Update user fields
    const updateData: any = {};
    if (input.email) updateData.email = input.email;
    if (input.firstName) updateData.firstName = input.firstName;
    if (input.lastName) updateData.lastName = input.lastName;
    if (input.role) updateData.role = input.role;

    await user.update(updateData);

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

    // Soft delete user and log activity
    await user.update({ isDeleted: true });
    
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
 * User management resolvers object
 * Exports all user management GraphQL resolvers
 */
export const userManagementResolvers = {
  Query: {
    users: getUsers
  },
  Mutation: {
    createUser,
    updateUser,
    deleteUser
  }
};
