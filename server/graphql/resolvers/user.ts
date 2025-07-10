import { GraphQLContext } from '../context';
import { User, RefreshToken } from '../../db/index';
import { Op } from 'sequelize';
import { JWT_CONFIG } from '../../constants';

/**
 * User Resolvers
 * Handles user-related GraphQL operations with JWT refresh token authentication
 */

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

const validateName = (name: string): boolean => {
  return name.length >= 1 && name.length <= 50;
};

/**
 * User Resolvers
 */
export const userResolvers = {
  Query: {

    /**
     * Get user by ID (admin only)
     * @param _ - Parent resolver
     * @param args - Arguments containing user ID
     * @param context - GraphQL context with user
     * @returns User or null if not found
     */
    user: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      try {
        // Check authentication and admin role
        if (!context.isAuthenticated || !context.user) {
          throw new Error('Authentication required');
        }
        
        if (context.user.role !== 'ADMIN') {
          throw new Error('Admin access required');
        }

        const user = await User.findByPk(id);
        if (!user) {
          return null;
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },

    /**
     * Get all users with pagination (admin only)
     * @param _ - Parent resolver
     * @param args - Arguments containing limit and offset
     * @param context - GraphQL context with user
     * @returns Array of users
     */
    users: async (_: any, { limit = 10, offset = 0 }: { limit?: number; offset?: number }, context: GraphQLContext) => {
      try {
        // Check authentication and admin role
        if (!context.isAuthenticated || !context.user) {
          throw new Error('Authentication required');
        }
        
        if (context.user.role !== 'ADMIN') {
          throw new Error('Admin access required');
        }

        const users = await User.findAll({
          limit,
          offset,
          attributes: { exclude: ['password'] }, // Exclude password from response
          order: [['createdAt', 'DESC']],
        });

        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },

    /**
     * Get users with active session info (admin only)
     * @param _ - Parent resolver
     * @param __ - Arguments
     * @param context - GraphQL context with user
     * @returns Array of user session info
     */
    usersWithSessions: async (_: any, __: any, context: GraphQLContext) => {
      try {
        // Check authentication and admin role
        if (!context.isAuthenticated || !context.user) {
          throw new Error('Authentication required');
        }
        
        if (context.user.role !== 'ADMIN') {
          throw new Error('Admin access required');
        }

        // Get all users with their active token counts
        const users = await User.findAll({
          where: { isDeleted: false },
          attributes: ['id', 'email'],
        });

        const sessionInfo = await Promise.all(
          users.map(async (user) => {
            const activeTokenCount = await RefreshToken.count({
              where: {
                userId: user.id,
                isRevoked: false,
                expiresAt: {
                  [Op.gt]: new Date(),
                },
              },
            });

            return {
              userId: user.id.toString(),
              userEmail: user.email,
              activeTokens: activeTokenCount,
              maxAllowed: JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER,
              isAtLimit: activeTokenCount >= JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER,
            };
          })
        );

        return sessionInfo;
      } catch (error) {
        console.error('Error fetching users with sessions:', error);
        throw error;
      }
    },
  },

  Mutation: {

    /**
     * Update user (admin or self)
     * @param _ - Parent resolver
     * @param args - Arguments containing user ID and update input
     * @param context - GraphQL context with user
     * @returns Updated user
     */
    updateUser: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      try {
        // Check authentication
        if (!context.isAuthenticated || !context.user) {
          throw new Error('Authentication required');
        }

        // Check permissions (admin or self)
        const isAdmin = context.user.role === 'ADMIN';
        const isSelf = context.user.id.toString() === id;

        if (!isAdmin && !isSelf) {
          throw new Error('Access denied');
        }

        // Find user to update
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error('User not found');
        }

        // Validate email if provided
        if (input.email && !validateEmail(input.email)) {
          throw new Error('Invalid email format');
        }

        // Validate names if provided
        if (input.firstName && !validateName(input.firstName)) {
          throw new Error('First name must be between 1 and 50 characters');
        }

        if (input.lastName && !validateName(input.lastName)) {
          throw new Error('Last name must be between 1 and 50 characters');
        }

        // Check for email conflicts
        if (input.email) {
          const existingUser = await User.findOne({
            where: {
              [Op.and]: [
                { email: input.email },
                { id: { [Op.ne]: id } },
              ],
            },
          });

          if (existingUser) {
            throw new Error('Email already registered');
          }
        }

        // Update user
        await user.update(input);

        // Return updated user without password
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
      } catch (error) {
        console.error('Update user error:', error);
        throw error;
      }
    },

    /**
     * Delete user (admin only)
     * @param _ - Parent resolver
     * @param args - Arguments containing user ID
     * @param context - GraphQL context with user
     * @returns Success status
     */
    deleteUser: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      try {
        // Check authentication and admin role
        if (!context.isAuthenticated || !context.user) {
          throw new Error('Authentication required');
        }
        
        if (context.user.role !== 'ADMIN') {
          throw new Error('Admin access required');
        }

        // Prevent admin from deleting themselves
        if (context.user.id.toString() === id) {
          throw new Error('Cannot delete your own account');
        }

        const user = await User.findByPk(id);
        if (!user) {
          throw new Error('User not found');
        }

        await user.destroy();
        return true;
      } catch (error) {
        console.error('Delete user error:', error);
        throw error;
      }
    },
  },
};
